import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

// =========================
// Smart Search & Ranking Helper
// =========================

// Damerau-Levenshtein distance for typo/fuzzy matching
function getDamerauLevenshteinDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) d[i][0] = i;
  for (let j = 0; j <= b.length; j++) d[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost); // transposition
      }
    }
  }
  return d[a.length][b.length];
}

// Check if two words are fuzzy matches (allowing 1-2 edit distance depending on length)
function isFuzzyMatchWord(word1, word2) {
  if (word1 === word2) return true;
  const len1 = word1.length;
  const len2 = word2.length;

  if (Math.abs(len1 - len2) > 2) return false;
  if (len1 < 3 || len2 < 3) return false;

  if (len1 >= 4 && len2 >= 4 && (word1.includes(word2) || word2.includes(word1))) {
    return true;
  }

  const dist = getDamerauLevenshteinDistance(word1, word2);
  const maxAllowedDist = Math.min(len1, len2) > 5 ? 2 : 1;
  return dist <= maxAllowedDist;
}

// Calculate relevance score for a product based on search query
function calculateProductScore(product, cleanQuery, queryTokens, normQuery) {
  const name = (product.name || "").toLowerCase();
  const catName = (product.category?.name || "").toLowerCase();
  const catSlug = (product.category?.slug || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const sku = (product.sku || "").toLowerCase();
  const sizes = (product.sizes || []).join(" ").toLowerCase();

  const normName = name.replace(/[\s\-_]/g, "");

  let score = 0;
  let isExact = false;

  // 1. Exact product name match
  if (name === cleanQuery) {
    score += 1000;
    isExact = true;
  }

  // 2. Exact SKU match
  if (sku && sku === cleanQuery) {
    score += 900;
    isExact = true;
  }

  // 3. Exact brand/category match
  if (catName === cleanQuery || catSlug === cleanQuery) {
    score += 800;
    if (name === cleanQuery) isExact = true;
  }

  // 4. Product name starts with or contains exact query phrase
  if (name.startsWith(cleanQuery)) {
    score += 700;
  } else if (name.includes(cleanQuery)) {
    score += 600;
  }

  // 5. Space-insensitive / normalized match (e.g., "airmax" matches "Air Max")
  if (normQuery.length >= 3 && (normName.includes(normQuery) || normQuery.includes(normName))) {
    score += 550;
  }

  // 6. Category or Description contains phrase
  if (catName.includes(cleanQuery) || catSlug.includes(cleanQuery)) {
    score += 500;
  }
  if (desc.includes(cleanQuery)) {
    score += 400;
  }

  // 7. Token-based matching & fuzzy matching
  const productWords = `${name} ${catName} ${desc} ${sku} ${sizes}`
    .split(/[\s\-_,.]+/)
    .filter((w) => w.length > 0);
  const nameWords = name.split(/[\s\-_,.]+/).filter((w) => w.length > 0);
  const catWords = catName.split(/[\s\-_,.]+/).filter((w) => w.length > 0);

  let tokensMatchedInName = 0;
  let tokensMatchedTotal = 0;

  for (const token of queryTokens) {
    const normToken = token.replace(/[\s\-_]/g, "");
    let tokenMatched = false;

    // Exact or prefix token match in name
    if (nameWords.some((w) => w === token || w.startsWith(token))) {
      score += 150;
      tokensMatchedInName++;
      tokensMatchedTotal++;
      tokenMatched = true;
    } else if (catWords.some((w) => w === token || w.startsWith(token))) {
      score += 120;
      tokensMatchedTotal++;
      tokenMatched = true;
    } else if (productWords.some((w) => w === token || w.includes(token))) {
      score += 60;
      tokensMatchedTotal++;
      tokenMatched = true;
    } else if (normToken.length >= 3 && normName.includes(normToken)) {
      score += 100;
      tokensMatchedInName++;
      tokensMatchedTotal++;
      tokenMatched = true;
    }

    // Fuzzy token match if exact token didn't match
    if (!tokenMatched && token.length >= 3) {
      if (nameWords.some((w) => isFuzzyMatchWord(token, w))) {
        score += 100;
        tokensMatchedInName++;
        tokensMatchedTotal++;
        tokenMatched = true;
      } else if (productWords.some((w) => isFuzzyMatchWord(token, w))) {
        score += 60;
        tokensMatchedTotal++;
        tokenMatched = true;
      }
    }
  }

  // Multi-token bonus
  if (queryTokens.length > 1) {
    if (tokensMatchedInName === queryTokens.length) {
      score += 350; // All query words match in product name
    } else if (tokensMatchedTotal === queryTokens.length) {
      score += 250; // All query words match across product fields
    } else if (tokensMatchedTotal > 0) {
      score += tokensMatchedTotal * 40;
    }
  }

  return { product, score, isExact };
}

function scoreAndRankProducts(products, queryStr) {
  const cleanQuery = queryStr.toLowerCase().trim();
  const normQuery = cleanQuery.replace(/[\s\-_]/g, "");
  const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 0);

  const scored = products.map((product) =>
    calculateProductScore(product, cleanQuery, queryTokens, normQuery)
  );

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored;
}

// =========================
// Get All Products (with Category & Search filtering)
// =========================
export const getAllProductsController = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const foundCategory = await Category.findOne({
          $or: [
            { slug: category.toLowerCase() },
            { name: { $regex: new RegExp(`^${category}$`, "i") } },
          ],
        });

        if (foundCategory) {
          filter.category = foundCategory._id;
        } else {
          return res.status(200).json({
            success: true,
            count: 0,
            products: [],
          });
        }
      }
    }

    let products = await Product.find(filter)
      .populate("category", "name slug");

    if (search && search.trim()) {
      const queryStr = search.trim();
      const scoredItems = scoreAndRankProducts(products, queryStr);
      // Keep products with positive relevance score
      const matchedItems = scoredItems.filter((item) => item.score > 0);
      const exactMatch = matchedItems.some((item) => item.isExact);

      res.status(200).json({
        success: true,
        count: matchedItems.length,
        products: matchedItems.map((item) => item.product),
        isFuzzyMatch: !exactMatch && matchedItems.length > 0,
        searchQuery: queryStr,
      });
    } else {
      res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: error.message,
    });
  }
};


// =========================
// Get Single Product
// =========================
export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error.message,
    });
  }
};


// =========================
// Create Product - Admin
// =========================
export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      sku,
      sizes,
      stock,
    } = req.body;

    // Upload images to Cloudinary
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(file.buffer);
        });

        imageUrls.push(result.secure_url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      images: imageUrls,
      category,
      sku,
      sizes,
      stock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};


// =========================
// Update Product - Admin
// =========================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
    };

    // Agar new images aayi hain tabhi Cloudinary upload karo
    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(file.buffer);
        });

        imageUrls.push(result.secure_url);
      }

      updateData.images = imageUrls;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};


// =========================
// Delete Product - Admin
// =========================
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

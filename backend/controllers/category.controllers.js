import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";
import cloudinary from "../config/cloudinary.js";

// =========================
// Get All Categories
// =========================
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get categories",
    });
  }
};


// =========================
// Create Category - Admin
// =========================
export const createCategoryController = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required",
      });
    }

    // Agar image upload ki hai toh Cloudinary par bhejo
    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const category = await Category.create({
      name,
      slug,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};


// =========================
// Update Category - Admin
// =========================
export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // Update data
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;

    // Agar nayi image upload ki hai toh Cloudinary par bhejo
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updateData.image = result.secure_url;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update category",
    });
  }
};


// =========================
// Delete Category - Admin
// =========================
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check karo ki is category me products hain ya nahi
    const products = await Product.exists({ category: id });

    if (products) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category because products exist in this category",
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

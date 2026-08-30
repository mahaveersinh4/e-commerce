import mongoose from "mongoose";

import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

// =========================
// Get User Cart
// =========================
export const getCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
      .populate("products.product", "name price images stock sizes category");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          products: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message,
    });
  }
};


// =========================
// Add Product To Cart
// =========================
export const addToCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const { product: productId, quantity = 1, size } = req.body;

    // Check product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    // If product has sizes, size is required
    if (product.sizes && product.sizes.length > 0) {
      if (!size) {
        return res.status(400).json({
          success: false,
          message: "Please select a size",
        });
      }

      // Check selected size
      if (!product.sizes.includes(size)) {
        return res.status(400).json({
          success: false,
          message: "Selected size is not available",
        });
      }
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: userId });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [],
      });
    }

    // Check if same product + same size already exists
    const existingItem = cart.products.find(
      (item) =>
        item.product.toString() === productId.toString() &&
        item.size === size
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      // Check stock after increasing quantity
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
        size,
      });
    }

    await cart.save();

    await cart.populate(
      "products.product",
      "name price images stock sizes category"
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};


// =========================
// Update Cart Item
// =========================
export const updateCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    const { quantity, size } = req.body;

    // Check cart item ID
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    // At least one field must be provided
    if (quantity === undefined && size === undefined) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    // Check quantity
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 1)) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find cart item
    const cartItem = cart.products.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Find product
    const product = await Product.findById(cartItem.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update quantity
    if (quantity !== undefined) {
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      cartItem.quantity = quantity;
    }

    // Update size
    if (size !== undefined) {
      if (product.sizes && product.sizes.length > 0) {
        if (!product.sizes.includes(size)) {
          return res.status(400).json({
            success: false,
            message: "Selected size is not available",
          });
        }
      }

      // Check if another cart item already has
      // same product + selected size
      const duplicateItem = cart.products.find(
        (item) =>
          item._id.toString() !== itemId &&
          item.product.toString() === cartItem.product.toString() &&
          (item.size || null) === (size || null)
      );

      if (duplicateItem) {
        const newQuantity = duplicateItem.quantity + cartItem.quantity;

        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: "Requested quantity exceeds available stock",
          });
        }

        duplicateItem.quantity = newQuantity;

        cart.products.pull(itemId);
      } else {
        cartItem.size = size || undefined;
      }
    }

    await cart.save();

    await cart.populate(
      "products.product",
      "name price images stock sizes category"
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};


// =========================
// Remove Product From Cart
// =========================
export const removeFromCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    // Check cart item ID
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.products.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.products.pull(itemId);

    await cart.save();

    await cart.populate(
      "products.product",
      "name price images stock sizes category"
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
      error: error.message,
    });
  }
};


// =========================
// Clear Cart
// =========================
export const clearCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.products = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

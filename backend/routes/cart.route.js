import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getCartController,
  addToCartController,
  updateCartController,
  removeFromCartController,
  clearCartController,
} from "../controllers/cart.controllers.js";

const router = express.Router();

// =========================
// User Routes
// =========================

// Get user's cart
router.get("/", authMiddleware, getCartController);

// Add product to cart
router.post("/", authMiddleware, addToCartController);

// Update cart item
router.patch("/:itemId", authMiddleware, updateCartController);

// Remove product from cart
router.delete("/:itemId", authMiddleware, removeFromCartController);

// Clear entire cart
router.delete("/", authMiddleware, clearCartController);

export default router;

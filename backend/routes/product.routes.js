import express from "express";
import { adminSessionMiddleware } from "../middleware/adminSession.middleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProduct,
  deleteProductController,
} from "../controllers/product.controllers.js";

const router = express.Router();

// =========================
// Public Routes
// =========================

// Get all products
router.get("/", getAllProductsController);

// Get single product
router.get("/:id", getProductByIdController);

// =========================
// Admin Routes
// =========================

// Create product
router.post("/", adminSessionMiddleware, upload.array("images", 5), createProductController);

// Update product
router.patch("/:id", adminSessionMiddleware, upload.array("images", 5), updateProduct);

// Delete product
router.delete("/:id", adminSessionMiddleware, deleteProductController);

export default router;

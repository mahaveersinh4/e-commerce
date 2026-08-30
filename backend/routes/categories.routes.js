import express from "express";
import { adminSessionMiddleware } from "../middleware/adminSession.middleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getAllCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controllers.js";

const router = express.Router();

// =========================
// Public Routes
// =========================

// Get all categories
router.get("/", getAllCategoriesController);

// =========================
// Admin Routes
// =========================

// Create category — upload.single("image") ek image lete hai
router.post("/", adminSessionMiddleware, upload.single("image"), createCategoryController);

// Update category — image optional hai
router.patch("/:id", adminSessionMiddleware, upload.single("image"), updateCategoryController);

// Delete category
router.delete("/:id", adminSessionMiddleware, deleteCategoryController);

export default router;

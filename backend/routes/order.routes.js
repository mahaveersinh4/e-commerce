import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminSessionMiddleware } from "../middleware/adminSession.middleware.js";
import {
  createOrderController,
  getMyOrdersController,
  getMyOrderByIdController,
  cancelOrderController,
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/order.controllers.js";

const router = express.Router();

// =========================
// Admin Routes
// =========================

// Get all orders (admin only)
router.get("/admin/all", adminSessionMiddleware, getAllOrdersController);

// Update order status (admin only)
router.patch("/admin/:id/status", adminSessionMiddleware, updateOrderStatusController);

// =========================
// User Routes
// =========================

// Create new order
router.post("/", authMiddleware, createOrderController);

// Get all orders of logged-in user
router.get("/", authMiddleware, getMyOrdersController);

// Cancel user's order
router.patch("/:id/cancel", authMiddleware, cancelOrderController);

// Get single order of logged-in user
router.get("/:id", authMiddleware, getMyOrderByIdController);

export default router;

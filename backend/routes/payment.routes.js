import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPaymentController,
  getPaymentController,
  completePaymentController,
} from "../controllers/payment.controllers.js";

const router = express.Router();

// Create payment + generate QR
router.post("/", authMiddleware, createPaymentController);

// Get payment details
router.get("/:paymentId", authMiddleware, getPaymentController);

// Fake UPI payment successful
router.post("/:paymentId/success", authMiddleware, completePaymentController);

export default router;
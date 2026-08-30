import crypto from "crypto";
import QRCode from "qrcode";

import Payment from "../models/Payment.model.js";
import Order from "../models/Order.model.js";

// Create payment + generate QR
export const createPaymentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;

    // Check user's order
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Payment only for online orders
    if (order.paymentMethod !== "online") {
      return res.status(400).json({
        message: "Payment is only available for online orders",
      });
    }

    // Already paid
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Order is already paid",
      });
    }

    // Generate unique payment ID
    const paymentId = `PAY_${Date.now()}_${crypto
      .randomBytes(4)
      .toString("hex")}`;

    // Create pending payment
    const payment = await Payment.create({
      user: userId,
      order: order._id,
      paymentId,
      amount: order.subtotal,
      method: "upi",
      status: "pending",
    });

    // This URL will be stored inside QR
    const paymentUrl = `${process.env.FRONTEND_URL}/demo-payment/${paymentId}`;

    // Generate QR image
    const qrCode = await QRCode.toDataURL(paymentUrl);

    res.status(201).json({
      message: "Payment created",
      paymentId: payment.paymentId,
      amount: payment.amount,
      qrCode,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create payment",
    });
  }
};


// Get payment details/status
export const getPaymentController = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({
      paymentId,
      user: userId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      paymentId: payment.paymentId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      orderId: payment.order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get payment",
    });
  }
};


// Fake UPI payment success
export const completePaymentController = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({
      paymentId,
      user: userId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Payment already completed
    if (payment.status === "paid") {
      return res.status(400).json({
        message: "Payment is already completed",
      });
    }

    // Mark payment as paid
    payment.status = "paid";
    await payment.save();

    // Mark related order as paid
    const order = await Order.findOne({
      _id: payment.order,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = "paid";
    await order.save();

    res.status(200).json({
      message: "Payment successful",
      paymentId: payment.paymentId,
      orderId: order._id,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Payment failed",
    });
  }
};
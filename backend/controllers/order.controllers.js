import mongoose from "mongoose";

import Order from "../models/Order.model.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";


// =========================
// Create Order - User
// =========================
export const createOrderController = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      shippingAddress,
      paymentMethod,
    } = req.body;

    // =========================
    // Validate Shipping Address
    // =========================
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // =========================
    // Validate Payment Method
    // =========================
    if (!["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // =========================
    // Get User Cart
    // =========================
    const cart = await Cart.findOne({ user: userId });

    if (!cart || !cart.products || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const orderProducts = [];
    let subtotal = 0;

    // =========================
    // Check Products & Stock
    // =========================
    for (const cartItem of cart.products) {
      const product = await Product.findById(cartItem.product);

      if (!product) {
        throw new Error("One of the products in your cart no longer exists");
      }

      // Check stock
      if (product.stock < cartItem.quantity) {
        throw new Error(
          `${product.name} does not have enough stock`
        );
      }

      // Check size
      if (product.sizes && product.sizes.length > 0) {
        if (!cartItem.size) {
          throw new Error(
            `Please select a size for ${product.name}`
          );
        }

        if (!product.sizes.includes(cartItem.size)) {
          throw new Error(
            `Selected size is not available for ${product.name}`
          );
        }
      }

      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;

      // Save product snapshot in order
      orderProducts.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        size: cartItem.size,
        image: product.images?.[0] || "",
      });

      // Reduce stock
      product.stock -= cartItem.quantity;
      await product.save();
    }

    // =========================
    // Create Order
    // =========================
    const order = await Order.create({
      user: userId,
      products: orderProducts,
      shippingAddress,
      subtotal,
      paymentStatus: "pending",
      paymentMethod,
      orderStatus: "pending",
    });

    // =========================
    // Clear Cart
    // =========================
    cart.products = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};


// =========================
// Get My Orders - User
// =========================
export const getMyOrdersController = async (req, res) => {
  try {
    const userId = req.user._id;

    // 24 hours ago timestamp
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Filter: Pending and Shipped orders stay forever;
    // Delivered and Cancelled orders disappear after 1 day (24 hours) from when they were updated/completed.
    const orders = await Order.find({
      user: userId,
      $or: [
        { orderStatus: { $in: ["pending", "shipped"] } },
        {
          orderStatus: { $in: ["delivered", "cancelled"] },
          updatedAt: { $gte: oneDayAgo },
        },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};


// =========================
// Get Single Order - User
// =========================
export const getMyOrderByIdController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // User can only see his own order
    const order = await Order.findOne({
      _id: id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
};


// =========================
// Cancel Order - User
// =========================
export const cancelOrderController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only pending order can be cancelled
    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled",
      });
    }

    // Restore product stock
    for (const item of order.products) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
};


// =========================
// Get All Orders - Admin
// =========================
export const getAllOrdersController = async (req, res) => {
  try {
    // 24 hours ago timestamp
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Filter: Pending and Shipped orders stay forever;
    // Delivered and Cancelled orders disappear after 1 day (24 hours) from when they were updated/completed.
    const orders = await Order.find({
      $or: [
        { orderStatus: { $in: ["pending", "shipped"] } },
        {
          orderStatus: { $in: ["delivered", "cancelled"] },
          updatedAt: { $gte: oneDayAgo },
        },
      ],
    })
      .populate("user", "username email name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get all orders",
      error: error.message,
    });
  }
};


// =========================
// Update Order Status - Admin
// =========================
export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const allowedStatuses = [
      "pending",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Delivered/cancelled order should not be changed
    if (
      order.orderStatus === "delivered" ||
      order.orderStatus === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order status cannot be changed",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

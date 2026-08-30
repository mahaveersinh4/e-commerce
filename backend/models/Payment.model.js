import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // Payment kis user ne start kiya
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Payment kis order ke liye hai
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Hamara fake payment ka unique ID
    // Example: PAY_1723456789_abc123
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    // Payment amount
    // Ye backend order ke subtotal se aayega.
    // Frontend se aaye amount par trust nahi karenge.
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Abhi sirf UPI online payment hai
    method: {
      type: String,
      enum: ["upi"],
      default: "upi",
    },

    // Fake payment ki current condition
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
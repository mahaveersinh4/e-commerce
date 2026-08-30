import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Order kis user ne kiya
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Order me kaunse products hain
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        // Product ka naam order ke time save karna
        // Taaki baad me product change/delete ho to order ka data safe rahe
        name: {
          type: String,
          required: true,
        },

        // Product ki price order ke time ki
        price: {
          type: Number,
          required: true,
          min: 0,
        },

        // Kitne products order kiye
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        // Selected size
        size: {
          type: String,
        },

        // Product ki image
        image: {
          type: String,
        },
      },
    ],

    // Delivery address
    shippingAddress: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    // Products ka total
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment ka status
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },

    // Order ki current status
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    // createdAt aur updatedAt automatically add honge
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

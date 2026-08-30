import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import cartRouter from "./routes/cart.route.js";
import categoriesRouter from "./routes/categories.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/product.routes.js";
import paymentRouter from "./routes/payment.routes.js";

const app = express();

// Render / reverse proxy ke liye
app.set("trust proxy", 1);

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,

  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    // Cookies allow karne ke liye
    credentials: true,
  })
);

// ===============================
// BODY PARSERS
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// COOKIE PARSER
// ===============================

app.use(cookieParser());

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully!",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/order", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/payments", paymentRouter);

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: "CORS error",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;

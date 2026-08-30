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

// Trust reverse proxy (Render / Heroku) for secure cookies
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5174",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow credentials across deployment origins
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running successfully!" });
});

app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/order", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/payments", paymentRouter);

export default app;

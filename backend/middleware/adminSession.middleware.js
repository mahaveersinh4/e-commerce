import jwt from "jsonwebtoken";
import userModel from "../models/User.model.js";

// Admin Panel routes ke liye middleware
// ADMIN_SESSION_SECRET se verify karta hai — normal access token yahan kaam nahi karega
export const adminSessionMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Admin session nahi mili. Admin Panel me login karo." });
  }

  try {
    // ADMIN_SESSION_SECRET se verify karo
    const decoded = jwt.verify(token, process.env.ADMIN_SESSION_SECRET);

    // DB me role=admin confirm karo
    const user = await userModel.findById(decoded.id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Admin session expire ho gayi. Dobara login karo." });
  }
};

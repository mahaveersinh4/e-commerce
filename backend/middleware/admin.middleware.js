import userModel from "../models/User.model.js";

// ⚠️  Is middleware ko HAMESHA authMiddleware ke BAAD use karo
// authMiddleware pehle req.userId set karta hai, tabhi ye kaam karega
// Usage: router.get("/admin-route", authMiddleware, adminMiddleware, controller)

export const adminMiddleware = async (req, res, next) => {
  try {
    // authMiddleware ne req.userId set kiya hoga
    if (!req.userId) {
      return res.status(401).json({ message: "Pehle login karo" });
    }

    // DB se user fetch karo aur role check karo
    const user = await userModel.findById(req.userId).select("role");

    if (!user) {
      return res.status(401).json({ message: "User nahi mila" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Sirf admins ke liye hai." });
    }

    // Admin hai, aage jaao
    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

import jwt from "jsonwebtoken";

// Middleware to verify JWT access token
export const authMiddleware = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // Controllers req.user._id use karte hain, isliye user object set karo
    req.user = { _id: decoded.id };
    req.userId = decoded.id; // backward compatibility
    next();
  } catch (err) {
    return res.status(401).json({ message: "Access token is expire" });
  }
};

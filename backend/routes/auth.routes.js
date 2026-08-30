import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  registerController,
  verifyOtpController,
  loginController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  getMeController,
  changePasswordController,
  adminLoginController,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

// register - step 1: user banao, otp bhejo
authRouter.post("/register", registerController);

// register - step 2: otp verify karo
authRouter.post("/verify-otp", verifyOtpController);

authRouter.post("/login", loginController);

// refresh token - naya accessToken + user data ek call me
authRouter.post("/refresh-token", refreshTokenController);

// forgot password - step 1: otp bhejo
authRouter.post("/forgot-password", forgotPasswordController);

// forgot password - step 2: otp verify + naya password
authRouter.post("/reset-password", resetPasswordController);

authRouter.get("/logout", logoutController);

authRouter.get("/getMe", authMiddleware, getMeController);

// Password change - logged in user ke liye
authRouter.patch("/change-password", authMiddleware, changePasswordController);

// Admin Panel login - alag session banata hai (no refresh cookie)
authRouter.post("/admin-login", adminLoginController);

export default authRouter;

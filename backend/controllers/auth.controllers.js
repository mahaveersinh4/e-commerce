import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../models/User.model.js";
import sessionModel from "../models/Session.model.js";

import { sendOtpEmail } from "../utils/email.js";


// Helepers

const makeTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// 6 digit random otp banao
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// --- Controllers ---

export const registerController = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please Provide All Details" })
  }

  try {
    const isUserAlreadyExists = await userModel.findOne({ $or: [{ username }, { email }] })
    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "Account already exists, Please login to continue" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) //10 min

    await userModel.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    })

    await sendOtpEmail(email, otp)

    res.status(201).json({ message: "OTP Send Please Verify" })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Server Error" })
  }
}

// Step 2 of register: otp verify karo
export const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User nahi mila" });
    }

    // otp sahi hai?
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Wrong OTP" });
    }

    // otp expire hua?
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expire ho gaya, dobara bhejo" });
    }

    // verified karo, otp clear karo
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // tokens banao aur login karo
    const { accessToken, refreshToken } = makeTokens(user._id);

    await sessionModel.create({ userId: user._id, refreshToken });
    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      accessToken,
      // role bhi bheja taaki frontend AdminRoute check kar sake
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


// login
export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email And Password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Email And Password" });
    }

    // verified hai?
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    const { accessToken, refreshToken } = makeTokens(user._id);

    await sessionModel.deleteMany({ userId: user._id });
    await sessionModel.create({ userId: user._id, refreshToken });

    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      accessToken,
      // role bhi bheja taaki frontend AdminRoute check kar sake
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


// refresh token - naya accessToken + naya refreshToken + user data ek saath
export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token nahi mila, login karo" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const session = await sessionModel.findOne({ refreshToken });
    if (!session) {
      return res.status(401).json({ message: "Session nahi mila, login karo" });
    }

    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User nahi mila" });
    }

    // dono naye tokens banao (rotation)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = makeTokens(decoded.id);

    await sessionModel.deleteOne({ refreshToken });
    await sessionModel.create({ userId: decoded.id, refreshToken: newRefreshToken });

    setRefreshCookie(res, newRefreshToken);

    // ek hi call me accessToken + user dono bhejo
    res.status(200).json({
      accessToken: newAccessToken,
      // role bhi bheja - page refresh ke baad bhi admin status bana rahe
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });

  } catch (err) {
    return res.status(401).json({ message: "Refresh token expire ho gaya, login karo" });
  }
};

// forgot password - step 1: otp bhejo
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Account not exsist" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP was send" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// forgot password - step 2: otp verify karo aur naya password set karo
export const resetPasswordController = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Account not exsist" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Wrong OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // naya password hash karke save karo
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password changed sucessfully, Login Now" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// logout
export const logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await sessionModel.deleteOne({ refreshToken });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// getMe
export const getMeController = async (req, res) => {
  const user = await userModel.findById(req.userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user });
};


// Admin Panel Login - alag session, alag token, no refresh cookie
export const adminLoginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email aur password  both required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email verified nahi hai" });
    }
    
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only for Admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Normal access token se ALAG secret use karo
    // Middleware bhi isi ADMIN_SESSION_SECRET se verify karega
    const adminSessionToken = jwt.sign(
      { id: user._id },
      process.env.ADMIN_SESSION_SECRET,
      { expiresIn: "8h" } // sirf 8 ghante, no refresh
    );

    // Koi cookie nahi - session persistent nahi hogi
    res.status(200).json({
      adminSessionToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// Change Password - logged in user apna password change kare
export const changePasswordController = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current aur new password dono chahiye" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password kam se kam 6 characters ka hona chahiye" });
  }

  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User nahi mila" });
    }

    // Current password match karo
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password galat hai" });
    }

    // Naya password hash karke save karo
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password successfully change ho gaya" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
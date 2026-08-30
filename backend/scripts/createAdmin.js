import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

import userModel from "../models/User.model.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected...");

    // Pehle check karo koi admin hai ya nahi
    const existing = await userModel.findOne({ email: "admin@rudraa.com" });
    if (existing) {
      console.log("⚠️  Admin already exists! Email: admin@rudraa.com");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await userModel.create({
      username: "admin",
      email: "admin@rudraa.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true, // Admin ko OTP verify nahi karna
    });

    console.log("\n✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email    : admin@rudraa.com");
    console.log("🔑 Password : Admin@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  Login karke password zaroor change kar lena!\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();

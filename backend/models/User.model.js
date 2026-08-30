import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  // registration ke waqt pehle false rahega
  // otp verify hone ke baad true hoga
  isVerified: {
    type: Boolean,
    default: false,
  },

  // otp yahan store hoga temporarily
  otp: {
    type: String,
    default: null,
  },

  // otp ki expiry - 10 min baad khatam
  otpExpiry: {
    type: Date,
    default: null,
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
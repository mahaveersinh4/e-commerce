import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hook/auth.hook.jsx";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { resetPasswordHandle, error } = useAuth();

  // forgot password page ne email bheja tha
  const location = useLocation();
  const email = location.state?.email;

  const submitHandler = async (e) => {
    e.preventDefault();
    await resetPasswordHandle({ email, otp, newPassword });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* Top Brand */}
      <div className="w-full h-20 border-b border-black/10 flex items-center justify-center">
        <h1 className="text-3xl font-black tracking-[-0.08em]">
          RUDRA
        </h1>
      </div>

      {/* Reset Password Section */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">

        <form
          onSubmit={submitHandler}
          className="w-full max-w-[430px]"
        >

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
              Reset Password
            </h2>

            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-gray-500">
              Enter the OTP to reset your password
            </p>

            <p className="mt-2 text-xs text-gray-400 break-all">
              OTP SENT TO: {email}
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* OTP */}
          <div className="mb-6">
            <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2">
              OTP
            </label>

            <input
              type="text"
              placeholder="6 DIGIT OTP"
              className="w-full h-12 border border-black bg-white px-4 text-sm outline-none placeholder:text-gray-400 focus:border-2 transition tracking-[0.2em]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* New Password */}
          <div className="mb-8">
            <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2">
              New Password
            </label>

            <input
              type="password"
              placeholder="NEW PASSWORD"
              className="w-full h-12 border border-black bg-white px-4 text-sm outline-none placeholder:text-gray-400 focus:border-2 transition"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#222] transition cursor-pointer"
          >
            Change Password
          </button>

        </form>
      </div>

      {/* Bottom */}
      <div className="border-t border-black/10 py-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
          Made in India, for the World
        </p>
      </div>

    </div>
  );
};

export default ResetPassword;

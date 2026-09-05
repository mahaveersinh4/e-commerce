import React, { useState } from "react";
import { useAuth } from "../hook/auth.hook.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { forgotPasswordHandle, error } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    await forgotPasswordHandle({ email });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* Top Brand */}
      <div className="w-full h-20 border-b border-black/10 flex items-center justify-center">
        <h1 className="text-3xl font-black tracking-[-0.08em]">
          RUDRA
        </h1>
      </div>

      {/* Forgot Password Section */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">

        <form
          onSubmit={submitHandler}
          className="w-full max-w-[430px]"
        >

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
              Forgot Password
            </h2>

            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-gray-500">
              Enter your email to receive an OTP
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* Email */}
          <div className="mb-8">
            <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full h-12 border border-black bg-white px-4 text-sm outline-none placeholder:text-gray-400 focus:border-2 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#222] transition cursor-pointer"
          >
            Send OTP
          </button>

          {/* Back */}
          <p className="text-center text-xs text-gray-500 mt-7">
            <a
              href="/login"
              className="text-black font-bold underline underline-offset-4 hover:no-underline"
            >
              ← BACK TO LOGIN
            </a>
          </p>

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

export default ForgotPassword;

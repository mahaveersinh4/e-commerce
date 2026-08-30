import React from "react";
import { useState } from "react";
import { useAuth } from "../hook/auth.hook.jsx";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { registerHandle, error, setError } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    await registerHandle({ username, email, password });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* Top Brand */}
      <div className="w-full h-20 border-b border-black/10 flex items-center justify-center">
        <h1 className="text-3xl font-black tracking-[-0.06em]">
          Rudraa
        </h1>
      </div>

      {/* Register Section */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">

        <form
          onSubmit={(e) => submitHandler(e)}
          className="w-full max-w-[430px]"
        >

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
              Create Account
            </h2>

            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-gray-500">
              Join the Rudraa community
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-6">
            <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="USERNAME"
              className="w-full h-12 border border-black bg-white px-4 text-sm outline-none placeholder:text-gray-400 focus:border-2 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="mb-6">
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

          {/* Password */}
          <div className="mb-8">
            <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full h-12 border border-black bg-white px-4 text-sm outline-none placeholder:text-gray-400 focus:border-2 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#222] transition cursor-pointer"
          >
            Create Account
          </button>

          {/* Login */}
          <p className="text-center text-xs text-gray-500 mt-7">
            ALREADY HAVE AN ACCOUNT?{" "}
            <a
              href="/login"
              className="text-black font-bold underline underline-offset-4 hover:no-underline"
            >
              LOGIN
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

export default Register;

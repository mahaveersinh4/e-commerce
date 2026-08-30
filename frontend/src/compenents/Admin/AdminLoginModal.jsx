import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hook/adminAuth.hook.jsx";

// Admin Panel login modal
// Sirf tab dikhta hai jab admin "Go to Admin Panel" click kare
const AdminLoginModal = ({ onClose }) => {
  const { adminLoginHandle } = useAdminAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email aur password dono chahiye.");
      return;
    }

    try {
      setLoading(true);
      await adminLoginHandle({ email: form.email, password: form.password });
      onClose();
      navigate("/admin");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose} // backdrop click se close
    >
      {/* Modal box */}
      <div
        className="bg-white w-full max-w-sm mx-4 rounded-2xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()} // modal click se close nahi
      >
        {/* Header */}
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Admin Access</p>
          <h2 className="text-xl font-bold text-slate-900">Admin Panel Login</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your admin credentials to continue.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@rudraa.com"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-slate-900 text-white text-sm font-semibold py-3 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Enter Admin Panel"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;

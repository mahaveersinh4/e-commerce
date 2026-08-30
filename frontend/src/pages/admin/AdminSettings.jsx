import { useState } from "react";
import { useAuth } from "../../hook/auth.hook.jsx";

const AdminSettings = () => {
  const { user, changePasswordHandle } = useAuth();

  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setErrorMsg("Sabhi fields required hain.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setErrorMsg("New password aur confirm password match nahi kar rahe.");
      return;
    }

    if (form.newPassword.length < 6) {
      setErrorMsg("New password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    try {
      setLoading(true);
      await changePasswordHandle({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccessMsg("Password successfully change ho gaya!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Password change failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your admin account</p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 max-w-lg">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Account Info</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user?.username}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-600 uppercase">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
        <h3 className="text-sm font-semibold text-slate-700 mb-5">Change Password</h3>

        {successMsg && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Current Password</label>
            <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange}
              placeholder="Enter current password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">New Password</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange}
              placeholder="Enter new password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Confirm New Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
              placeholder="Re-enter new password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
          </div>
          <button type="submit" disabled={loading}
            className="bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-700 cursor-pointer disabled:opacity-60 mt-1">
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

    </div>
  );
};

export default AdminSettings;

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import { login, register, logout, verifyOtp, forgotPassword, resetPassword, changePassword, setAccessToken } from "../apis/auth.api.jsx";

export const useAuth = () => {
  const { user, setUser, loading } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginHandle = async ({ email, password }) => {
    setError(null);
    try {
      const data = await login({ email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      // Sab users home page pe jate hain — admin bhi
      navigate("/");
    } catch (err) {
      // Backend se aaya error message dikhao
      const msg = err?.response?.data?.message || "Login failed. Try again.";
      setError(msg);
    }
  };

  

  const verifyOtpHandle = async ({ email, otp }) => {
    setError(null);
    try {
      const data = await verifyOtp({ email, otp });
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "OTP verification failed.";
      setError(msg);
    }
  };

  const forgotPasswordHandle = async ({ email }) => {
    setError(null);
    try {
      await forgotPassword({ email });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send OTP.";
      setError(msg);
    }
  };

  const resetPasswordHandle = async ({ email, otp, newPassword }) => {
    setError(null);
    try {
      await resetPassword({ email, otp, newPassword });
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.message || "Password reset failed.";
      setError(msg);
    }
  };

  // Normal logout — dono sessions clear karo (home + admin)
  const logoutHandle = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    setAccessToken(null);
    setUser(null);
    sessionStorage.removeItem("adminSessionToken"); // Admin session bhi clear karo
    navigate("/login");
  };

  const changePasswordHandle = async ({ currentPassword, newPassword }) => {
    return await changePassword({ currentPassword, newPassword });
  };

  return {
    user,
    loading,
    error,
    setError,
    loginHandle,
    registerHandle,
    verifyOtpHandle,
    forgotPasswordHandle,
    resetPasswordHandle,
    logoutHandle,
    changePasswordHandle,
  };
};

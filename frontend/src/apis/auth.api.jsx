import axios from "axios";

// access token memory me rakho (localStorage nahi)
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // cookie (refreshToken) automatically jaegi
});

// har request se pehle access token header me lagao
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// agar 401 aaya toh refresh token se naya access token lo
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh-token")) {
      originalRequest._retry = true;

      try {
        // cookie me se refreshToken khud jaegi
        const res = await api.post("/auth/refresh-token");
        setAccessToken(res.data.accessToken);

        // purani request dobara bhejo naye token ke saath
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);

      } catch (err) {
        // refresh bhi fail - logout
        setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);



const register = async ({ username, email, password }) => {
  console.log("REGISTER API START");

  try {
    const response = await api.post(
      "/auth/register",
      {
        username,
        email,
        password,
      },
      {
        timeout: 10000,
      }
    );

    console.log("REGISTER API RESPONSE:", response.status);
    console.log("REGISTER API DATA:", response.data);

    return response.data;
  } catch (err) {
    console.error("REGISTER API ERROR:", err);
    console.error("STATUS:", err?.response?.status);
    console.error("DATA:", err?.response?.data);
    console.error("CODE:", err?.code);

    throw err;
  } finally {
    console.log("REGISTER API FINISHED");
  }
};



const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const login = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const logout = async () => {
  try {
    const response = await api.get("/auth/logout");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const getMe = async () => {
  try {
    const response = await api.get("/auth/getMe");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const forgotPassword = async ({ email }) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const resetPassword = async ({ email, otp, newPassword }) => {
  try {
    const response = await api.post("/auth/reset-password", { email, otp, newPassword });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await api.patch("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err; // settings page me error dikhani hai
  }
};

export { login, logout, register, verifyOtp, forgotPassword, resetPassword, getMe, refreshToken, changePassword };

// api instance baaki files me use kar sakti hain
export default api;

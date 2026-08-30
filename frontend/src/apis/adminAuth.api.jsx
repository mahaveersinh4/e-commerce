import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Admin token sessionStorage se lo
const getToken = () => sessionStorage.getItem("adminSessionToken");

// Har request se pehle admin token header me lagao
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ========================
// Admin Login
// ========================
const adminLogin = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/admin-login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// ========================
// Admin - Categories
// ========================
const adminGetAllCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const adminCreateCategory = async (formData) => {
  try {
    const response = await api.post("/categories", formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const adminUpdateCategory = async (id, formData) => {
  try {
    const response = await api.patch(`/categories/${id}`, formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const adminDeleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// ========================
// Admin - Products
// ========================
const adminGetAllProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const adminCreateProduct = async (formData) => {
  try {
    const response = await api.post("/products", formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const adminUpdateProduct = async (id, formData) => {
  try {
    const response = await api.patch(`/products/${id}`, formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const adminDeleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// ========================
// Admin - Orders
// ========================
const adminGetAllOrders = async () => {
  try {
    const response = await api.get("/order/admin/all");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const adminUpdateOrderStatus = async (id, orderStatus) => {
  try {
    const response = await api.patch(`/order/admin/${id}/status`, {
      orderStatus,
    });

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// ========================
// Export
// ========================
export {
  adminLogin,
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetAllOrders,
  adminUpdateOrderStatus,
};

export default api;
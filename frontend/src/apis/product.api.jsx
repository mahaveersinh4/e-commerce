import api from "./auth.api.jsx";

// ===========================
// Get All Products (Public, option to filter by category & search)
// ===========================
const getAllProducts = async (category, search) => {
  try {
    const url = category
      ? `/products?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search || "")}`
      : search
      ? `/products?search=${encodeURIComponent(search)}`
      : "/products";
    const response = await api.get(url);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Get Single Product (Public)
// ===========================
const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Create Product (Admin)
// images ke liye FormData bhejni hogi
// ===========================
const createProduct = async (formData) => {
  try {
    const response = await api.post("/products", formData);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Update Product (Admin)
// ===========================
const updateProduct = async (id, formData) => {
  try {
    const response = await api.patch(`/products/${id}`, formData);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Delete Product (Admin)
// ===========================
const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };

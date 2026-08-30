import api from "./auth.api.jsx";

// ===========================
// Get User's Cart
// ===========================
const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (err) {
    // Agar 401 aaya (logged out), silently return karo
    if (err?.response?.status === 401) return null;
    console.error("getCart error:", err);
    return null;
  }
};

// ===========================
// Add Product to Cart
// ===========================
const addToCart = async ({ product, quantity, size }) => {
  const response = await api.post("/cart", { product, quantity, size });
  return response.data;
};

// ===========================
// Update Cart Item
// ===========================
const updateCartItem = async (itemId, { quantity, size }) => {
  const response = await api.patch(`/cart/${itemId}`, { quantity, size });
  return response.data;
};

// ===========================
// Remove Item from Cart
// ===========================
const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

// ===========================
// Clear Entire Cart
// ===========================
const clearCart = async () => {
  const response = await api.delete("/cart");
  return response.data;
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };

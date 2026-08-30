import api from "./auth.api.jsx";

// ===========================
// Create Order (User)
// shippingAddress: { name, phone, address, city, state, pincode }
// paymentMethod: "cod" ya "online"
// ===========================
const createOrder = async ({ shippingAddress, paymentMethod }) => {
  try {
    const response = await api.post("/order", { shippingAddress, paymentMethod });
    return response.data;
  } catch (err) {
    console.error("createOrder API error:", err);
    return err.response?.data || { success: false, message: err.response?.data?.message || err.message || "Failed to create order" };
  }
};

// ===========================
// Get My Orders (User)
// ===========================
const getMyOrders = async () => {
  try {
    const response = await api.get("/order");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Get Single Order (User)
// ===========================
const getMyOrderById = async (id) => {
  try {
    const response = await api.get(`/order/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Cancel Order (User)
// ===========================
const cancelOrder = async (id) => {
  try {
    const response = await api.patch(`/order/${id}/cancel`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Get All Orders (Admin)
// ===========================
const getAllOrders = async () => {
  try {
    const response = await api.get("/order/admin/all");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Update Order Status (Admin)
// orderStatus: "pending" | "shipped" | "delivered" | "cancelled"
// ===========================
const updateOrderStatus = async (id, orderStatus) => {
  try {
    const response = await api.patch(`/order/admin/${id}/status`, { orderStatus });
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export { createOrder, getMyOrders, getMyOrderById, cancelOrder, getAllOrders, updateOrderStatus };

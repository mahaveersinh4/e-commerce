import api from "./auth.api.jsx";

// ===========================
// Create Payment + Get QR Code
// orderId chahiye
// ===========================
const createPayment = async (orderId) => {
  try {
    const response = await api.post("/payments", { orderId });
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Get Payment Details/Status
// ===========================
const getPayment = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Complete Payment (Fake UPI success)
// ===========================
const completePayment = async (paymentId) => {
  try {
    const response = await api.post(`/payments/${paymentId}/success`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export { createPayment, getPayment, completePayment };

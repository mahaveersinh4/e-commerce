import { useState } from "react";
import { createPayment, getPayment, completePayment } from "../apis/payment.api.jsx";

// Payment ke liye hook
export const usePayment = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Payment banao aur QR code lo
  const initiatePayment = async (orderId) => {
    setLoading(true);
    const data = await createPayment(orderId);
    if (data) setPayment(data);
    setLoading(false);
    return data;
  };

  // Payment ki status check karo
  const checkPayment = async (paymentId) => {
    setLoading(true);
    const data = await getPayment(paymentId);
    if (data) setPayment(data);
    setLoading(false);
    return data;
  };

  // Payment complete karo (fake UPI success)
  const finishPayment = async (paymentId) => {
    setLoading(true);
    const data = await completePayment(paymentId);
    setLoading(false);
    return data;
  };

  return {
    payment,
    loading,
    initiatePayment,
    checkPayment,
    finishPayment,
  };
};

import { useState } from "react";
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../apis/order.api.jsx";

// Order ke liye hook
export const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mera order banao (cart se)
  const placeOrder = async ({ shippingAddress, paymentMethod }) => {
    const data = await createOrder({ shippingAddress, paymentMethod });
    return data;
  };

  // Meri saari orders fetch karo
  const fetchMyOrders = async () => {
    setLoading(true);
    const data = await getMyOrders();
    if (data) setOrders(data.orders);
    setLoading(false);
  };

  // Ek order detail fetch karo
  const fetchOrderById = async (id) => {
    setLoading(true);
    const data = await getMyOrderById(id);
    if (data) setSelectedOrder(data.order);
    setLoading(false);
  };

  // Order cancel karo
  const cancelMyOrder = async (id) => {
    const data = await cancelOrder(id);
    if (data) {
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? data.order : o))
      );
    }
    return data;
  };

  // Admin: saari orders dekho
  const fetchAllOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    if (data) setOrders(data.orders);
    setLoading(false);
  };

  // Admin: order status update karo
  const changeOrderStatus = async (id, orderStatus) => {
    const data = await updateOrderStatus(id, orderStatus);
    if (data) {
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? data.order : o))
      );
    }
    return data;
  };

  return {
    orders,
    selectedOrder,
    loading,
    placeOrder,
    fetchMyOrders,
    fetchOrderById,
    cancelMyOrder,
    fetchAllOrders,
    changeOrderStatus,
  };
};

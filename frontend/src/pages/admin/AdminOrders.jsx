import { useState, useEffect } from "react";
import { adminGetAllOrders, adminUpdateOrderStatus } from "../../apis/adminAuth.api.jsx";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    adminGetAllOrders().then((data) => {
      if (data) setOrders(data.orders);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const data = await adminUpdateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o._id === orderId ? data.order : o));
      setMsg("Status updated!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800">Orders</h2>
        <p className="text-sm text-slate-500 mt-1">View and manage all customer orders</p>
      </div>

      {msg && <div className="mb-5 px-4 py-3 rounded-lg bg-slate-100 text-sm text-slate-700">{msg}</div>}

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {loading ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">No orders yet.</p>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Order ID", "Customer", "Amount", "Payment", "Date", "Status"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {order.user?.username || "—"}
                    <span className="block text-xs text-slate-400">{order.user?.email}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">₹{order.subtotal}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500 capitalize block">{order.paymentMethod}</span>
                    <span className={`text-xs font-medium capitalize ${order.paymentStatus === "paid" ? "text-green-600" : order.paymentStatus === "failed" ? "text-red-600" : "text-yellow-600"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    {order.orderStatus === "delivered" || order.orderStatus === "cancelled" ? (
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    ) : (
                      <select value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-slate-400 cursor-pointer">
                        {allowedStatuses.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

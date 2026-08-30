import { useState, useEffect } from "react";
import { adminGetAllProducts, adminGetAllOrders } from "../../apis/adminAuth.api.jsx";
import { getAllCategories } from "../../apis/category.api.jsx"; // public route, no admin token needed

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [productsData, categoriesData, ordersData] = await Promise.all([
        adminGetAllProducts(),
        getAllCategories(),     // public route
        adminGetAllOrders(),
      ]);
      setStats({
        products: productsData?.count || 0,
        categories: categoriesData?.count || 0,
        orders: ordersData?.count || 0,
      });
      setRecentOrders(ordersData?.orders?.slice(0, 5) || []);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Products", value: stats.products },
          { label: "Categories", value: stats.categories },
          { label: "Total Orders", value: stats.orders },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
            <p className="text-4xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Recent Orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">No orders yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Order ID", "Amount", "Payment", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">₹{order.subtotal}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[order.orderStatus] || "bg-slate-100 text-slate-600"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

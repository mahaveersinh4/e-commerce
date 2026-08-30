import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../compenents/Header/Header.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import { getMyOrders } from "../apis/order.api.jsx";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getMyOrders();
        if (res && res.success && Array.isArray(res.orders)) {
          setOrders(res.orders);
        } else {
          setError(res?.message || "Failed to load orders");
        }
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Something went wrong while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-black/50 uppercase tracking-wider mb-6">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black font-semibold">My Orders</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-black/10 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
              My Orders
            </h1>
            <p className="text-xs text-black/50 mt-1">
              View and track all your placed orders
            </p>
          </div>
          {orders.length > 0 && (
            <span className="text-xs font-bold uppercase tracking-wider text-black/60 bg-[#fafafa] border border-black/10 px-3 py-1.5 self-start sm:self-auto">
              Total Orders: {orders.length}
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-black/50">Fetching your orders...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center max-w-md mx-auto">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider bg-red-50 border border-red-200 p-4 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/85 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* Empty Orders State */
          <div className="py-20 text-center max-w-md mx-auto">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-black/30 mx-auto mb-4">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 className="text-lg font-bold uppercase tracking-wide text-black mb-2">
              No Orders Found
            </h2>
            <p className="text-xs text-black/50 mb-6">
              You haven't placed any orders yet. Explore our collections and start shopping!
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/85 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div key={order._id} className="border border-black/10 bg-white">
                  {/* Header info */}
                  <div className="bg-[#fafafa] px-5 py-4 border-b border-black/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40">Order ID:</span>
                        <span className="text-xs font-mono font-bold text-black">{order._id}</span>
                      </div>
                      <p className="text-[11px] text-black/50">Placed on {formattedDate}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Payment Status Badge */}
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                        order.paymentStatus === "paid"
                          ? "border-green-600 text-green-700 bg-green-50"
                          : "border-amber-500 text-amber-600 bg-amber-50"
                      }`}>
                        {order.paymentStatus === "paid" ? "Paid" : "Payment Pending"}
                      </span>

                      {/* Order Status Badge */}
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-black/20 text-black/70">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-5 border-b border-black/10">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-black/50 mb-3">Items</h3>
                    <div className="divide-y divide-black/5">
                      {order.products?.map((item, index) => (
                        <div key={index} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover bg-gray-100 border border-black/5 shrink-0"
                              />
                            )}
                            <div>
                              <p className="text-xs font-semibold uppercase">{item.name}</p>
                              <p className="text-[11px] text-black/50 mt-0.5">
                                Qty: {item.quantity} {item.size && ` · Size: ${item.size}`}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold shrink-0">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="p-5 flex flex-wrap items-center justify-between gap-4 bg-white">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">Delivering To</p>
                      <p className="text-xs font-semibold text-black mt-0.5">{order.shippingAddress?.name}</p>
                      <p className="text-[11px] text-black/60 truncate max-w-md">
                        {order.shippingAddress?.address}, {order.shippingAddress?.city} — {order.shippingAddress?.pincode}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">Total Amount</p>
                      <p className="text-lg font-black text-black">₹{order.subtotal}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;

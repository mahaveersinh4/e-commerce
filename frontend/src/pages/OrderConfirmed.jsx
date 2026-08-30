import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../compenents/Header/Header.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import { getMyOrderById } from "../apis/order.api.jsx";
import { useCart } from "../hook/cart.hook.jsx";

const OrderConfirmed = () => {
  const { orderId } = useParams();
  const { fetchCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    // Refresh cart state in context so badge count updates to 0
    fetchCart();

    const loadOrder = async () => {
      setLoading(true);
      try {
        const res = await getMyOrderById(orderId);
        if (res && res.success && res.order) {
          setOrder(res.order);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-black/50">Loading order...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error
  if (error || !order) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-black/30 mx-auto mb-4">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6M9 9l6 6" />
            </svg>
            <h2 className="text-lg font-bold uppercase tracking-wide text-black mb-2">Order Not Found</h2>
            <p className="text-sm text-black/60 mb-6">{error || "The order you are looking for does not exist."}</p>
            <Link to="/" className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-black/80 transition-colors">
              Go Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const addr = order.shippingAddress || {};

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[800px] mx-auto px-4 py-10 sm:px-6">

        {/* Success Banner */}
        <div className="text-center mb-10">
          {/* Checkmark */}
          <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center border-2 border-green-600 rounded-full">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase mb-2">
            Order Confirmed
          </h1>
          <p className="text-sm text-black/60">
            Thank you for your order! Your order has been placed successfully.
          </p>
        </div>

        {/* Order details card */}
        <div className="border border-black/10">
          {/* Header row */}
          <div className="bg-[#fafafa] px-6 py-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40">Order ID</p>
              <p className="text-xs font-bold text-black mt-0.5 break-all">{order._id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                order.paymentStatus === "paid"
                  ? "border-green-600 text-green-700 bg-green-50"
                  : "border-amber-500 text-amber-600 bg-amber-50"
              }`}>
                {order.paymentStatus === "paid" ? "Paid" : "Pending"}
              </span>
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-black/20 text-black/60">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Products */}
          <div className="px-6 py-4 border-b border-black/10">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-black/50 mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.products?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover bg-gray-100 border border-black/5 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase truncate">{item.name}</p>
                    <p className="text-[11px] text-black/50">
                      Qty: {item.quantity}
                      {item.size && ` · Size: ${item.size}`}
                    </p>
                  </div>
                  <span className="text-xs font-bold shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address + Total row */}
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Address */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-black/50 mb-2">Shipping Address</h3>
              <p className="text-xs font-semibold text-black">{addr.name}</p>
              <p className="text-xs text-black/60 leading-relaxed">
                {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
              </p>
              <p className="text-xs text-black/60">{addr.phone}</p>
            </div>

            {/* Payment summary */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-black/50 mb-2">Payment Summary</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-black/60">Subtotal</span>
                  <span className="font-semibold">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-black/60">Shipping</span>
                  <span className="font-semibold text-green-700 uppercase">Free</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-black/10">
                  <span className="font-extrabold uppercase">Total</span>
                  <span className="font-black text-base">₹{order.subtotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/my-orders"
            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/85 transition-colors"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="px-8 py-3 border border-black/20 text-black text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmed;

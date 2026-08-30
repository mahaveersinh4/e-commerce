import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../compenents/Header/Header.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import { useCart } from "../hook/cart.hook.jsx";
import { createOrder } from "../apis/order.api.jsx";
import { createPayment, getPayment } from "../apis/payment.api.jsx";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();

  // Checkout step: "address" → "qr"
  const [step, setStep] = useState("address");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Address form
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // QR payment data (returned from backend)
  const [qrData, setQrData] = useState(null); // { qrCode, paymentId, amount }
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCart();
  }, []);

  // Cart calculations
  const cartProducts = cart?.products || [];
  const subtotal = cartProducts.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // If cart is empty, redirect back
  useEffect(() => {
    if (cart && cartProducts.length === 0 && step === "address") {
      navigate("/cart");
    }
  }, [cart, cartProducts.length, step, navigate]);

  // Polling payment status when QR is active
  useEffect(() => {
    if (step !== "qr" || !qrData?.paymentId || !orderId) return;

    const interval = setInterval(async () => {
      try {
        const paymentInfo = await getPayment(qrData.paymentId);
        if (paymentInfo && paymentInfo.status === "paid") {
          clearInterval(interval);
          navigate(`/order-confirmed/${orderId}`, { replace: true });
        }
      } catch (err) {
        console.error("Polling payment status error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [step, qrData?.paymentId, orderId, navigate]);

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAddress = () => {
    const { name, phone, address: addr, city, state, pincode } = address;
    if (!name.trim() || !phone.trim() || !addr.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      return "Please fill in all address fields.";
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }
    return null;
  };

  // Submit address → create order → create payment → show QR
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateAddress();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create order with paymentMethod = "online"
      const orderRes = await createOrder({
        shippingAddress: {
          name: address.name.trim(),
          phone: address.phone.trim(),
          address: address.address.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
        },
        paymentMethod: "online",
      });

      if (!orderRes || !orderRes.success || !orderRes.order) {
        throw new Error(orderRes?.message || "Failed to create order");
      }

      const newOrderId = orderRes.order._id;
      setOrderId(newOrderId);

      // 2. Create payment + get QR
      const paymentRes = await createPayment(newOrderId);

      if (!paymentRes || !paymentRes.qrCode) {
        throw new Error("Failed to generate payment QR");
      }

      setQrData(paymentRes);
      setStep("qr");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================
  // Render: Address Form
  // ==================
  const renderAddressForm = () => (
    <form onSubmit={handlePlaceOrder} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={address.name}
            onChange={handleAddressChange}
            placeholder="Enter your full name"
            className="w-full h-11 border border-black/20 px-3 text-sm outline-none focus:border-black bg-white transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={address.phone}
            onChange={handleAddressChange}
            placeholder="10-digit number"
            maxLength={10}
            className="w-full h-11 border border-black/20 px-3 text-sm outline-none focus:border-black bg-white transition-colors"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handleAddressChange}
            placeholder="6-digit pincode"
            maxLength={6}
            className="w-full h-11 border border-black/20 px-3 text-sm outline-none focus:border-black bg-white transition-colors"
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={address.address}
            onChange={handleAddressChange}
            placeholder="House no., Building, Street"
            className="w-full h-11 border border-black/20 px-3 text-sm outline-none focus:border-black bg-white transition-colors"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5">
            City
          </label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            placeholder="City"
            className="w-full h-11 border border-black/20 px-3 text-sm outline-none focus:border-black bg-white transition-colors"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5">
            State
          </label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleAddressChange}
            placeholder="State"
            className="w-full h-11 border border-black/20 px-3 text-sm outline-none focus:border-black bg-white transition-colors"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-xs text-red-600 font-semibold uppercase tracking-wider bg-red-50 border border-red-200 px-4 py-3">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full h-12 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Processing..." : "Continue to Payment"}
      </button>
    </form>
  );

  // ==================
  // Render: QR Payment
  // ==================
  const renderQRPayment = () => (
    <div className="flex flex-col items-center text-center">
      {/* QR Label */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40 mb-2">
        Scan QR to Pay
      </p>

      <p className="text-3xl sm:text-4xl font-black text-black mb-6">
        ₹{qrData?.amount || subtotal}
      </p>

      {/* QR Image */}
      <div className="border-2 border-black/10 p-4 bg-white inline-block mb-6 shadow-sm">
        <img
          src={qrData?.qrCode}
          alt="Payment QR Code"
          className="w-52 h-52 sm:w-60 sm:h-60"
        />
      </div>

      {/* Live Polling Status */}
      <div className="flex items-center gap-2.5 bg-[#fafafa] border border-black/10 px-4 py-2.5 mb-6">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span className="text-xs font-semibold text-black/70 uppercase tracking-wider">
          Waiting for payment scan...
        </span>
      </div>

      {/* Instructions */}
      <div className="space-y-2 text-xs text-black/60 max-w-sm mb-6 leading-relaxed">
        <p>1. Open camera or any UPI app on your phone</p>
        <p>2. Scan this QR code to open payment page</p>
        <p>3. Once paid, this page will automatically confirm your order</p>
      </div>

      {/* Payment ID */}
      <div className="text-[11px] text-black/40 uppercase tracking-wider">
        Payment ID: <span className="font-semibold text-black/60">{qrData?.paymentId}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-8 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-black/50 uppercase tracking-wider mb-6">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-black transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-black font-semibold">
            {step === "address" ? "Checkout" : "Payment"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Form / QR */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Step Header */}
            <div className="border-b border-black/10 pb-5 mb-6">
              <div className="flex items-center gap-4 mb-3">
                {/* Step indicators */}
                <div className={`flex items-center gap-2 ${step === "address" ? "text-black" : "text-black/40"}`}>
                  <span className={`w-6 h-6 flex items-center justify-center text-[11px] font-bold border ${step === "address" ? "border-black bg-black text-white" : "border-black/20"}`}>
                    1
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Address</span>
                </div>
                <div className="w-6 h-px bg-black/20" />
                <div className={`flex items-center gap-2 ${step === "qr" ? "text-black" : "text-black/40"}`}>
                  <span className={`w-6 h-6 flex items-center justify-center text-[11px] font-bold border ${step === "qr" ? "border-black bg-black text-white" : "border-black/20"}`}>
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Payment</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
                {step === "address" ? "Shipping Details" : "Scan & Pay"}
              </h1>
            </div>

            {step === "address" ? renderAddressForm() : renderQRPayment()}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#fafafa] border border-black/10 p-6 sticky top-24">
            <h2 className="text-sm font-extrabold uppercase tracking-widest border-b border-black/10 pb-4 mb-4">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {cartProducts.map((item) => {
                const product = item.product || {};
                const imageSrc = product.images?.[0] || "/product-image.jpg";
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-12 h-12 object-cover bg-gray-100 border border-black/5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase truncate">{product.name}</p>
                      <p className="text-[11px] text-black/50">
                        Qty: {item.quantity}
                        {item.size && ` · Size: ${item.size}`}
                      </p>
                    </div>
                    <span className="text-xs font-bold shrink-0">
                      ₹{(product.price || 0) * item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-black/10 pt-4 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-black/70">
                <span>Subtotal</span>
                <span className="font-semibold text-black">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-black/70">
                <span>Shipping</span>
                <span className="font-semibold text-green-700 uppercase">FREE</span>
              </div>
              <div className="flex justify-between text-black/70">
                <span>Taxes</span>
                <span className="text-black/50">Included</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between">
              <span className="text-sm font-extrabold uppercase tracking-wider">Total</span>
              <span className="text-xl font-black text-black">₹{subtotal}</span>
            </div>

            {/* Address preview (after submission) */}
            {step === "qr" && (
              <div className="mt-4 pt-4 border-t border-black/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/50 mb-2">Shipping To</p>
                <p className="text-xs text-black font-semibold">{address.name}</p>
                <p className="text-xs text-black/60 leading-relaxed">
                  {address.address}, {address.city}, {address.state} — {address.pincode}
                </p>
                <p className="text-xs text-black/60">{address.phone}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

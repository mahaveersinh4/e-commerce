import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../compenents/Header/Header.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import { getPayment, completePayment } from "../apis/payment.api.jsx";

const DemoPayment = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payStep, setPayStep] = useState(0); // 0: initial, 1: connecting, 2: processing, 3: verifying
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch payment details
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadPayment = async () => {
      setLoading(true);
      try {
        const res = await getPayment(paymentId);
        if (!res || !res.paymentId) {
          setError("Payment not found or has expired.");
        } else {
          setPayment(res);
          if (res.status === "paid") {
            setSuccess(true);
          }
        }
      } catch (err) {
        console.error("Failed to load payment:", err);
        setError("Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };
    loadPayment();
  }, [paymentId]);

  // Handle pay with 2.5 second realistic loading steps
  const handlePay = async () => {
    if (paying || success) return;
    setPaying(true);
    setError("");
    setPayStep(1); // Connecting to bank

    // Step 1: 0.8s
    setTimeout(() => {
      setPayStep(2); // Processing transaction
    }, 800);

    // Step 2: 1.8s
    setTimeout(() => {
      setPayStep(3); // Finalizing payment
    }, 1800);

    // Step 3: 2.5s -> execute API
    setTimeout(async () => {
      try {
        const res = await completePayment(paymentId);
        if (res && (res.paymentStatus === "paid" || res.message === "Payment successful")) {
          setSuccess(true);
          // Show success screen for 1.5 sec before redirecting
          setTimeout(() => {
            navigate(`/order-confirmed/${res.orderId}`, { replace: true });
          }, 1500);
        } else {
          setError("Payment could not be completed. Please try again.");
          setPaying(false);
          setPayStep(0);
        }
      } catch (err) {
        console.error("Payment failed:", err);
        setError("Payment failed. Please try again.");
        setPaying(false);
        setPayStep(0);
      }
    }, 2500);
  };

  // Loading state (initial page fetch)
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-black/50">Loading payment details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error / Not found state
  if (error && !payment) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-black/30 mx-auto mb-4">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6M9 9l6 6" />
            </svg>
            <h2 className="text-lg font-bold uppercase tracking-wide text-black mb-2">
              Invalid Payment
            </h2>
            <p className="text-sm text-black/60 mb-6">{error}</p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-black/80 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Payment Card */}
          <div className="border border-black/10 bg-white shadow-sm overflow-hidden">
            {/* Top Bar */}
            <div className="bg-black text-white px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">
                  RUDRAA Pay
                </span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">
                Secure Gateway
              </span>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Amount Display */}
              <div className="text-center mb-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-1">
                  Payment Request
                </p>
                <p className="text-4xl sm:text-5xl font-black text-black tracking-tight">
                  ₹{payment?.amount}
                </p>
              </div>

              {/* Order Info Breakdown */}
              <div className="space-y-3 border-t border-b border-black/10 py-4 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-black/50 uppercase tracking-wider">Payment ID</span>
                  <span className="font-semibold text-black font-mono">{payment?.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50 uppercase tracking-wider">Payment Method</span>
                  <span className="font-semibold text-black uppercase">UPI / Net Banking</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50 uppercase tracking-wider">Status</span>
                  <span className={`font-bold uppercase ${success || payment?.status === "paid" ? "text-green-700" : "text-amber-600"}`}>
                    {success || payment?.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>

              {/* STATES */}

              {/* 1. Success State */}
              {success ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2 border-green-600 bg-green-50 rounded-full animate-bounce">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-base font-extrabold uppercase tracking-wide text-green-700 mb-1">
                    Payment Successful!
                  </h3>
                  <p className="text-xs text-black/60">Order confirmed. Redirecting...</p>
                </div>
              ) : paying ? (
                /* 2. 2.5-Second Loading State */
                <div className="text-center py-6">
                  <div className="w-12 h-12 border-3 border-black/15 border-t-black rounded-full animate-spin mx-auto mb-5" />
                  
                  {payStep === 1 && (
                    <p className="text-xs font-bold uppercase tracking-widest text-black animate-pulse">
                      Connecting to payment gateway...
                    </p>
                  )}
                  {payStep === 2 && (
                    <p className="text-xs font-bold uppercase tracking-widest text-black animate-pulse">
                      Verifying transaction with bank...
                    </p>
                  )}
                  {payStep === 3 && (
                    <p className="text-xs font-bold uppercase tracking-widest text-black animate-pulse">
                      Completing payment...
                    </p>
                  )}
                  <p className="text-[11px] text-black/40 mt-2 uppercase tracking-wider">
                    Please do not refresh or close this window
                  </p>
                </div>
              ) : (
                /* 3. Initial Pay Form State */
                <>
                  {error && (
                    <div className="text-xs text-red-600 font-semibold uppercase tracking-wider bg-red-50 border border-red-200 px-4 py-3 mb-4">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handlePay}
                    className="w-full h-13 bg-black text-white text-xs font-extrabold uppercase tracking-[0.15em] hover:bg-black/85 active:scale-[0.99] transition-all cursor-pointer shadow-md"
                  >
                    Pay ₹{payment?.amount}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-black/40 uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>256-Bit SSL Encrypted Demo Payment</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoPayment;

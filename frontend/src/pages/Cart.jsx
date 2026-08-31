import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../compenents/Header/Header.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import { useCart } from "../hook/cart.hook.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, updateItem, removeItem, emptyCart } = useCart();

  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoMsg, setPromoMsg] = useState("");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCart();
  }, []);

  const cartProducts = cart?.products || [];
  const totalItems = cartProducts.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartProducts.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const finalTotal = Math.max(0, subtotal - (promoCode === "RUDRAA10" ? Math.round(subtotal * 0.1) : 0));

  // Handle quantity change
  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingItemId(item._id);
      await updateItem(item._id, { quantity: newQuantity, size: item.size });
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId) => {
    try {
      setUpdatingItemId(itemId);
      await removeItem(itemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Handle promo code apply
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const discount = promoCode.toUpperCase() === "RUDRAA10" ? Math.round(subtotal * 0.1) : 0;
    setPromoDiscount(discount);
    setPromoMsg(discount > 0 ? "Coupon 'RUDRAA10' applied! (10% OFF)" : "Invalid coupon code.");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-8 sm:px-6 lg:px-10">
        {/* Page Title */}
        <div className="border-b border-black/10 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">Shopping Bag</h1>
            <p className="text-xs sm:text-sm text-black/60 mt-1 uppercase tracking-wider">
              {totalItems} {totalItems === 1 ? "Item" : "Items"} in your bag
            </p>
          </div>

          {cartProducts.length > 0 && (
            <button
              type="button"
              onClick={emptyCart}
              className="text-xs font-semibold uppercase tracking-wider text-red-600 hover:underline cursor-pointer"
            >
              Clear Bag
            </button>
          )}
        </div>

        {/* Cart Items or Loading/Empty States */}
        {loading && !cart ? (
          <div className="py-20 text-center text-sm text-black/50 uppercase tracking-widest animate-pulse">
            Loading your shopping bag...
          </div>
        ) : cartProducts.length === 0 ? (
          /* Empty Cart State */
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-black/15 rounded-lg my-6">
            <svg
              width="54"
              height="54"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-black/30 mb-4"
            >
              <path d="M5 8h14l-1 13H6L5 8Z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>

            <h2 className="text-xl font-bold uppercase tracking-wide text-black mb-2">
              Your Bag is Empty
            </h2>
            <p className="text-sm text-black/60 mb-6 max-w-sm">
              Explore our modern collection and add your favorite apparel to your bag.
            </p>

            <Link
              to="/products"
              className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/85 transition-colors"
              >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Side: Cart Items (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {cartProducts.map((item) => {
                const product = item.product || {};
                const imageSrc =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "/product-image.jpg";

                const isItemUpdating = updatingItemId === item._id;

                return (
                  <div
                    key={item._id}
                    className={`flex flex-col sm:flex-row gap-4 p-4 border border-black/10 transition-opacity ${isItemUpdating ? "opacity-40 pointer-events-none" : "opacity-100"}`}
                  >
                    {/* Item Image */}
                    <Link
                      to={`/product?id=${product._id}`}
                      className="w-full sm:w-28 h-36 bg-[#f5f5f5] shrink-0 overflow-hidden block group"
                    >
                      <img
                        src={imageSrc}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              to={`/product?id=${product._id}`}
                              className="text-sm font-semibold uppercase tracking-tight text-black hover:underline"
                            >
                              {product.name || "Product"}
                            </Link>
                            {product.category?.name && (
                              <p className="text-[11px] text-black/50 uppercase tracking-wider mt-0.5">
                                {product.category.name}
                              </p>
                            )}
                          </div>

                          <p className="text-sm font-bold text-black shrink-0">
                            ₹{(product.price || 0) * item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Size Badge */}
                      {item.size && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-black/60 font-medium">Size:</span>
                          <span className="px-2 py-0.5 border border-black/20 text-xs font-bold uppercase">
                            {item.size}
                          </span>
                        </div>
                      )}

                      {/* Quantity Selector & Remove Button */}
                      <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                        <div className="flex items-center border border-black/20">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-black/5 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-xs font-medium uppercase tracking-wider text-black/50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Order Summary (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-[#fafafa] border border-black/10 p-6 sticky top-24">
              <h2 className="text-sm font-extrabold uppercase tracking-widest border-b border-black/10 pb-4 mb-4">Order Summary</h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-black/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">₹{subtotal}</span>
                </div>

                {promoMsg && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount</span>
                    <span>-₹{promoMsg.includes("10%") ? Math.round(subtotal * 0.1) : 0}</span>
                  </div>
                )}

                <div className="flex justify-between text-black/70">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-green-700 uppercase">FREE</span>
                </div>

                <div className="flex justify-between text-black/70">
                  <span>Taxes</span>
                  <span className="text-black/50">Included</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="mt-5 pt-4 border-t border-black/10">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try 'RUDRAA10'"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 h-9 border border-black/20 px-3 text-xs uppercase outline-none focus:border-black bg-white"
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-black/80 cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {promoMsg && (
                  <p
                    className={`mt-2 text-[11px] font-semibold uppercase ${promoMsg.includes("10%") ? "text-green-700" : "text-red-600"}`}
                  >
                    {promoMsg}
                  </p>
                )}
              </form>

              {/* Total Price */}
              <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                <span className="text-sm font-extrabold uppercase tracking-wider">Total Amount</span>
                <span className="text-xl font-black text-black">₹{finalTotal}</span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full h-12 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/85 transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-black/10 space-y-2 text-[11px] text-black/60 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Free 1-2 day shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>7 days easy return policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>100% Authentic Product Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
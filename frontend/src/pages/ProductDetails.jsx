import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProductById } from "../apis/product.api.jsx";
import { useCart } from "../hook/cart.hook.jsx";
import Header from "../compenents/Header/Header.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import YouMayAlsoLike from "../compenents/ProductDetails/YouMayAlsoLike.jsx";

// Simplified static return policy - only essential policies
const returnPolicies = [
  "7-day return window for most items",
  "Size exchanges subject to availability",
  "Defective items reported within 24 hours",
  "Final sale items cannot be returned",
];

const ProductDetails = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Product ID from URL
  const [productId, setProductId] = useState(
    new URLSearchParams(new URL(window.location.href).search).get("id") || ""
  );

  // Product data and loading state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected image and size
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  // Cart feedback
  const [cartMsg, setCartMsg] = useState({ text: "", isError: false });

  // Handle Add to Bag - simplified logic
  const handleAddToBag = async () => {
    if (!product) return;

    // If product has sizes in DB, require selection
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setCartMsg({ text: "Please select a size first", isError: true });
      setTimeout(() => setCartMsg({ text: "", isError: false }), 3000);
      return;
    }

    // If no sizes in DB, don't send a size
    const sizeToSend = product.sizes && product.sizes.length > 0 ? selectedSize : undefined;

    try {
      setCartMsg({ text: "", isError: false });
      const res = await addItem({
        product: product._id,
        quantity: 1,
        size: sizeToSend,
      });

      if (res?.success) {
        setCartMsg({ text: "Added to Bag successfully!", isError: false });
        setTimeout(() => setCartMsg({ text: "", isError: false }), 3000);
      } else {
        setCartMsg({
          text: res?.message || "Failed to add product to bag",
          isError: true,
        });
        setTimeout(() => setCartMsg({ text: "", isError: false }), 3000);
      }
    } catch (err) {
      console.error("Add to bag error:", err);
      setCartMsg({ text: "Something went wrong", isError: true });
      setTimeout(() => setCartMsg({ text: "", isError: false }), 3000);
    }
  };

  // Fetch product on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSingleProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProductById(productId);

        if (data?.product) {
          setProduct(data.product);
          // Set default size from DB if available
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
        }
      } catch (error) {
        console.error("Error loading product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [productId]);

  // Images - with fallback
  const images = product?.images && product.images.length > 0
    ? product.images
    : ["/product-image.jpg"];

  // Sizes - with fallback
  const sizes = product?.sizes && product.sizes.length > 0
    ? product.sizes
    : ["S", "M", "L", "XL"];

  // Toggle accordion section
  const toggleSection = (section) => {
    // Simplified - just toggle the section
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20 text-gray-500 text-sm uppercase tracking-wider">
          Loading product details...
        </div>
      ) : !product ? (
        <div className="flex-1 flex items-center justify-center py-20 text-gray-500 text-sm uppercase tracking-wider">
          Product not found
        </div>
      ) : (
        <main className="w-full bg-white text-black py-6">
          <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(320px,440px)] gap-6 lg:gap-12 xl:gap-16 items-start">

              {/* Left Side - Product Images */}
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full max-w-full">
                {/* Thumbnail Images */}
                {images.length > 0 && (
                  <div className="flex flex-col md:flex-col gap-2 sm:gap-3 w-full md:w-[72px] lg:w-[82px] xl:w-[90px] 2xl:w-[100px] shrink-0 overflow-x-auto md:overflow-visible scrollbar-none py-1 md:py-0">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`shrink-0 overflow-hidden bg-[#f5f5f5] border-2 transition-all rounded-sm w-[56px] h-[70px] sm:w-[65px] sm:h-[82px] md:w-full md:h-[90px] lg:h-[102px] xl:h-[112px] 2xl:h-[125px] ${
                          selectedImage === index ? "border-black scale-[0.98]" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product?.name || "Product"} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="relative w-full max-w-[590px] h-190 bg-[#f5f5f5] overflow-hidden aspect-[4/5] sm:aspect-[4/5] md:aspect-[0.95] lg:aspect-[0.96] xl:aspect-[1] rounded-md">
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage] || images[0]}
                      alt={product?.name || "Product"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                      No image available
                    </div>
                  )}

                  {/* Next Button */}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSelectedImage((prev) => prev === images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 text-white text-xl hover:bg-black/60 active:scale-95 transition"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  )}

                  {/* Previous Button */}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSelectedImage((prev) => prev === 0 ? images.length - 1 : prev - 1)}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 text-white text-xl hover:bg-black/60 active:scale-95 transition"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side - Product Information */}
              <div className="w-full max-w-[440px] lg:pt-1 xl:pt-2 2xl:pt-3">
                {/* Product Name + Price */}
                <div className="flex items-start justify-between gap-4 pb-5 sm:pb-6 border-b border-[#e5e5e5]">
                  <h1 className="text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-medium text-black">
                    {product?.name || "Product Name"}
                  </h1>
                  <p className="shrink-0 text-[15px] sm:text-[16px] md:text-[17px] font-medium text-black">₹{product?.price || 0}</p>
                </div>

                {/* Sizes */}
                <div className="pt-4">
                  <h2 className="text-[12px] sm:text-[13px] font-semibold tracking-wide uppercase">Sizes</h2>

                  <div className="flex items-center gap-1.5 mb-3 text-[10px] sm:text-[11px] text-[#555]">
                    <span className="text-[#e75b48]">▱</span>
                    <span>We recommend one size smaller</span>
                  </div>

                  {/* Size Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`
                          min-w-[44px]
                          h-10
                          px-3
                          border
                          text-xs
                          font-medium
                          transition-all
                          rounded-sm
                          ${selectedSize === size ? "bg-black border-black text-white shadow-sm" : "bg-white border-gray-300 text-black hover:border-black"}
                        `}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback message */}
                {cartMsg.text && (
                  <div className={`mb-3 p-3 text-xs font-semibold text-center tracking-wider ${cartMsg.isError ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                    {cartMsg.text}
                  </div>
                )}

                {/* Add To Bag */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="w-full h-11 sm:h-12 md:h-[50px] bg-black text-white text-[12px] sm:text-[13px] font-semibold uppercase tracking-wide hover:bg-black/85 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                  Add to Bag
                </button>

                {/* Accordions - DETAILS, REVIEWS, DELIVERY, RETURNS */}
                <div className="mt-4">
                  {returnPolicies.map((policy, index) => (
                    <div key={index} className="border-t border-[#dedede] pt-4">
                      <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.55] text-[#222]">
                        {policy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetails;
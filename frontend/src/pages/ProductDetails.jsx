import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProductById } from "../apis/product.api.jsx";
import { useCart } from "../hook/cart.hook.jsx";
import Header from "../compenents/Header/Header.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import YouMayAlsoLike from "../compenents/ProductDetails/YouMayAlsoLike.jsx";

// Static return policy list
const returnPolicies = [
  "First-time customers enjoy free returns on their first order - no return fee applies.",
  "For all subsequent orders, a return fee of ₹25 per item is charged, upto ₹100 per order.",
  "Returns or Exchanges accepted within 7 days of delivery for Non - Rudraa X members, subject to applicable product and promotion eligibility criteria.",
  "Returns or Exchanges accepted within 30 days of delivery for Rudraa X members, subject to applicable product and promotion eligibility criteria.",
  "Orders placed using the NORETURN10 coupon are not eligible for returns. Only size exchanges are allowed.",
  "Prepaid orders will be refunded to the original payment method, COD orders can be refunded as wallet credits or directly to a UPI ID of your choice.",
  "Defective, incorrect, or damaged items must be reported within 24 hours of delivery for an eligible return.",
  "Items purchased under special promotions (such as BOGO offers, etc.) are not eligible for returns or exchanges.",
  "To ensure standard hygiene, certain product categories including Accessories(Jewellery,Caps,Belts,Bandana), Sunglasses, and Perfumes cannot be returned once delivered.",
  "Exchanges are subject to availability of sizes.",
];

const ProductDetails = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  // 1. URL search parameter se product ka id get kar rahe hain (?id=xyz)
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  // 2. Product data aur loading state manage karne ke liye useState
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Selected image index aur selected size maintain karne ke liye state
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  // 4. Cart submit state aur feedback alert
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState({ text: "", isError: false });

  // Handle Add to Bag
  const handleAddToBag = async () => {
    if (!product) return;

    // Product ke DB sizes check karo (not fake UI defaults)
    const hasSizesInDB = product.sizes && product.sizes.length > 0;

    if (hasSizesInDB && !selectedSize) {
      setCartMsg({ text: "Please select a size first", isError: true });
      setTimeout(() => setCartMsg({ text: "", isError: false }), 3500);
      return;
    }

    // Agar user ne UI se fake size select kiya but DB me sizes nahi hai,
    // to size send mat karo
    if (!hasSizesInDB && selectedSize && !product.sizes.includes(selectedSize)) {
      // Reset selectedSize — ye fake size hai
      setSelectedSize("");
    }

    try {
      setAddingToCart(true);
      setCartMsg({ text: "", isError: false });

      const res = await addItem({
        product: product._id,
        quantity: 1,
        size: hasSizesInDB ? selectedSize : undefined,
      });

      if (res?.success) {
        setCartMsg({ text: "Added to Bag successfully!", isError: false });
        setTimeout(() => setCartMsg({ text: "", isError: false }), 3500);
      } else {
        setCartMsg({
          text: res?.message || "Failed to add product to bag",
          isError: true,
        });
        setTimeout(() => setCartMsg({ text: "", isError: false }), 3500);
      }
    } catch (err) {
      console.error("Add to bag error:", err);
      setCartMsg({ text: "Something went wrong", isError: true });
      setTimeout(() => setCartMsg({ text: "", isError: false }), 3500);
    } finally {
      setAddingToCart(false);
    }
  };

  // 4. Accordions show/hide toggle karne ke liye state
  const [openSection, setOpenSection] = useState({
    details: false,
    reviews: false,
    delivery: false,
    returns: false,
  });

  // 5. Page load par specific product ka details database/API se lane ke liye useEffect
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSingleProduct = async () => {
      // Agar URL me productId nahi hai to loading band kar denge
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // API call to backend for single product details
        const data = await getProductById(productId);

        if (data?.product) {
          setProduct(data.product);
          // Standard size default assign kar rahe hain
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

  // DB se product images array agar blank ho to fallback image use karenge
  const images = (product?.images && product.images.length > 0)
    ? product.images
    : ["/product-image.jpg"];

  // DB se product sizes array agar blank ho to default sizes dikhayenge
  const sizes = (product?.sizes && product.sizes.length > 0)
    ? product.sizes
    : ["S", "M", "L", "XL", "XXL"];

  // Accordion toggle karne ka helper function
  const toggleSection = (section) => {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Top Header Navbar */}
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
          <div
            className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 md:px-8 lg:px-10"
          >
            <div
              className=" grid grid-cols-1 lg:grid-cols-[auto_minmax(320px,440px)] gap-6 lg:gap-12 xl:gap-16 items-start"
            >
              {/* =========================================================
                  LEFT SIDE - PRODUCT IMAGES
              ========================================================= */}

              <div
                className="
                  flex
                  flex-col
                  md:flex-row
                  gap-3
                  sm:gap-4
                  w-full
                  max-w-full
                "
              >
                {/* Thumbnail Images */}

                {images.length > 0 && (
                  <div
                    className=" order-2 md:order-1 flex md:flex-col gap-2 sm:gap-3 w-full md:w-[72px] lg:w-[82px] xl:w-[90px] 2xl:w-[100px] shrink-0 overflow-x-auto md:overflow-visible scrollbar-none py-1 md:py-0
                    "
                  >
                    {images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={` shrink-0 overflow-hidden bg-[#f5f5f5] border-2 transition-all rounded-sm w-[56px] h-[70px] sm:w-[65px] sm:h-[82px] md:w-full md:h-[90px] lg:h-[102px] xl:h-[112px] 2xl:h-[125px]
                          ${
                            selectedImage === index
                              ? "border-black scale-[0.98]"
                              : "border-transparent opacity-70 hover:opacity-100"
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

                <div
                  className=" order-1 md:order-2 relative w-full max-w-full md:w-[590px] h-190 bg-[#f5f5f5] overflow-hidden aspect-[4/5] sm:aspect-[4/5] md:aspect-[0.95] lg:aspect-[0.96] xl:aspect-[1] rounded-md md:rounded-none"
                >
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage] || images[0]}
                      alt={product?.name || "Product"}
                      className=" absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className=" absolute inset-0 flex items-center justify-center text-sm text-gray-400"
                    >
                      No image available
                    </div>
                  )}

                  {/* Previous Button */}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        className="
                          absolute
                          left-3
                          sm:left-4
                          top-1/2
                          -translate-y-1/2
                          flex
                          items-center
                          justify-center
                          w-8
                          h-8
                          sm:w-9
                          sm:h-9
                          rounded-full
                          bg-black/40
                          text-white
                          text-xl
                          hover:bg-black/60
                          active:scale-95
                          transition
                          z-10
                        "
                        aria-label="Previous image"
                      >
                        ‹
                      </button>

                      {/* Next Button */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="
                          absolute
                          right-3
                          sm:right-4
                          top-1/2
                          -translate-y-1/2
                          flex
                          items-center
                          justify-center
                          w-8
                          h-8
                          sm:w-9
                          sm:h-9
                          rounded-full
                          bg-black/40
                          text-white
                          text-xl
                          hover:bg-black/60
                          active:scale-95
                          transition
                          z-10
                        "
                        aria-label="Next image"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* =========================================================
                  RIGHT SIDE - PRODUCT INFORMATION
              ========================================================= */}

              <div
                className="
                  w-full
                  max-w-[440px]
                  lg:pt-1
                  xl:pt-2
                  2xl:pt-3
                "
              >
                {/* Product Name + Price */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                    pb-5
                    sm:pb-6
                    border-b
                    border-[#e5e5e5]
                  "
                >
                  <h1
                    className="
                      text-[15px]
                      sm:text-[16px]
                      md:text-[17px]
                      lg:text-[18px]
                      xl:text-[19px]
                      2xl:text-[20px]
                      font-medium
                      leading-tight
                      text-black
                    "
                  >
                    {product?.name || "Product Name"}
                  </h1>

                  <p
                    className="
                      shrink-0
                      text-[15px]
                      sm:text-[16px]
                      md:text-[17px]
                      font-medium
                      text-black
                    "
                  >
                    ₹{product?.price || 0}
                  </p>
                </div>

                {/* =====================================================
                    SIZE
                ===================================================== */}

                <div className="pt-6 sm:pt-7">
                  <div className="flex items-center justify-between mb-3">
                    <h2
                      className="
                        text-[12px]
                        sm:text-[13px]
                        font-semibold
                        tracking-wide
                        uppercase
                      "
                    >
                      Sizes
                    </h2>

                    <button
                      type="button"
                      className="
                        text-[10px]
                        sm:text-[11px]
                        underline
                        underline-offset-2
                        font-medium
                      "
                    >
                      SIZE CHART
                    </button>
                  </div>

                  {/* Size Recommendation */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      mb-3
                      text-[10px]
                      sm:text-[11px]
                      text-[#555]
                    "
                  >
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
                          ${
                            selectedSize === size
                              ? "bg-black border-black text-white shadow-sm"
                              : "bg-white border-gray-300 text-black hover:border-black"
                          }
                        `}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    py-4
                    sm:py-5
                    text-[10px]
                    sm:text-[11px]
                    text-[#333]
                  "
                >
                  <span>
                    <b>FREE</b> 1-2 day delivery on <b>5k+</b> pincodes
                  </span>
                </div>

                {/* Feedback message (Error / Success) */}
                {cartMsg.text && (
                  <div
                    className={`mb-3 p-3 text-xs font-semibold text-center border uppercase tracking-wider ${
                      cartMsg.isError
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {cartMsg.text}
                  </div>
                )}

                {/* Add To Bag */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  disabled={addingToCart}
                  className="
                    w-full
                    h-11
                    sm:h-12
                    md:h-[50px]
                    bg-black
                    text-white
                    text-[12px]
                    sm:text-[13px]
                    font-semibold
                    uppercase
                    tracking-wide
                    hover:bg-black/85
                    active:scale-[0.99]
                    transition-all
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    cursor-pointer
                  "
                >
                  {addingToCart ? "Adding to Bag..." : "Add to Bag"}
                </button>

                {/* =====================================================
                    ACCORDIONS
                ===================================================== */}

                <div className="mt-5 sm:mt-6">
                  {/* DETAILS */}

                  <section className="border-t border-[#dedede]">
                    <button
                      type="button"
                      onClick={() => toggleSection("details")}
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        py-5
                        sm:py-6
                        text-left
                        cursor-pointer
                      "
                    >
                      <h2
                        className="
                          text-[12px]
                          sm:text-[13px]
                          font-medium
                        "
                      >
                        DETAILS
                      </h2>

                      <span className="text-xl font-light leading-none">
                        {openSection.details ? "−" : "+"}
                      </span>
                    </button>

                    {openSection.details && (
                      <div
                        className="
                          pb-6
                          sm:pb-7
                          px-0
                          sm:px-5
                          lg:px-6
                          xl:px-8
                        "
                      >
                        {/* Description */}

                        <p
                          className="
                            text-[14px]
                            sm:text-[15px]
                            md:text-[16px]
                            leading-[1.55]
                            text-[#171717]
                            mb-6
                          "
                        >
                          {product?.description ||
                            "No description available for this product."}
                        </p>

                        {/* SKU */}

                        <p className="text-[14px] sm:text-[15px]">
                          SKU: {product?.sku || "N/A"}
                        </p>
                      </div>
                    )}
                  </section>

                  {/* REVIEWS */}

                  <section className="border-t border-[#dedede]">
                    <button
                      type="button"
                      onClick={() => toggleSection("reviews")}
                      className=" w-full flex items-center justify-between py-5 sm:py-6 text-left cursor-pointer "
                    >
                      <h2
                        className=" text-[12px] sm:text-[13px] font-medium "
                      >
                        REVIEWS
                      </h2>

                      <span className="text-xl font-light leading-none">
                        {openSection.reviews ? "−" : "+"}
                      </span>
                    </button>

                    {openSection.reviews && (
                      <div className="pb-6 sm:pb-7">
                        <p className="text-sm text-gray-500">
                          Product reviews will appear here.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* DELIVERY */}

                  <section className="border-t border-[#dedede]">
                    <button
                      type="button"
                      onClick={() => toggleSection("delivery")}
                      className=" w-full flex items-center justify-between py-5 sm:py-6 text-left cursor-pointer"
                    >
                      <h2
                        className=" text-[12px] sm:text-[13px] font-medium"
                      >
                        DELIVERY
                      </h2>

                      <span className="text-xl font-light leading-none">
                        {openSection.delivery ? "−" : "+"}
                      </span>
                    </button>

                    {openSection.delivery && (
                      <div className="pb-6 sm:pb-7">
                        <p
                          className=" text-[13px] sm:text-[14px] leading-6 text-[#333]"
                        >
                          Free 1-2 day delivery available on eligible
                          pincodes.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* RETURNS */}

                  <section className="border-t border-b border-[#dedede]">
                    <button
                      type="button"
                      onClick={() => toggleSection("returns")}
                      className=" w-full flex items-center justify-between py-5 sm:py-6 text-left cursor-pointer">
                      <h2
                        className="text-[12px] sm:text-[13px] font-medium"
                      >
                        RETURNS
                      </h2>

                      <span className="text-xl font-light leading-none">
                        {openSection.returns ? "−" : "+"}
                      </span>
                    </button>

                    {openSection.returns && (
                      <div
                        className=" pb-7 sm:pb-8 px-0 sm:px-5 lg:px-6 xl:px-8 "
                      >
                        <ol
                          className=" list-decimal pl-5 space-y-4 text-[13px] sm:text-[14px] md:text-[15px] leading-[1.55] text-[#222]"
                        >
                          {returnPolicies.map((policy, index) => (
                            <li key={index} className="pl-1">
                              {policy}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Related Products - You May Also Like */}
      {product && (
        <YouMayAlsoLike
          currentProductId={product._id}
          categoryId={product.category?._id}
          categorySlug={
            product.category?.slug ||
            (typeof product.category === "string" ? product.category : "")
          }
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetails;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../../hook/product.hook.jsx";

const NewArrivalSection = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const { products, fetchProducts } = useProduct();
  const [loading, setLoading] = useState(false);

  const categories = [
    "ALL",
    "SHIRTS",
    "T-SHIRTS",
    "JEANS",
    "TROUSERS",
    "SHOES",
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      if (fetchProducts) {
        await fetchProducts();
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Category matching logic
  const isProductInCategory = (product, targetCategory) => {
    if (targetCategory === "ALL") return true;
    if (!product || !product.category) return false;

    let catString = "";
    if (typeof product.category === "string") {
      catString = product.category;
    } else if (typeof product.category === "object") {
      catString = product.category.name || product.category.slug || "";
    }

    if (!catString) return false;

    const cleanCat = catString.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanTarget = targetCategory.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Direct exact match
    if (cleanCat === cleanTarget) return true;

    // Plural/singular match (e.g. shirt <-> shirts)
    if (cleanCat + "s" === cleanTarget || cleanCat === cleanTarget + "s") return true;

    // Explicit check for T-Shirt vs Shirt to prevent false inclusion
    if (cleanTarget === "shirts" && cleanCat.includes("tshirt")) {
      return false;
    }

    return false;
  };

  const filteredProducts = (products || []).filter((product) =>
    isProductInCategory(product, activeCategory)
  );

  return (
    <section className="py-6 w-full bg-white text-black py-8">

      {/* Heading */}
      <div className="text-center">
        <h2 className="text-center text-[15px] font-extrabold uppercase scale-y-103 tracking-widest text-black mb-6">
          NEW AND POPULAR
        </h2>
      </div>

      {/* Categories */}
      <div className="mt-6 flex items-center justify-center gap-2.5 flex-wrap px-4">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                h-[28px]
                px-2.5
                border border-black
                text-[12px]
                uppercase
                font-normal
                cursor-pointer
                
                ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white text-black "
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="mt-6 px-4 sm:px-6 lg:px-[4.4%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-500 text-xs uppercase tracking-wider">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500 text-xs uppercase tracking-wider">
            No products found in this category
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Link
              key={product._id || product.id}
              to={`/product?id=${product._id || product.id}`}
              className="w-full max-w-[280px] cursor-pointer block group"
            >

              {/* Product Image */}
              <div className="w-full h-90 aspect-[0.92] overflow-hidden bg-[#f5f5f5]">
                <img
                  src={
                    (product.images && product.images.length > 0)
                      ? product.images[0]
                      : "/product-image.jpg"
                  }
                  alt={product.name || "Product"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="pt-2">
                <h3 className="text-[13px] sm:text-[14px] leading-[1.25] font-normal truncate">
                  {product.name}
                </h3>

                <p className="mt-1 text-[13px] sm:text-[14px] leading-none">
                  ₹{product.price}
                </p>
              </div>

            </Link>
          ))
        )}
      </div>

    </section>
  );
};

export default NewArrivalSection;

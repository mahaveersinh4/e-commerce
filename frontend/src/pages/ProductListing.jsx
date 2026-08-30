import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import Header from "../compenents/Header/Header.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import { useCategory } from "../hook/category.hook.jsx";
import { getAllProducts } from "../apis/product.api.jsx";

const ProductList = () => {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryCategory = searchParams.get("category");
  const querySearch = searchParams.get("search");
  const activeCategorySlug = categorySlug || queryCategory || "";
  const activeSearch = querySearch || "";

  const { categories, fetchCategories } = useCategory();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFuzzyMatch, setIsFuzzyMatch] = useState(false);

  // Fetch categories on mount if not loaded
  useEffect(() => {
    fetchCategories();
  }, []);

  // Scroll to top when page mounts or category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategorySlug, activeSearch]);

  // Fetch products whenever activeCategorySlug or search changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts(activeCategorySlug, activeSearch);
        if (res && res.products) {
          setProducts(res.products);
          setIsFuzzyMatch(Boolean(res.isFuzzyMatch));
        } else {
          setProducts([]);
          setIsFuzzyMatch(false);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
        setIsFuzzyMatch(false);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeCategorySlug, activeSearch]);

  // Find active category details
  const currentCategoryObj = categories.find(
    (c) => c.slug.toLowerCase() === activeCategorySlug.toLowerCase()
  );

  const pageTitle = currentCategoryObj
    ? currentCategoryObj.name.toUpperCase()
    : activeSearch
    ? `SEARCH RESULTS FOR "${activeSearch.toUpperCase()}"`
    : activeCategorySlug
    ? activeCategorySlug.toUpperCase().replace(/-/g, " ")
    : "ALL PRODUCTS";

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Top Header */}
      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-6 sm:px-6 lg:px-10">
        {/* Category Header & Breadcrumb */}
        <div className="border-b border-black/10 pb-6 mb-6">
          <div className="flex items-center gap-2 text-xs text-black/50 uppercase tracking-wider mb-2">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-black transition-colors">
              Products
            </Link>
            {(activeCategorySlug || activeSearch) && (
              <>
                <span>/</span>
                <span className="text-black font-semibold">Search</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
                {pageTitle}
              </h1>
              {!loading && (
                <p className="text-xs sm:text-sm text-black/60 mt-1 uppercase tracking-wider">
                  {products.length} {products.length === 1 ? "Product" : "Products"} Available
                </p>
              )}
            </div>

            {/* Quick Category Tabs / Filter Chips */}
            
          </div>

          {activeSearch && !loading && products.length > 0 && (
            <div className="mt-4 pt-3 border-t border-black/5 text-xs text-black/70 font-medium">
              {isFuzzyMatch ? (
                <span>Showing results related to <strong className="text-black">"{activeSearch}"</strong></span>
              ) : (
                <span>Showing results for <strong className="text-black">"{activeSearch}"</strong></span>
              )}
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="animate-pulse flex flex-col gap-2">
                <div className="aspect-[0.85] bg-gray-100 rounded-sm w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-black/15 rounded-lg my-8">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-black/30 mb-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <h3 className="text-lg font-bold uppercase tracking-wide text-black mb-1">
              No Products Found
            </h3>
            <p className="text-sm text-black/60 mb-6 max-w-sm">
              We couldn't find any products matching "{activeSearch || activeCategorySlug || "your request"}".
            </p>
            <Link
              to="/products"
              className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-black/80 transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => {
              const imageSrc =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/images/shirt.jpg";

              return (
                <Link
                  key={product._id}
                  to={`/product?id=${product._id}`}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[0.85] w-full overflow-hidden bg-[#f5f5f5]">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                  </div>

                  {/* Product Details */}
                  <div className="pt-3 flex flex-col flex-1 justify-between">
                    <div>
                      <h2 className="truncate text-sm font-normal text-black group-hover:underline underline-offset-2">
                        {product.name}
                      </h2>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-black">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductList;
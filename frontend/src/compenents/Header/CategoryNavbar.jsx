import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../../hook/category.hook.jsx";

const CategoryNavbar = () => {
  const { categories, loading, fetchCategories } = useCategory();

  // Component mount hone par categories fetch karo
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="border-t border-black/10 flex justify-center">
      {/* 
        overflow-x-auto + whitespace-nowrap + scrollbar-hide 
        = horizontal scroll, scrollbar nahi dikhega
      */}
      <nav className="flex items-center gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-10 h-11 sm:h-12 overflow-x-auto whitespace-nowrap scrollbar-hide">

        {/* Discover - All Products page */}
        <Link
          to="/products"
          className="text-sm font-medium shrink-0 hover:text-black/60 transition-colors duration-200 uppercase tracking-wider"
        >
          All Products
        </Link>

        {/* Loading state */}
        {loading && (
          <>
            {/* Skeleton placeholders */}
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-14 h-3 bg-black/10 rounded animate-pulse shrink-0"
              />
            ))}
          </>
        )}

        {/* DB se aayi categories */}
        {!loading &&
          categories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="text-sm font-medium shrink-0 hover:text-black/60 transition-colors duration-200 uppercase tracking-wider"
            >
              {category.name}
            </Link>
          ))}

      </nav>
    </div>
  );
};

export default CategoryNavbar;

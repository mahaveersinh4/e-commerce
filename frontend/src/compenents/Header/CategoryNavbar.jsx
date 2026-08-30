import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../../hook/category.hook.jsx";

const CategoryNavbar = () => {
  const { categories, loading } = useCategory();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="border-t border-black/10 flex justify-center">
      <nav className="flex items-center gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-10 h-11 sm:h-12 overflow-x-auto whitespace-nowrap scrollbar-hide">

        {/* Discover - All Products page */}
        <Link
          to="/products"
          className="text-sm font-medium shrink-0 hover:text-black/60 transition-colors duration-200 uppercase tracking-wider"
        >
          All Products
        </Link>

        {/* DB se aayi categories */}
        {categories.map((category) => (
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
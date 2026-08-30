import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../../hook/category.hook.jsx";

const FeaturedCategories = () => {
  const { categories, loading, fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="py-10">
      {/* Heading */}
      <h2 className="text-center text-[15px] font-extrabold uppercase scale-y-103 tracking-widest text-black mb-6">
        Featured Categories
      </h2>

      {loading ? (
        // Loading skeleton
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="border border-black/10 p-4 animate-pulse"
            >
              <div className="aspect-square bg-gray-100 rounded mb-2" />
              <div className="h-3 w-16 bg-gray-200 mx-auto rounded" />
            </div>
          ))}
        </div>
      ) : (
        // Categories grid
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          {categories
            .filter((cat) => cat.image)
            .map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="
                  border border-black/10
                  p-3
                  hover:bg-black/5
                  transition-colors
                  cursor-pointer
                  group
                  flex
                  flex-col
                  items-center
                "
              >
                {/* Category image */}
                <div className="aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-black text-center truncate w-full">
                  {cat.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedCategories;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../apis/product.api.jsx";

const YouMayAlsoLike = ({ currentProductId, categoryId, categorySlug }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const targetCategory = categorySlug || categoryId;
      if (!targetCategory) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAllProducts(targetCategory);

        if (data?.products) {
          // Current product ko exclude kar rahe hain aur max 5 items dikhate hain
          const filtered = data.products
            .filter((p) => p._id !== currentProductId)
            .slice(0, 5);

          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, categoryId, categorySlug]);

  return (
    <section className="w-full bg-white py-8 border-t border-black/10 mt-8">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 md:px-8 lg:px-10">
        <h2 className="text-center text-[15px] font-extrabold uppercase tracking-widest text-black mb-6">
          YOU MAY ALSO LIKE
        </h2>

        {loading
          ? "Loading related products..."
          : relatedProducts.length === 0
          ? <p className="text-center text-gray-500">No related products found</p>
          : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {relatedProducts.map((product) => {
                const imageSrc =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "/product-image.jpg";

                return (
                  <Link
                    key={product._id}
                    to={`/product?id=${product._id}`}
                    className="flex flex-col cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative aspect-[0.9] w-full overflow-hidden bg-[#f5f5f5]">
                      <img
                        src={imageSrc}
                        alt={product.name || "Related Product"}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* Details */}
                    <div className="pt-2.5 flex flex-col flex-1">
                      <h3 className="truncate text-xs sm:text-sm font-normal text-black group-hover:underline underline-offset-2">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm font-semibold text-black">
                        ₹{product.price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
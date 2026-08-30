import { createContext, useState } from "react";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../apis/product.api.jsx";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get all products (with optional category filter)
  const fetchProducts = async (category) => {
    const data = await getAllProducts(category);

    if (data) {
      setProducts(data.products);
    }
    return data;
  };

  // Get one product
  const fetchProduct = async (id) => {
    const data = await getProductById(id);

    if (data) {
      setSelectedProduct(data.product);
    }
  };

  // Add product
  const addProduct = async (formData) => {
    const data = await createProduct(formData);

    if (data) {
      setProducts([...products, data.product]);
    }

    return data;
  };

  // Update product
  const editProduct = async (id, formData) => {
    const data = await updateProduct(id, formData);

    if (data) {
      const updatedProducts = products.map((product) => {
        if (product._id === id) {
          return data.product;
        }

        return product;
      });

      setProducts(updatedProducts);
    }

    return data;
  };

  // Delete product
  const removeProduct = async (id) => {
    const data = await deleteProduct(id);

    if (data) {
      const remainingProducts = products.filter(
        (product) => product._id !== id
      );

      setProducts(remainingProducts);
    }

    return data;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedProduct,
        fetchProducts,
        fetchProduct,
        addProduct,
        editProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

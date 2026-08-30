import { useContext } from "react";
import { ProductContext } from "../context/product.context.jsx";

// Product context ko easy tarike se use karne ka hook
export const useProduct = () => {
  const context = useContext(ProductContext);
  return context;
};

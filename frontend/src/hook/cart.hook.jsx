import { useContext } from "react";
import { CartContext } from "../context/cart.context.jsx";

// Cart context ko easy tarike se use karne ka hook
export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};

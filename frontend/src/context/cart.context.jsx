import { createContext, useState } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../apis/cart.api.jsx";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cart fetch karo
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      if (data && data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Product cart me add karo
  const addItem = async ({ product, quantity, size }) => {
    try {
      const data = await addToCart({ product, quantity, size });
      if (data && data.cart) setCart(data.cart);
      return data;
    } catch (err) {
      console.error("addItem error:", err);
      return { success: false, message: err?.response?.data?.message || "Failed to add to cart" };
    }
  };

  // Cart item update karo (quantity ya size)
  const updateItem = async (itemId, { quantity, size }) => {
    try {
      const data = await updateCartItem(itemId, { quantity, size });
      if (data && data.cart) setCart(data.cart);
      return data;
    } catch (err) {
      console.error("updateItem error:", err);
    }
  };

  // Ek item cart se hatao
  const removeItem = async (itemId) => {
    try {
      const data = await removeFromCart(itemId);
      if (data && data.cart) setCart(data.cart);
      return data;
    } catch (err) {
      console.error("removeItem error:", err);
    }
  };

  // Poora cart saaf karo
  const emptyCart = async () => {
    try {
      const data = await clearCart();
      if (data) setCart({ products: [] });
      return data;
    } catch (err) {
      console.error("emptyCart error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

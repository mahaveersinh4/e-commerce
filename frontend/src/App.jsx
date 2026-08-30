import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes";
import { AuthProvider } from "./context/auth.context.jsx";
import { AdminAuthProvider } from "./context/adminAuth.context.jsx";
import { ProductProvider } from "./context/product.context.jsx";
import { CartProvider } from "./context/cart.context.jsx";

const App = () => {
  return (
    <AuthProvider>
      {/* AdminAuthProvider — admin session (sessionStorage) manage karta hai */}
      <AdminAuthProvider>
        <ProductProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </ProductProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
};

export default App;

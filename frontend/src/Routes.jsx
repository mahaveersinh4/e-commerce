import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Auth pages
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Main pages
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import ProductList from "./pages/ProductListing.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import DemoPayment from "./pages/DemoPayment.jsx";
import OrderConfirmed from "./pages/OrderConfirmed.jsx";
import MyOrders from "./pages/MyOrders.jsx";

// Admin pages
import AdminLayout from "./compenents/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";


// Route guards
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

export const router = createBrowserRouter([

  // ========================
  // Public Auth Routes
  // ========================
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify-otp", element: <VerifyOtp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  // ========================
  // Protected User Routes
  // ========================
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <ProductList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/:categorySlug",
    element: (
      <ProtectedRoute>
        <ProductList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/category/:categorySlug",
    element: (
      <ProtectedRoute>
        <ProductList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product",
    element: (
      <ProtectedRoute>
        <ProductDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/demo-payment/:paymentId",
    element: (
      <ProtectedRoute>
        <DemoPayment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-confirmed/:orderId",
    element: (
      <ProtectedRoute>
        <OrderConfirmed />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-orders",
    element: (
      <ProtectedRoute>
        <MyOrders />
      </ProtectedRoute>
    ),
  },

  
  // ========================
  // Admin Routes (nested)
  // AdminRoute checks: loggedin + role=admin
  // AdminLayout has sidebar + Outlet
  // ========================
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },



]);

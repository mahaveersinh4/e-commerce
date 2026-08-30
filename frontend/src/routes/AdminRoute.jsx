import { Navigate } from "react-router-dom";
import { useAuth } from "../hook/auth.hook.jsx";
import { useAdminAuth } from "../hook/adminAuth.hook.jsx";

// Admin Panel Route Guard:
// 1. Normal login chahiye
// 2. role=admin chahiye
// 3. Admin Panel session (adminSessionToken in sessionStorage) chahiye
// Teen conditions fail hone par → home redirect

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAdminLoggedIn } = useAdminAuth();

  if (loading) return <p>Loading...</p>;

  // Normal login nahi hai → login
  if (!user) return <Navigate to="/login" />;

  // Admin role nahi → home
  if (user.role !== "admin") return <Navigate to="/" />;

  // Admin session nahi (sessionStorage me token nahi) → home
  // Home pe "Go to Admin Panel" button se modal khulega
  if (!isAdminLoggedIn) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;

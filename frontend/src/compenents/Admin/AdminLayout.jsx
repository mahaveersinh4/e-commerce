import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";

// Har admin page is layout me wrap hoga
// Left: Sidebar | Right: Page content (Outlet)

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main content - sidebar ke baad shuru hoga */}
      <div className="flex-1 ml-60 min-h-screen">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;

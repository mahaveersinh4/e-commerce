import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/auth.hook.jsx";
import { useAdminAuth } from "../../hook/adminAuth.hook.jsx";

// Sidebar navigation items
const navItems = [
  {
    label: "Dashboard",
    to: "/admin",
    end: true, // sirf exact /admin match karo
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Products",
    to: "/admin/products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: "Categories",
    to: "/admin/categories",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    ),
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

const AdminSidebar = () => {
  const { user } = useAuth();
  const { adminLogoutHandle } = useAdminAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    adminLogoutHandle(); // sirf admin session clear
    navigate("/");       // home pe wapas jao (normal login active rahega)
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900 text-white flex flex-col z-40">

      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-slate-700/60">
        <h1 className="text-xl font-bold tracking-tight">RUDRAA</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-widest">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive
                ? "bg-white text-slate-900"
                : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Admin user info + Logout */}
      <div className="px-4 py-5 border-t border-slate-700/60">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-semibold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">{user?.username}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleAdminLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Exit Admin Panel
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;

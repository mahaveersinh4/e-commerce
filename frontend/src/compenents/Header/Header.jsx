import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/auth.hook.jsx";
import { useAdminAuth } from "../../hook/adminAuth.hook.jsx";
import { useCart } from "../../hook/cart.hook.jsx";
import { getAllProducts } from "../../apis/product.api.jsx";
import AdminLoginModal from "../Admin/AdminLoginModal.jsx";
import CategoryNavbar from "./CategoryNavbar.jsx";

const Header = () => {
  const { user, logoutHandle } = useAuth();
  const { isAdminLoggedIn } = useAdminAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);

  // Fetch cart when header mounts (auth token is ready by now)
  useEffect(() => {
    fetchCart();
  }, []);

  // Click outside listener to hide suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop =
        searchContainerRef.current &&
        searchContainerRef.current.contains(e.target);
      const inMobile =
        mobileSearchContainerRef.current &&
        mobileSearchContainerRef.current.contains(e.target);

      if (!inDesktop && !inMobile) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search suggestions fetching
  useEffect(() => {
    const query = searchTerm.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await getAllProducts("", query);
        if (res && res.products && res.products.length > 0) {
          setSuggestions(res.products.slice(0, 5));
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Failed to fetch search suggestions:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const totalCartCount =
    cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Admin Panel button click handler
  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      navigate("/admin");
    } else {
      setShowAdminModal(true);
    }
  };

  const executeSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    setIsMobileSearchOpen(false);
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectSuggestion = (product) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    setIsMobileSearchOpen(false);
    if (product?._id) {
      navigate(`/product?id=${product._id}`);
    } else if (product?.name) {
      navigate(`/products?search=${encodeURIComponent(product.name)}`);
    }
  };

  // Scroll selected suggestion into view during keyboard navigation
  useEffect(() => {
    if (selectedIndex < 0) return;
    const el =
      searchContainerRef.current?.querySelector(`[data-suggestion-index="${selectedIndex}"]`) ||
      mobileSearchContainerRef.current?.querySelector(`[data-suggestion-index="${selectedIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showSuggestions || suggestions.length === 0) return;
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!showSuggestions || suggestions.length === 0) return;
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        executeSearch(searchTerm);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (showSuggestions && selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else {
      executeSearch(searchTerm);
    }
  };

  return (
    <>
      <header className="w-full bg-white text-black border-b border-black/10 sticky top-0 z-50">

        {/* Main Header Bar */}
        <div className="relative h-14 sm:h-16 md:h-[70px] flex items-center justify-between px-4 sm:px-6 lg:px-10">

          {/* LEFT — Hamburger (sirf mobile) */}
          <button
            className="block lg:hidden w-7 cursor-pointer"
            aria-label="Open menu"
          >
            <span className="block w-7 h-px bg-black"></span>
            <span className="block w-7 h-px bg-black mt-[5px]"></span>
            <span className="block w-7 h-px bg-black mt-[5px]"></span>
          </button>

          {/* CENTER — Logo (always centered) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/">
              <h1 className="text-2xl sm:text-[26px] md:text-3xl font-black tracking-[-0.06em] leading-none">
                RUDRAA
              </h1>
            </Link>
          </div>

          {/* RIGHT — Search + Admin + Account + Cart */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">

            {/* Desktop Search Bar */}
            <div
              ref={searchContainerRef}
              className="hidden sm:flex items-center border border-black h-10 md:h-11 w-[200px] md:w-[260px] lg:w-[300px] px-3 gap-2 bg-white"
              style={{ position: "relative" }}
            >
              <form onSubmit={handleFormSubmit} className="flex items-center w-full gap-2">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="shrink-0 text-black/50"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <input
                  type="text"
                  placeholder='Search "POLO T-SHIRTS"'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm outline-none bg-transparent placeholder:text-black/30 text-black"
                />
                <button
                  type="submit"
                  className="cursor-pointer px-1 py-1 text-black/50 hover:text-black shrink-0 transition-colors"
                  title="Search"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
                  </svg>
                </button>
              </form>

              {/* Suggestions Dropdown — Directly aligned under search bar */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className="bg-white border border-black/15 shadow-xl rounded-sm max-h-80 overflow-y-auto divide-y divide-black/5"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "6px",
                    zIndex: 9999,
                    width: "100%",
                  }}
                >
                  {suggestions.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const imageSrc =
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : "/images/shirt.jpg";

                    return (
                      <div
                        key={item._id}
                        data-suggestion-index={index}
                        onClick={() => handleSelectSuggestion(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                          isSelected ? "bg-black/5" : "hover:bg-black/5"
                        }`}
                      >
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-sm bg-gray-100 shrink-0 border border-black/5"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`text-xs font-medium text-black truncate ${isSelected ? "font-semibold text-black" : ""}`}>
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-black/50">
                            {item.category?.name && (
                              <span className="uppercase tracking-wider text-[10px] text-black/40 font-medium">
                                {item.category.name}
                              </span>
                            )}
                            {item.category?.name && <span>•</span>}
                            <span className="font-semibold text-black">₹{item.price}</span>
                          </div>
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`shrink-0 transition-opacity duration-150 ${
                            isSelected ? "opacity-100 text-black" : "opacity-0"
                          }`}
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search Icon — only mobile */}
            <button
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className="sm:hidden cursor-pointer"
              aria-label="Search"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
              </svg>
            </button>

            {/* Admin Panel Button — SIRF admin role users ko dikhega */}
            {user?.role === "admin" && (
              <button
                onClick={handleAdminClick}
                title="Go to Admin Panel"
                className="cursor-pointer relative group"
                aria-label="Admin Panel"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                {/* Active indicator — admin session active ho toh dot dikhao */}
                {isAdminLoggedIn && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </button>
            )}

            {/* Account + Account Slider */}
            <div className="relative items-center flex">
              <button
                onClick={() => setShowAccountMenu((prev) => !prev)}
                className="cursor-pointer"
                aria-label="Account"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <circle cx="12" cy="7" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                </svg>
              </button>

              {/* Account Slider */}
              <div
                className={` absolute right-0 top-full mt-4 w-[300px]  bg-white border border-black/10 shadow-[0_18px_45px_rgba(0,0,0,0.10)] z-[100] origin-top-right transition-all duration-300 ease-out
                    ${showAccountMenu
                    ? "opacity-100 translate-y-0 scale-100 visible"
                    : "opacity-0 -translate-y-2 scale-[0.98] invisible pointer-events-none"}`}
              >
                {/* Top */}
                <div className="px-6 pt-6 pb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40 mb-3">
                    Welcome Back
                  </p>

                  <h2 className="text-2xl font-bold uppercase tracking-tight leading-none">
                    Hello, {user?.username}
                  </h2>

                  <p className="mt-3 text-xs text-black/45">
                    You are successfully logged in.
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-black/10" />

                {/* Bottom */}
                <div className="p-5 space-y-2">
                  <Link
                    to="/my-orders"
                    onClick={() => setShowAccountMenu(false)}
                    className="flex items-center justify-center gap-2 w-full h-11 border border-black text-black text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    My Orders
                  </Link>

                  <button
                    onClick={() => {
                      logoutHandle();
                      setShowAccountMenu(false);
                    }}
                    className="w-full h-11 bg-black text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-black/80 transition-colors duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>


            {/* Cart Icon with badge */}
            <Link
              to="/cart"
              className="cursor-pointer relative flex items-center justify-center p-1"
              aria-label="View Cart"
              title="Shopping Cart"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M5 8h14l-1 13H6L5 8Z" />
                <path d="M9 8a3 3 0 0 1 6 0" />
              </svg>

              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white leading-none">
                  {totalCartCount}
                </span>
              )}
            </Link>




          </div>
        </div>

        {/* Mobile Search Bar Drawer */}
        {isMobileSearchOpen && (
          <div
            ref={mobileSearchContainerRef}
            className="sm:hidden border-t border-black/10 bg-white px-4 py-3"
            style={{ position: "relative" }}
          >
            <form onSubmit={handleFormSubmit} className="relative flex items-center border border-black h-10 px-3 gap-2 w-full bg-white">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="shrink-0 text-black/50"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                type="text"
                placeholder='Search "POLO T-SHIRTS"'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full text-sm outline-none bg-transparent placeholder:text-black/30 text-black"
              />
              <button
                type="submit"
                className="cursor-pointer px-1 py-1 text-black/50 hover:text-black shrink-0"
                title="Search"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
                </svg>
              </button>
            </form>

            {/* Mobile Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="bg-white border border-black/15 shadow-xl rounded-sm max-h-60 overflow-y-auto divide-y divide-black/5"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "1rem",
                  right: "1rem",
                  marginTop: "4px",
                  zIndex: 9999,
                }}
              >
                {suggestions.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const imageSrc =
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : "/images/shirt.jpg";

                  return (
                    <div
                      key={item._id}
                      data-suggestion-index={index}
                      onClick={() => handleSelectSuggestion(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                        isSelected ? "bg-black/5" : "hover:bg-black/5"
                      }`}
                    >
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-sm bg-gray-100 shrink-0 border border-black/5"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className={`text-xs font-medium text-black truncate ${isSelected ? "font-semibold text-black" : ""}`}>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-black/50">
                          {item.category?.name && (
                            <span className="uppercase tracking-wider text-[10px] text-black/40 font-medium">
                              {item.category.name}
                            </span>
                          )}
                          {item.category?.name && <span>•</span>}
                          <span className="font-semibold text-black">₹{item.price}</span>
                        </div>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`shrink-0 transition-opacity duration-150 ${
                          isSelected ? "opacity-100 text-black" : "opacity-0"
                        }`}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Category Navbar */}
        <CategoryNavbar />

      </header>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <AdminLoginModal onClose={() => setShowAdminModal(false)} />
      )}
    </>
  );
};

export default Header;

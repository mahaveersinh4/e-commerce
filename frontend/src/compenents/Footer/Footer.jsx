import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black border-t border-black/10 mt-auto">
      {/* Main Footer Container */}
      <div className="max-w-[1440px] mx-auto px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Info (2 Columns on lg) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link to="/">
                <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.06em] leading-none uppercase">
                  RUDRAA
                </h2>
              </Link>
              <p className="mt-4 text-xs sm:text-sm text-black/60 max-w-sm leading-relaxed">
                Elevating everyday fashion with modern aesthetics, premium comfort, and timeless designs crafted for your unique lifestyle.
              </p>
            </div>

            
          </div>

          {/* Column 1 - Quick Links */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5 text-xs text-black/70">
              <li>
                <Link to="/products" className="hover:text-black transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/shirts" className="hover:text-black transition-colors">
                  Shirts
                </Link>
              </li>
              <li>
                <Link to="/category/t-shirts" className="hover:text-black transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/category/jeans" className="hover:text-black transition-colors">
                  Jeans
                </Link>
              </li>
              <li>
                <Link to="/category/shoes" className="hover:text-black transition-colors">
                  Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Help & Info */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-black/70">
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Shipping & Delivery
                </span>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Returns & Exchanges
                </span>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Size Guide
                </span>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  FAQs
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3 - Brand & Legal */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-4">
              About Rudraa
            </h3>
            <ul className="space-y-2.5 text-xs text-black/70">
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Our Story
                </span>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Store Locator
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10 py-6 bg-[#fafafa]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-black/50 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} RUDRAA. All rights reserved.</p>
          <div className="flex items-center gap-4 text-black/70">
            <span>Secure Payments</span>
            <span>•</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

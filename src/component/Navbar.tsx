"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);

    // Handle mobile menu close on navigation
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white shadow-lg border-b-2 border-teal-600"
        : "bg-white border-b border-gray-200"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Main Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 tracking-tighter">
                KHEL BAZAAR
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 font-semibold text-gray-700">
              <Link
                href="/"
                className="relative group py-2 px-3 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-all duration-300"
              >
                🏠 Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/products"
                className="relative group py-2 px-3 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-all duration-300"
              >
                🛍️ Shop
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/community"
                className="relative group py-2 px-3 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-all duration-300"
              >
                👥 Community
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          {/* Search & Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="🔍 Search products..."
                className="w-64 px-4 py-2.5 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#00B8AE] transition-all duration-300 hover:border-[#00B8AE]/50 text-sm font-medium"
              />
            </div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 rounded-lg bg-[#00B8AE]/10 text-[#00B8AE] font-bold hover:bg-[#00B8AE]/20 transition-all duration-300 text-sm"
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="px-4 py-2 rounded-lg bg-teal-600/10 text-teal-600 font-bold hover:bg-teal-600/20 transition-all duration-300 text-sm"
                >
                  👤 Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-600 font-bold hover:bg-red-500/20 transition-all duration-300 text-sm"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/Login"
                  className="px-5 py-2.5 rounded-lg bg-white border-2 border-[#00B8AE] text-[#00B8AE] font-bold hover:bg-[#00B8AE]/10 transition-all duration-300 text-sm"
                >
                  🔐 Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-bold hover:shadow-lg transition-all duration-300 text-sm"
                >
                  📝 Sign Up
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-[#00B8AE]/10 transition-all duration-300 font-bold text-lg"
            >
              🛒
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg hover:bg-[#00B8AE]/10 hover:text-[#00B8AE] transition-all duration-300 font-bold"
            >
              🏠 Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 rounded-lg hover:bg-[#00B8AE]/10 hover:text-[#00B8AE] transition-all duration-300 font-bold"
            >
              🛍️ Shop
            </Link>
            <Link
              href="/community"
              className="block px-4 py-2 rounded-lg hover:bg-[#00B8AE]/10 hover:text-[#00B8AE] transition-all duration-300 font-bold"
            >
              👥 Community
            </Link>
            <Link
              href="/cart"
              className="block px-4 py-2 rounded-lg hover:bg-[#00B8AE]/10 hover:text-[#00B8AE] transition-all duration-300 font-bold"
            >
              🛒 Cart
            </Link>

            <div className="pt-2 border-t-2 border-gray-200 space-y-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full px-4 py-2 rounded-lg bg-[#00B8AE] text-white font-bold hover:shadow-lg transition-all duration-300"
                  >
                    📊 Dashboard
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/profile")}
                    className="w-full px-4 py-2 rounded-lg bg-teal-600 text-white font-bold hover:shadow-lg transition-all duration-300"
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:shadow-lg transition-all duration-300"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/Login"
                    className="block px-4 py-2 rounded-lg border-2 border-[#00B8AE] text-[#00B8AE] font-bold hover:bg-[#00B8AE]/10 transition-all duration-300 text-center"
                  >
                    🔐 Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-2 rounded-lg bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-bold hover:shadow-lg transition-all duration-300 text-center"
                  >
                    📝 Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
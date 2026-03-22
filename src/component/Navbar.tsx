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
  const [searchQuery, setSearchQuery] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartCount = async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { default: axiosInstance } = await import('@/src/Services/axiosinstance');
        const response = await axiosInstance.get("/api/users/cart");
        setCartItemCount(response.data.cartItems?.length || 0);
      } catch (error) {
        console.error("Failed to fetch cart count", error);
      }
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(cart.length);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, [isLoggedIn]);

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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav
      className={`w-full fixed top-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-gray-100 py-2"
        : "bg-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className={`transition-all duration-500 flex items-center justify-between rounded-2xl px-6 ${
          !scrolled ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-4 border border-gray-100" : "py-2"
        }`}>
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
            <div className="hidden md:flex items-center gap-2 font-bold text-gray-600">
              <Link
                href="/"
                className="relative group py-2.5 px-4 rounded-xl hover:bg-teal-50 hover:text-[#00B8AE] transition-all duration-300 flex items-center gap-2"
              >
                <span>🏠</span> Home
              </Link>
              <Link
                href="/products"
                className="relative group py-2.5 px-4 rounded-xl hover:bg-teal-50 hover:text-[#00B8AE] transition-all duration-300 flex items-center gap-2"
              >
                <span>🛍️</span> Shop
              </Link>
              <Link
                href="/community"
                className="relative group py-2.5 px-4 rounded-xl hover:bg-teal-50 hover:text-[#00B8AE] transition-all duration-300 flex items-center gap-2"
              >
                <span>👥</span> Community
              </Link>
            </div>
          </div>

          {/* Search & Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden lg:block group">
              <input
                type="text"
                placeholder="Search premium gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-[280px] px-5 py-2.5 bg-gray-50 border-2 border-transparent group-hover:border-gray-200 rounded-2xl focus:outline-none focus:border-[#00B8AE] focus:bg-white transition-all duration-300 text-sm font-bold text-gray-700 placeholder-gray-400 shadow-inner"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#00B8AE] transition-colors duration-300 pointer-events-none">
                🔍
              </span>
            </div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-[#00B8AE] hover:text-white transition-all duration-300 text-sm shadow-sm flex items-center gap-2"
                >
                  <span>📊</span> <span className="hidden xl:inline">Dashboard</span>
                </button>
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-[#00B8AE] hover:text-white transition-all duration-300 text-sm shadow-sm flex items-center gap-2"
                >
                  <span>👤</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-500 hover:text-white transition-all duration-300 text-sm shadow-sm flex items-center gap-2"
                >
                  <span>🚪</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/Login"
                  className="px-6 py-2.5 rounded-xl bg-white border-2 border-gray-100 text-gray-700 font-bold hover:border-[#00B8AE] hover:text-[#00B8AE] transition-all duration-300 text-sm shadow-sm"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-bold shadow-[0_0_15px_rgba(0,184,174,0.3)] hover:shadow-[0_0_25px_rgba(0,184,174,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 text-sm"
                >
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-[#00B8AE]/10 transition-all duration-300 font-bold text-lg"
            >
              🛒
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm animate-fade-in-up">
                  {cartItemCount}
                </span>
              )}
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
          <div className="md:hidden mt-4 pb-6 px-6 relative animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-3 rounded-2xl hover:bg-teal-50 text-gray-700 hover:text-[#00B8AE] transition-all duration-300 font-black text-lg flex items-center gap-3"
              >
                <span>🏠</span> Home
              </Link>
              <Link
                href="/products"
                className="px-4 py-3 rounded-2xl hover:bg-teal-50 text-gray-700 hover:text-[#00B8AE] transition-all duration-300 font-black text-lg flex items-center gap-3"
              >
                <span>🛍️</span> Shop
              </Link>
              <Link
                href="/community"
                className="px-4 py-3 rounded-2xl hover:bg-teal-50 text-gray-700 hover:text-[#00B8AE] transition-all duration-300 font-black text-lg flex items-center gap-3"
              >
                <span>👥</span> Community
              </Link>

              <div className="pt-4 mt-2 border-t-2 border-gray-100 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="w-full px-6 py-4 rounded-xl bg-gray-50 text-gray-900 font-black hover:bg-[#00B8AE] hover:text-white transition-all duration-300 text-center text-lg"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-6 py-4 rounded-xl bg-rose-50 border-2 border-transparent text-rose-600 font-black hover:border-rose-200 transition-all duration-300 text-center text-lg"
                    >
                      Logout Session
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/Login"
                      className="block w-full px-6 py-4 rounded-xl bg-gray-50 text-gray-900 font-black hover:bg-gray-100 transition-all duration-300 text-center text-lg"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block w-full px-6 py-4 rounded-xl bg-[#00B8AE] text-white font-black shadow-lg shadow-teal-500/30 transition-all duration-300 text-center text-lg"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
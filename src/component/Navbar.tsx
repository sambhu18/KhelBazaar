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
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: "Logged out successfully!", type: "success" } }));
    }
    router.push("/");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-0.5"
        : "bg-transparent py-1"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className={`transition-all duration-300 flex items-center justify-between rounded-xl px-4 ${
          !scrolled ? "bg-white shadow-md py-1.5 border border-gray-100" : "py-1"
        }`}>
          {/* Logo & Main Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 tracking-tighter uppercase">
                KHEL BAZAAR
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 font-bold text-gray-600">
              <Link
                href="/"
                className="relative group py-1.5 px-3 rounded-lg hover:bg-teal-50 hover:text-[#00B8AE] transition-all duration-300 text-xs"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="relative group py-1.5 px-3 rounded-lg hover:bg-teal-50 hover:text-[#00B8AE] transition-all duration-300 text-xs"
              >
                Shop
              </Link>
              <Link
                href="/community"
                className="relative group py-1.5 px-3 rounded-lg hover:bg-teal-50 hover:text-[#00B8AE] transition-all duration-300 text-xs"
              >
                Community
              </Link>
            </div>
          </div>

          {/* Search & Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden lg:block group">
              <input
                type="text"
                placeholder="Search premium gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-[200px] px-4 py-1.5 bg-gray-50 border-2 border-transparent group-hover:border-gray-200 rounded-xl focus:outline-none focus:border-[#00B8AE] focus:bg-white transition-all duration-300 text-xs font-bold text-gray-700 placeholder-gray-400 shadow-inner"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#00B8AE] transition-colors duration-300 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
            </div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-700 font-bold hover:bg-teal-50 hover:text-[#00B8AE] transition-all duration-300 text-[10px] shadow-sm uppercase"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 font-bold hover:bg-rose-500 hover:text-white transition-all duration-300 text-[10px] shadow-sm uppercase ml-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/Login"
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-100 text-gray-700 font-bold hover:border-[#00B8AE] hover:text-[#00B8AE] transition-all duration-300 text-[10px] shadow-sm uppercase"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 rounded-lg bg-[#00B8AE] text-white font-bold hover:bg-teal-600 transition-all duration-300 text-[10px] uppercase"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-1.5 rounded-full hover:bg-[#00B8AE]/10 text-gray-700 transition-all duration-300 font-bold flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>

              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm animate-fade-in-up">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-300"
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
                Home
              </Link>
              <Link
                href="/products"
                className="px-4 py-3 rounded-2xl hover:bg-teal-50 text-gray-700 hover:text-[#00B8AE] transition-all duration-300 font-black text-lg flex items-center gap-3"
              >
                Shop
              </Link>
              <Link
                href="/community"
                className="px-4 py-3 rounded-2xl hover:bg-teal-50 text-gray-700 hover:text-[#00B8AE] transition-all duration-300 font-black text-lg flex items-center gap-3"
              >
                Community
              </Link>

              <div className="pt-4 mt-2 border-t-2 border-gray-100 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
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
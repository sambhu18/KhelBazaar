"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    setIsAuthenticated(true);
    setLoading(false);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: "Logged out successfully!", type: "success" } }));
    }
    router.replace("/admin/login");
  };

  // Show loading state while checking auth (but not for login page)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Loading admin panel...
        </div>
      </div>
    );
  }

  // If on login page, render it without the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Only show to authenticated admins
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-lg relative">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Dashboard</p>
        </div>

        <nav className="mt-8 flex flex-col gap-2 px-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all font-medium">📊 Dashboard</Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all font-medium">📦 Products</Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all font-medium">🛒 Orders</Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all font-medium">👥 Users</Link>
          <Link href="/admin/clubs" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all font-medium">🏆 Clubs</Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

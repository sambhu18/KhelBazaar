"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("AdminLayout mounted - checking auth");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      router.replace("/admin/login"); // ✅ replace avoids back loop
      return;
    }
    
    setLoading(false); // ✅ IMPORTANT
    setLoading(false); // ✅ IMPORTANT
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.replace("/admin/login");
  };

  // ✅ Loading state
  {
    loading && (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Loading admin panel...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-lg relative">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Dashboard</p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <Link href="/admin" className="nav-link">📊 Dashboard</Link>
          <Link href="/admin/products" className="nav-link">📦 Products</Link>
          <Link href="/admin/orders" className="nav-link">🛒 Orders</Link>
          <Link href="/admin/users" className="nav-link">👥 Users</Link>
          <Link href="/admin/clubs" className="nav-link">🏆 Clubs</Link>
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
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
}

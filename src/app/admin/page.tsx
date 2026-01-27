"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/src/Services/axiosinstance";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axiosInstance.get("/api/products").catch(() => ({ data: [] })),
        axiosInstance.get("/api/orders").catch(() => ({ data: [] })),
        axiosInstance.get("/api/users").catch(() => ({ data: [] })),
      ]);

      setStats({
        products: productsRes.data.length || 0,
        orders: ordersRes.data.length || 0,
        users: usersRes.data.length || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of store performance and analytics</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Products" value={stats.products} icon="📦" color="border-blue-500" />
            <StatCard title="Total Orders" value={stats.orders} icon="🛒" color="border-green-500" />
            <StatCard title="Total Users" value={stats.users} icon="👥" color="border-purple-500" />
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Popular Sports Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Most Popular Categories</h3>
              <div className="space-y-4">
                {[
                  { name: "Football", value: 45, color: "bg-blue-500" },
                  { name: "Cricket", value: 30, color: "bg-green-500" },
                  { name: "Basketball", value: 15, color: "bg-orange-500" },
                  { name: "Badminton", value: 10, color: "bg-yellow-500" },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="text-gray-500">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Demand Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Seasonal Demand (Winter vs Summer)</h3>
              <div className="flex items-end justify-between h-48 space-x-2">
                {[60, 45, 30, 70, 85, 90, 65, 50, 40, 55, 75, 80].map((h, i) => (
                  <div key={i} className="w-full flex flex-col justify-end group relative">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${i < 3 || i > 8 ? 'bg-blue-400' : 'bg-orange-400'}`}
                      style={{ height: `${h}%` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Jan</span><span>Jun</span><span>Dec</span>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded"></div> Winter</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded"></div> Summer</div>
              </div>
            </div>

            {/* Abandoned Cart Reasons */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Abandoned Cart Reasons</h3>
              <div className="flex items-center justify-center py-4">
                <div className="space-y-3 w-full max-w-md">
                  {[
                    { reason: "High Shipping Costs", count: 42, color: "bg-red-100 text-red-700 border-red-200" },
                    { reason: "Found Better Price", count: 28, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                    { reason: "Just Browsing", count: 18, color: "bg-gray-100 text-gray-700 border-gray-200" },
                    { reason: "Payment Issues", count: 12, color: "bg-orange-100 text-orange-700 border-orange-200" },
                  ].map((item) => (
                    <div key={item.reason} className={`flex items-center justify-between p-3 rounded-lg border ${item.color}`}>
                      <span className="font-medium">{item.reason}</span>
                      <span className="font-bold">{item.count}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Conversion Rate per Sport</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { sport: "Football", rate: "4.2%", trend: "+0.5%", up: true },
                  { sport: "Cricket", rate: "3.8%", trend: "-0.2%", up: false },
                  { sport: "Tennis", rate: "2.1%", trend: "+1.2%", up: true },
                  { sport: "Gym", rate: "5.5%", trend: "+2.0%", up: true },
                ].map((item) => (
                  <div key={item.sport} className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-500 text-sm mb-1">{item.sport}</p>
                    <p className="text-2xl font-bold text-gray-800">{item.rate}</p>
                    <p className={`text-xs font-medium ${item.up ? 'text-green-600' : 'text-red-500'}`}>
                      {item.up ? '↑' : '↓'} {item.trend}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="pt-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <a
                href="/admin/products"
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-8 shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-2">📦</div>
                <h3 className="text-xl font-bold mb-2">Manage Products</h3>
                <p className="text-blue-100">Add, edit, or delete products</p>
              </a>

              <a
                href="/admin/orders"
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-8 shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-2">🛒</div>
                <h3 className="text-xl font-bold mb-2">View Orders</h3>
                <p className="text-green-100">Check and manage customer orders</p>
              </a>

              <a
                href="/admin/users"
                className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-8 shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-2">👥</div>
                <h3 className="text-xl font-bold mb-2">Manage Users</h3>
                <p className="text-purple-100">View and manage user accounts</p>
              </a>

              <a
                href="/admin/clubs"
                className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl p-8 shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="text-xl font-bold mb-2">Manage Clubs</h3>
                <p className="text-red-100">Oversee club information</p>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

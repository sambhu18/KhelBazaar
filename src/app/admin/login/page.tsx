"use client";

import { useEffect, useState } from "react";
import { login } from "@/src/Services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setErr("");
    setSuccess("");

    if (!form.email || !form.password) {
      setErr("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await login(form);

      console.log("LOGIN RESPONSE:", res.data); // 🔥 DEBUG — DO NOT REMOVE

      const role = res.data.role || res.data.user?.role;

      if (role !== "admin") {
        setErr("Access denied. Admin credentials required.");
        return;
      }

      const token = res.data.token || res.data.accessToken;

      if (!token) {
        setErr("Invalid server response. Token missing.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      setSuccess("Admin login successful! Redirecting...");

      setTimeout(() => {
        router.push("/admin");
      }, 1000);

    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      setErr(
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
      console.log("Perfect jatha");
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-purple-200 text-sm">
              Access the admin dashboard
            </p>
          </div>

          {err && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-sm font-medium">{err}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-200 text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-purple-300/50 focus:outline-none transition-all ${
                  focusedField === "email"
                    ? "border-purple-400 shadow-lg shadow-purple-500/50"
                    : "border-white/20"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-purple-300/50 focus:outline-none transition-all ${
                    focusedField === "password"
                      ? "border-purple-400 shadow-lg shadow-purple-500/50"
                      : "border-white/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-purple-300 hover:text-purple-100"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? "Logging in..." : "Admin Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-purple-200">
            Not an admin?{" "}
            <Link
              href="/auth/Login"
              className="text-purple-300 hover:text-purple-100 font-semibold"
            >
              User Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

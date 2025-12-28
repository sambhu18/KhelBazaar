"use client";

import { useState } from "react";
import {register} from "@/src/Services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    // Validation
    if (!form.name || !form.email || !form.password) {
      setErr("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters long");
      return;
    }

    if (!agreeTerms) {
      setErr("Please agree to the Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      await register(form);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/auth/Login"), 1500);
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const getRoleInfo = (role: string) => {
    const roleMap: any = {
      customer: { emoji: "👤", desc: "Browse & purchase sports gear" },
      club: { emoji: "🏆", desc: "Sell sports equipment & merchandise" },
      player: { emoji: "⚽", desc: "Manage team & player profiles" },
      admin: { emoji: "👨‍💼", desc: "Manage platform" },
    };
    return roleMap[role] || roleMap.customer;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-linear-to-r from-indigo-600 to-blue-600 p-3 rounded-full mb-4">
            <span className="text-2xl">⚽</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Khel Bazaar</h1>
          <p className="text-gray-600">Create your account and start your journey</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-indigo-100">Join thousands of sports enthusiasts</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Error Message */}
            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 animate-pulse">
                <span className="text-xl">⚠️</span>
                <p>{err}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <span className="text-xl">✅</span>
                <p>{success}</p>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition font-medium"
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition font-medium"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">We'll never share your email</p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition font-medium"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-3">
                🎯 Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "customer", label: "Customer", emoji: "👤", desc: "Buy gear" },
                  { value: "club", label: "Club Vendor", emoji: "🏆", desc: "Sell gear" },
                  { value: "player", label: "Player", emoji: "⚽", desc: "Manage profile" },
                  { value: "admin", label: "Admin", emoji: "👨‍💼", desc: "Manage platform" },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    disabled={loading}
                    className={`p-3 rounded-lg border-2 transition font-medium text-center ${
                      form.role === role.value
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-lg mb-1">{role.emoji}</div>
                    <div className="text-xs">{role.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer mt-1"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Creating Account...
                </>
              ) : (
                <>
                  🚀 Create My Account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">Already a member?</span>
              </div>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Have an account?{" "}
              <Link 
                href="/auth/Login" 
                className="font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-2">✨</div>
            <p className="text-xs text-gray-600 font-medium">Premium Selection</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🚀</div>
            <p className="text-xs text-gray-600 font-medium">Quick Setup</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🎁</div>
            <p className="text-xs text-gray-600 font-medium">Welcome Bonus</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {login, googleSignIn} from "@/src/Services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (!form.email || !form.password) {
      setErr("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await login(form);
      setSuccess("Login successful! Redirecting...");
      localStorage.setItem("token", res.data.token);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (credentialResponse: any) => {
    try {
      setErr("");
      setSuccess("");
      setLoading(true);
      const res = await googleSignIn({ idToken: credentialResponse.credential });
      setSuccess("Google login successful! Redirecting...");
      localStorage.setItem("token", res.data.token);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "Google login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Left Side - Branding */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-linear-to-r from-blue-600 to-indigo-600 p-3 rounded-full mb-4">
            <span className="text-2xl">⚽</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Khel Bazaar</h1>
          <p className="text-gray-600">Welcome back to your sports marketplace</p>
        </div>

        {/* Login Form */}
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Login to your account</h2>
            <p className="text-blue-100">Access your dashboard and manage your orders</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Error Message */}
            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition font-medium"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  🔐 Password
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition font-medium"
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Logging in...
                </>
              ) : (
                <>
                  🚀 Login to Dashboard
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={() => setErr("Google login failed")}
              />
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link 
                href="/auth/register" 
                className="font-bold text-blue-600 hover:text-blue-700 transition"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-xs text-gray-600 font-medium">Secure Login</p>
          </div>
          <div>
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-xs text-gray-600 font-medium">Instant Access</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🛡️</div>
            <p className="text-xs text-gray-600 font-medium">Your Data Safe</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";
// import { useState } from "react";

// export default function Login() {
//   return (
//     <div className="w-full h-screen bg-white flex items-center justify-center">
//       <div className="w-[350px] h-[500px] gap-10 bg-white border border-amber-200 rounded-md flex flex-col items-center px-2.5 py-[15px]">
//         <p>Login Page</p>
//         <div className="w-full flex gap-5 flex-col items-center">
//           <div className="w-full gap-5 flex flex-col">
//           <label>Email</label>
//           <input className="w-full h-10 rounded-md border border-amber-100" />
//           </div>
//           <div className="w-full gap-5 flex flex-col">
//           <label>Password</label>
//           <input className="w-full h-10 rounded-md border border-amber-100"/>
//           </div>
//           <button className="border border-amber-200 h-10 rounded-md w-30">Login</button>
//         </div>
//       </div>
//     </div>
//   );
// }

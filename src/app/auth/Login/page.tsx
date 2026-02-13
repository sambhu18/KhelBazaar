"use client";

import { useState } from "react";
import { login, googleSignIn } from "@/src/Services/api";
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">


      {/* Login Section */}
      <div className="grid md:grid-cols-2 min-h-[calc(100vh-300px)]">
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:flex-col md:justify-center md:items-center md:bg-linear-to-br md:from-[#00B8AE] md:to-teal-600 md:p-12 md:text-white">
          <div className="text-center">
            <div className="text-7xl mb-6">⚽</div>
            <h1 className="text-5xl font-bold mb-4">Khel Bazaar</h1>
            <p className="text-xl text-teal-100 mb-12 leading-relaxed">
              Welcome to your ultimate sports marketplace. Join thousands of athletes and sports enthusiasts.
            </p>

            {/* Features */}
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🏃</span>
                <div>
                  <h3 className="font-bold text-lg">Premium Sports Gear</h3>
                  <p className="text-teal-100 text-sm">Quality equipment from trusted brands</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">👥</span>
                <div>
                  <h3 className="font-bold text-lg">Active Community</h3>
                  <p className="text-teal-100 text-sm">Connect with fellow sports enthusiasts</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">⭐</span>
                <div>
                  <h3 className="font-bold text-lg">Exclusive Rewards</h3>
                  <p className="text-teal-100 text-sm">Earn loyalty points on every purchase</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8">
              <div className="inline-block bg-linear-to-r from-[#00B8AE] to-teal-500 p-3 rounded-full mb-4">
                <span className="text-3xl">⚽</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Khel Bazaar</h1>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-linear-to-r from-[#00B8AE] to-teal-500 p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-teal-100">Login to your account</p>
              </div>

              <form onSubmit={submit} className="p-8 space-y-6">
                {/* Error Message */}
                {err && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <p className="font-medium">{err}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded flex items-start gap-3">
                    <span className="text-xl">✅</span>
                    <p className="font-medium">{success}</p>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    📧 Email Address
                  </label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-300 font-medium bg-gray-50 border-2 ${focusedField === 'email'
                        ? 'border-[#00B8AE] shadow-lg shadow-[#00B8AE]/20'
                        : 'border-gray-300 hover:border-[#00B8AE]/50'
                        } focus:outline-none`}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                      Password
                    </label>
                    <Link href="/auth/forgot-password" className="text-xs text-[#00B8AE] hover:text-teal-600 font-bold hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-300 font-medium bg-gray-50 border-2 ${focusedField === 'password'
                        ? 'border-[#00B8AE] shadow-lg shadow-[#00B8AE]/20'
                        : 'border-gray-300 hover:border-[#00B8AE]/50'
                        } focus:outline-none`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00B8AE] text-lg transition-colors"
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
                    className="w-4 h-4 text-[#00B8AE] rounded cursor-pointer accent-[#00B8AE]"
                    disabled={loading}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer hover:text-[#00B8AE] transition">
                    ✓ Keep me logged in for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-xl hover:shadow-[#00B8AE]/30 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <> Login</>
                  )}
                </button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500 font-bold">OR</span>
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
                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-bold text-[#00B8AE] hover:text-teal-600 transition"
                  >
                    Create one now
                  </Link>
                </p>
              </form>
            </div>

            {/* Security Info */}
            <div className="mt-6 text-center text-xs text-gray-600 space-y-1">
              <p> Your data is secure and encrypted</p>
              <p>✓ We never share your information</p>
            </div>
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

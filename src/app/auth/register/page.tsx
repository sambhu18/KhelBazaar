"use client";

import { useState } from "react";
import { register, googleSignIn } from "@/src/Services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const levels = [
      { level: 0, label: '', color: 'bg-red-500' },
      { level: 1, label: 'Weak', color: 'bg-red-500' },
      { level: 2, label: 'Fair', color: 'bg-orange-500' },
      { level: 3, label: 'Good', color: 'bg-yellow-500' },
      { level: 4, label: 'Strong', color: 'bg-[#00B8AE]' },
      { level: 5, label: 'Very Strong', color: 'bg-green-500' },
    ];
    return levels[Math.min(strength, 5)];
  };

  const passwordStrength = getPasswordStrength(form.password);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

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

  const handleGoogleSignIn = async (credentialResponse: any) => {
    try {
      setErr("");
      setSuccess("");
      setLoading(true);
      const res = await googleSignIn({ idToken: credentialResponse.credential });
      setSuccess("Google signup successful! Redirecting...");
      localStorage.setItem("token", res.data.token);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "Google login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}


      {/* Registration Section */}
      <div className="grid md:grid-cols-2 min-h-[calc(100vh-300px)]">
        {/* Left Side - Benefits */}
        <div className="hidden md:flex md:flex-col md:justify-col md:items-center md:bg-linear-to-br md:from-[#00B8AE] md:to-teal-600 md:p-12 md:text-white">
          <div className="text-center">
            <div className="text-7xl mb-6">🏆</div>
            <h1 className="text-5xl font-bold mb-4">Join Khel Bazaar</h1>
            <p className="text-xl text-teal-100 mb-12 leading-relaxed">
              Become part of Nepal's largest sports marketplace community
            </p>

            {/* Benefits */}
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <span className="text-3xl">✨</span>
                <div>
                  <h3 className="font-bold text-lg">Exclusive Deals</h3>
                  <p className="text-teal-100 text-sm">Early access to new products</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎁</span>
                <div>
                  <h3 className="font-bold text-lg">Welcome Bonus</h3>
                  <p className="text-teal-100 text-sm">Get 10% off on your first order</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">👥</span>
                <div>
                  <h3 className="font-bold text-lg">Community Access</h3>
                  <p className="text-teal-100 text-sm">Connect with sports enthusiasts</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">⭐</span>
                <div>
                  <h3 className="font-bold text-lg">Loyalty Rewards</h3>
                  <p className="text-teal-100 text-sm">Earn points on every purchase</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8">
              <div className="inline-block bg-linear-to-r from-[#00B8AE] to-teal-500 p-3 rounded-full mb-4">
                <span className="text-3xl">⚽</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Join Us</h1>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-linear-to-r from-[#00B8AE] to-teal-500 p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-teal-100">Join thousands of sports enthusiasts</p>
              </div>

              <form onSubmit={submit} className="p-8 space-y-5">
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

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">👤 Full Name *</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-105' : ''}`}>
                    <input
                      type="text"
                      placeholder="Sambhu Kamti"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-300 font-medium bg-gray-50 border-2 ${focusedField === 'name'
                        ? 'border-[#00B8AE] shadow-lg shadow-[#00B8AE]/20'
                        : 'border-gray-300 hover:border-[#00B8AE]/50'
                        } focus:outline-none`}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📧 Email Address *</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                    <input
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
                  <p className="text-xs text-gray-500 mt-1">✓ We'll never share your email</p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🔐 Password *</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                    <input
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

                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.level / 5) * 100}%` }}
                          ></div>
                        </div>
                        {passwordStrength.label && (
                          <span className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                            {passwordStrength.label}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-semibold">Password tips:</p>
                        <ul className="grid grid-cols-2 gap-1">
                          <li className={form.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>✓ 8+ characters</li>
                          <li className={/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}>✓ Uppercase</li>
                          <li className={/[0-9]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}>✓ Number</li>
                          <li className={/[^A-Za-z0-9]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}>✓ Special char</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Select Your Role *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "customer", label: "Customer", emoji: "👤" },
                      { value: "club", label: "Club Vendor", emoji: "🏆" },
                      { value: "player", label: "Player", emoji: "⚽" },
                    ].map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setForm({ ...form, role: role.value })}
                        disabled={loading}
                        className={`p-3 rounded-lg border-2 transition font-bold text-center ${form.role === role.value
                          ? 'border-[#00B8AE] bg-[#00B8AE]/10 text-[#00B8AE]'
                          : 'border-gray-300 hover:border-[#00B8AE] text-gray-700'
                          }`}
                      >
                        <div className="text-2xl mb-1">{role.emoji}</div>
                        <div className="text-xs">{role.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 text-[#00B8AE] rounded cursor-pointer mt-1"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{" "}
                    <a href="#" className="text-[#00B8AE] font-bold hover:text-teal-600">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#00B8AE] font-bold hover:text-teal-600">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !agreeTerms}
                  className="w-full bg-linear-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-xl hover:shadow-[#00B8AE]/30 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-6"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>Create Account</>
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

                {/* Google Signup */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSignIn}
                    onError={() => setErr("Google signup failed")}
                  />
                </div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500 font-bold">ALREADY A MEMBER?</span>
                  </div>
                </div>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm">
                  Have an account?{" "}
                  <Link
                    href="/auth/Login"
                    className="font-bold text-[#1E40AF] hover:text-teal-600 transition"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>

            {/* Security */}
            <div className="mt-6 text-center text-xs text-gray-600 space-y-1">
              <p>Your data is secure and encrypted</p>
              <p>✓ 30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

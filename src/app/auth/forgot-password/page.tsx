"use client";

import { useState } from "react";
import { forgotPassword } from "@/src/Services/api";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setSuccess("");

        if (!email) {
            setErr("Please enter your email address");
            return;
        }

        try {
            setLoading(true);
            await forgotPassword({ email });
            setSuccess("Password reset link has been sent to your email.");
            setLoading(false);
        } catch (e: any) {
            setErr(e?.response?.data?.msg || "Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-linear-to-r from-[#00B8AE] to-teal-500 p-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
                        <p className="text-teal-100">Enter your email to reset your password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {err && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                                <p className="font-medium">{err}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
                                <p className="font-medium">{success}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#00B8AE] focus:outline-none transition"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div className="text-center">
                            <Link href="/auth/Login" className="text-[#00B8AE] font-bold hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

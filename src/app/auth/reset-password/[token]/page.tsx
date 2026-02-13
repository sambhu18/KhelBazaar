"use client";

import { useState } from "react";
import { resetPassword } from "@/src/Services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setErr("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setErr("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setErr("Password must be at least 6 characters long");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(token as string, { password } as any);
            setSuccess("Password reset successful! Redirecting to login...");
            setTimeout(() => router.push("/auth/Login"), 2000);
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
                        <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                        <p className="text-teal-100">Enter your new password below</p>
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#00B8AE] focus:outline-none transition"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#00B8AE] focus:outline-none transition"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

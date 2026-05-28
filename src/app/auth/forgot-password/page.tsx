"use client";

import { useState } from "react";
import { forgotPassword, verifyOTP, resetPassword } from "@/src/Services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "otp" | "password">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // Handle email submission
    const handleEmailSubmit = async (e: React.FormEvent) => {
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
            setSuccess("OTP has been sent to your email");
            setStep("otp");
            setTimer(300); // 5 minutes
            
            // Countdown timer
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
            setLoading(false);
        } catch (e: any) {
            setErr(e?.response?.data?.msg || "Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    // Handle OTP verification
    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setSuccess("");

        if (!otp || otp.length !== 6) {
            setErr("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            await verifyOTP({ email, otp });
            setSuccess("OTP verified! Now set your new password.");
            setStep("password");
            setLoading(false);
        } catch (e: any) {
            setErr(e?.response?.data?.msg || "Invalid OTP. Please try again.");
            setLoading(false);
        }
    };

    // Handle password reset
    const handlePasswordSubmit = async (e: React.FormEvent) => {
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
            await resetPassword({ email, password, otp });
            setSuccess("Password reset successful! Redirecting to login...");
            setTimeout(() => router.push("/auth/Login"), 2000);
        } catch (e: any) {
            setErr(e?.response?.data?.msg || "Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-[#00B8AE] to-teal-500 p-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                        <p className="text-teal-100">
                            {step === "email" && "Enter your email to receive an OTP"}
                            {step === "otp" && "Enter the OTP sent to your email"}
                            {step === "password" && "Set your new password"}
                        </p>
                    </div>

                    <form onSubmit={step === "email" ? handleEmailSubmit : step === "otp" ? handleOTPSubmit : handlePasswordSubmit} className="p-8 space-y-6">
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

                        {/* Email Step */}
                        {step === "email" && (
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
                        )}

                        {/* OTP Step */}
                        {step === "otp" && (
                            <>
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        maxLength={6}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#00B8AE] focus:outline-none transition text-center text-2xl tracking-widest font-bold"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="text-center text-sm text-gray-600">
                                    {timer > 0 ? (
                                        <p>OTP expires in <span className="font-bold text-[#00B8AE]">{formatTime(timer)}</span></p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleEmailSubmit}
                                            className="text-[#00B8AE] font-bold hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Password Step */}
                        {step === "password" && (
                            <>
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
                                        Confirm Password
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
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (step === "otp" && timer === 0)}
                            className="w-full bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Processing..." : step === "email" ? "Send OTP" : step === "otp" ? "Verify OTP" : "Reset Password"}
                        </button>

                        {step !== "email" && (
                            <button
                                type="button"
                                onClick={() => {
                                    setStep("email");
                                    setOtp("");
                                    setPassword("");
                                    setConfirmPassword("");
                                    setErr("");
                                    setSuccess("");
                                }}
                                className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
                            >
                                Back
                            </button>
                        )}

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

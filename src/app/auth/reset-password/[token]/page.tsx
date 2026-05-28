"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-[#00B8AE] to-teal-500 p-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Password Reset</h2>
                        <p className="text-teal-100">Use OTP-based password reset</p>
                    </div>

                    <div className="p-8 space-y-6 text-center">
                        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded">
                            <p className="font-medium">This page has been updated to use a more secure OTP-based password reset process.</p>
                        </div>

                        <p className="text-gray-600 text-lg">
                            For password reset, please visit the forgot password page and follow the OTP verification process.
                        </p>

                        <Link
                            href="/auth/forgot-password"
                            className="inline-block w-full bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all"
                        >
                            Go to Password Reset
                        </Link>

                        <Link
                            href="/auth/Login"
                            className="inline-block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

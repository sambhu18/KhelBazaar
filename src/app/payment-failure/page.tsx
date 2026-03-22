"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentFailureContent() {
  const params = useSearchParams();
  const errorMessage = params.get("message") || "The payment process was cancelled or failed.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-xl border border-red-100">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mb-6">
          <span className="text-4xl">❌</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Payment Failed</h1>
        <p className="text-gray-600 mb-8">{errorMessage}</p>
        
        <div className="bg-rose-50 rounded-xl px-4 py-3 mb-8 text-left border border-rose-100">
          <p className="text-sm font-medium text-rose-800">
            No money was deducted from your account. You can safely try placing your order again.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/checkout"
            className="flex-1 bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PaymentFailureContent />
    </Suspense>
  );
}

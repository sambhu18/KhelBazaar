"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/src/Services/api";
import Link from "next/link";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const dataParam = params.get("data");

  useEffect(() => {
    if (!dataParam) {
      setStatus("error");
      setErrorMessage("No payment data received from eSewa.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        const res = await API.post("/api/esewa/verify", {
          encodedData: dataParam,
        });

        setOrderData(res.data.order);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.msg || "Failed to verify payment with the server."
        );
      }
    };

    verifyPayment();
  }, [dataParam]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#00B8AE] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-800">Verifying Payment...</h1>
        <p className="text-gray-500 mt-2">Please do not close this window.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-xl border border-red-100">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Verification Failed</h1>
          <p className="text-gray-600 mb-8">{errorMessage}</p>
          <div className="flex gap-4">
            <Link
              href="/checkout"
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition"
            >
              Try Again
            </Link>
            <Link
              href="/my-orders"
              className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Check */}
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[#6DC12B] to-green-400 shadow-2xl mb-8 animate-bounce">
          <span className="text-6xl text-white">✓</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Your eSewa payment has been verified and your order is confirmed.
        </p>

        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 text-left space-y-5 mb-8">
          {orderData?.orderNumber && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Order Number</span>
              <span className="font-bold text-gray-900 font-mono text-sm">{orderData.orderNumber}</span>
            </div>
          )}
          {orderData?.totalPrice && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Amount Paid</span>
              <span className="font-extrabold text-[#00B8AE] text-xl">
                NPR {orderData.totalPrice.toLocaleString()}
              </span>
            </div>
          )}
          {orderData?.transactionId && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Txn ID</span>
              <span className="font-bold text-gray-700 font-mono text-xs">{orderData.transactionId}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Payment Method</span>
            <span className="flex items-center gap-1 font-bold text-[#6DC12B]">
              💚 eSewa
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/my-orders"
            className="flex-1 bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition"
          >
            View Orders
          </Link>
          <Link
            href="/"
            className="flex-1 border-2 border-white bg-white/50 backdrop-blur-sm text-gray-700 font-bold py-4 rounded-xl hover:bg-white transition"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-xl text-gray-500">Loading payment details...</div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

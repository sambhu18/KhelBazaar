'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/src/Services/axiosinstance';
import Link from 'next/link';

export default function DonationFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const donationId = searchParams.get('donationId');
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        if (donationId) {
          const res = await axiosInstance.get(`/api/donations/${donationId}`);
          setDonation(res.data.donation);
        }
      } catch (err) {
        console.error('Error fetching donation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  const handleRetry = async () => {
    if (!donationId) return;

    try {
      // Initiate eSewa payment again
      const esewaRes = await axiosInstance.post(
        `/api/donations/${donationId}/esewa/initiate`
      );

      const { paymentUrl, params } = esewaRes.data;

      // Create and submit form to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentUrl;

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Error retrying payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-lg text-red-600 font-black mb-6">Unable to Process Donation</p>

        {donation && (
          <div className="bg-red-50 rounded-2xl p-6 mb-8 text-left space-y-3 border border-red-200">
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase">Amount</p>
              <p className="text-2xl font-black text-red-600">
                NPR {donation.amount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase">Status</p>
              <p className="font-bold text-gray-900 capitalize">{donation.paymentStatus}</p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 font-bold mb-8">
          Your payment was not processed. This could be due to:
        </p>

        <ul className="text-left bg-gray-50 rounded-xl p-4 mb-8 space-y-2 text-sm">
          <li className="flex gap-2">
            <span>•</span>
            <span className="text-gray-700">Insufficient balance in your eSewa account</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span className="text-gray-700">Incorrect PIN or authentication failed</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span className="text-gray-700">Connection timeout or network error</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span className="text-gray-700">eSewa service temporarily unavailable</span>
          </li>
        </ul>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all"
          >
            Retry Payment
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-gray-100 text-gray-900 font-black rounded-xl hover:bg-gray-200 transition-all"
          >
            Back to Home
          </button>
          <Link
            href="/products"
            className="w-full py-4 bg-teal-50 text-[#00B8AE] font-black rounded-xl hover:bg-teal-100 transition-all text-center border border-[#00B8AE]/20"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Need help?{' '}
          <a href="mailto:support@yoursite.com" className="text-[#00B8AE] font-black hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/src/Services/axiosinstance';
import Link from 'next/link';

export default function DonationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const donationId = searchParams.get('donationId');
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyDonation = async () => {
      try {
        if (!donationId) {
          setError('No donation ID provided');
          setLoading(false);
          return;
        }

        // Get donation status from URL params
        const refId = searchParams.get('refId');
        const encodedData = searchParams.get('data');

        if (encodedData) {
          // Verify the payment with backend
          try {
            const verifyRes = await axiosInstance.post(
              `/api/donations/${donationId}/esewa/verify`,
              {
                encodedData,
                refId,
              }
            );

            if (verifyRes.data?.donation) {
              setDonation(verifyRes.data.donation);
            }
          } catch (verifyErr: any) {
            console.error('Verification error:', verifyErr);
            // Still continue to show the donation details
          }
        }

        // Fetch donation details
        const res = await axiosInstance.get(`/api/donations/${donationId}`);
        setDonation(res.data.donation);
      } catch (err: any) {
        console.error('Error verifying donation:', err);
        setError(err.response?.data?.msg || 'Error verifying donation');
      } finally {
        setLoading(false);
      }
    };

    verifyDonation();
  }, [donationId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Verifying your donation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {error ? (
          <>
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Verification Pending</h1>
            <p className="text-gray-600 font-bold mb-2">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              Your donation has been received. We will verify and process it shortly.
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Thank You!</h1>
            <p className="text-lg text-[#00B8AE] font-black mb-6">
              Donation Successful ❤️
            </p>

            {donation && (
              <div className="bg-teal-50 rounded-2xl p-6 mb-8 text-left space-y-3 border border-[#00B8AE]/20">
                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase">Amount</p>
                  <p className="text-2xl font-black text-[#00B8AE]">
                    NPR {donation.amount?.toLocaleString()}
                  </p>
                </div>
                {!donation.isAnonymous && (
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase">Donor Name</p>
                    <p className="font-bold text-gray-900">{donation.donorName}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase">Campaign</p>
                  <p className="font-bold text-gray-900 capitalize">{donation.campaign}</p>
                </div>
                {donation.esewaRefId && (
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase">Reference ID</p>
                    <p className="font-mono text-xs text-gray-600 break-all">{donation.esewaRefId}</p>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-gray-600 font-bold mb-6">
              Your contribution will directly support professional equipment for youth athletes across Nepal. You've made a real difference! 🏆
            </p>
          </>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-[#00B8AE] text-white font-black rounded-xl hover:bg-teal-500 transition-all"
          >
            Back to Home
          </button>
          <Link
            href="/products"
            className="w-full py-4 bg-gray-100 text-gray-900 font-black rounded-xl hover:bg-gray-200 transition-all text-center"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          A confirmation receipt has been sent to your email if provided.
        </p>
      </div>
    </div>
  );
}

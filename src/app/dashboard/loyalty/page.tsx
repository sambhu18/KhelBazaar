"use client";

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/src/Services/axiosinstance';

interface LoyaltyData {
  userId: string;
  userName: string;
  email: string;
  totalPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  redeemablePoints: number;
  totalSpent: number;
  memberSince: string;
  nextTierPoints: number;
}

export default function Loyalty() {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/loyalty');
      setLoyaltyData(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching loyalty data:', err);
      setError('Failed to load loyalty data');
    } finally {
      setLoading(false);
    }
  };

  const tiers = ['all', 'bronze', 'silver', 'gold', 'platinum'];
  const filteredData = filterTier === 'all'
    ? loyaltyData
    : loyaltyData.filter(d => d.tier === filterTier);

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'bronze': return { bg: 'bg-amber-100', text: 'text-amber-800', badge: 'bg-amber-500' };
      case 'silver': return { bg: 'bg-gray-100', text: 'text-gray-800', badge: 'bg-gray-400' };
      case 'gold': return { bg: 'bg-yellow-100', text: 'text-yellow-800', badge: 'bg-yellow-500' };
      case 'platinum': return { bg: 'bg-linear-to-r from-[#00B8AE]/20 to-teal-500/20', text: 'text-[#00B8AE]', badge: 'bg-linear-to-r from-[#00B8AE] to-teal-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', badge: 'bg-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#00B8AE] via-teal-500 to-cyan-500 text-white relative overflow-hidden py-12 px-6 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">⭐ Loyalty Program</h1>
          <p className="text-teal-100 text-lg">Manage customer loyalty rewards and tiers</p>
        </div>
      </div>

      <div className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Total Members</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{loyaltyData.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Total Points Issued</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {loyaltyData.reduce((sum, d) => sum + d.totalPoints, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Avg. Customer Spend</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${(loyaltyData.reduce((sum, d) => sum + d.totalSpent, 0) / loyaltyData.length || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Platinum Members</p>
          <p className="text-3xl font-bold text-[#00B8AE] mt-2">
            {loyaltyData.filter(d => d.tier === 'platinum').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {tiers.map(tier => (
          <button
            key={tier}
            onClick={() => setFilterTier(tier)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterTier === tier
                ? 'bg-[#00B8AE] text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#00B8AE]'
            }`}
          >
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8AE]"></div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No members found</p>
        </div>
      ) : (
        /* Members Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map(member => {
            const colors = getTierColor(member.tier);
            const progressPercent = (member.totalPoints / (member.nextTierPoints || member.totalPoints + 1000)) * 100;
            
            return (
              <div
                key={member.userId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                {/* Tier Header */}
                <div className={`${colors.bg} ${colors.text} p-4 flex items-center justify-between`}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider">Member Tier</p>
                    <p className="text-2xl font-bold capitalize">{member.tier}</p>
                  </div>
                  <div className={`${colors.badge} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    ⭐
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-semibold text-gray-900">{member.userName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm text-gray-700">{member.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Points</p>
                      <p className="text-xl font-bold text-purple-600">{member.totalPoints.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Redeemable</p>
                      <p className="text-xl font-bold text-green-600">{member.redeemablePoints.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress to Next Tier */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-2">Progress to Next Tier</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors.badge} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {member.nextTierPoints - member.totalPoints} points to next tier
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total Spent</p>
                      <p className="font-semibold text-gray-900">${member.totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-900">{new Date(member.memberSince).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-4 pb-4">
                  <button className="w-full py-2 px-4 rounded-lg font-medium bg-[#00B8AE] text-white hover:bg-[#00a09f] transition">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

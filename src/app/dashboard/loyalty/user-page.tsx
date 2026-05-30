'use client';

import { useState, useEffect } from 'react';
import { getLoyaltyPoints } from '@/src/Services/api';

interface LoyaltyTransaction {
  type: 'earned' | 'redeemed';
  points: number;
  orderId?: {
    orderNumber: string;
    totalPrice: number;
  };
  description: string;
  createdAt: string;
}

interface LoyaltyData {
  totalPoints: number;
  currentTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  transactions: LoyaltyTransaction[];
  nextTierThreshold: number;
  redeemedCount: number;
  benefits: {
    discount: number;
    pointMultiplier: number;
  };
  pointsToNextTier: number;
}

export default function UserLoyaltyPage() {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const response = await getLoyaltyPoints();
      setLoyaltyData(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to fetch loyalty data');
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'silver': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'gold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'platinum': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '🏆';
    }
  };

  const getProgressPercentage = () => {
    if (!loyaltyData) return 0;
    const currentTierPoints = loyaltyData.totalPoints;
    const nextTierPoints = loyaltyData.nextTierThreshold;
    const previousTierPoints = nextTierPoints - 500; // Assuming 500 points per tier

    return ((currentTierPoints - previousTierPoints) / (nextTierPoints - previousTierPoints)) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !loyaltyData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">🏆</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Unable to load loyalty data</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchLoyaltyData}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loyalty Program</h1>
          <p className="text-gray-600 mt-2">
            Earn points with every purchase and unlock exclusive benefits
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Points */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loyaltyData.totalPoints.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Current Tier */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${getTierColor(loyaltyData.currentTier)}`}>
                  <span className="text-2xl">{getTierIcon(loyaltyData.currentTier)}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Tier</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {loyaltyData.currentTier}
                </p>
              </div>
            </div>
          </div>

          {/* Points to Next Tier */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">To Next Tier</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loyaltyData.pointsToNextTier > 0 ? loyaltyData.pointsToNextTier : 'Max Tier!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {loyaltyData.pointsToNextTier > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress to Next Tier</span>
              <span className="text-sm text-gray-500">
                {loyaltyData.totalPoints} / {loyaltyData.nextTierThreshold} points
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {loyaltyData.pointsToNextTier} more points to reach {loyaltyData.currentTier === 'bronze' ? 'Silver' : loyaltyData.currentTier === 'silver' ? 'Gold' : 'Platinum'} tier
            </p>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">💸</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Discount</p>
                <p className="text-sm text-gray-600">{loyaltyData.benefits.discount}% off on all orders</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">⚡</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Point Multiplier</p>
                <p className="text-sm text-gray-600">{loyaltyData.benefits.pointMultiplier}x points on purchases</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'transactions', 'tiers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">How to Earn Points</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <span className="text-2xl">🛒</span>
                      <div>
                        <p className="font-medium text-gray-900">Make Purchases</p>
                        <p className="text-sm text-gray-600">Earn 1 point for every NPR 10 spent</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="font-medium text-gray-900">Write Reviews</p>
                        <p className="text-sm text-gray-600">Get bonus points for product reviews</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
                  {loyaltyData.transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No transactions yet. Start shopping to earn points!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {loyaltyData.transactions.slice(0, 5).map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className={`text-2xl ${transaction.type === 'earned' ? '💰' : '🎁'}`}></span>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className={`font-bold ${transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.points} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h4>
                {loyaltyData.transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No transactions yet. Start shopping to earn points!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {loyaltyData.transactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className={`text-2xl ${transaction.type === 'earned' ? '💰' : '🎁'}`}></span>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            {transaction.orderId && (
                              <p className="text-sm text-gray-500">
                                Order: {transaction.orderId.orderNumber} (NPR {transaction.orderId.totalPrice})
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                              {new Date(transaction.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className={`font-bold text-lg ${transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'earned' ? '+' : '-'}{transaction.points} pts
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tiers' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-6">Loyalty Tiers</h4>
                <div className="space-y-4">
                  {[
                    { tier: 'bronze', name: 'Bronze', points: '0-499', discount: 0, multiplier: 1 },
                    { tier: 'silver', name: 'Silver', points: '500-999', discount: 5, multiplier: 1.2 },
                    { tier: 'gold', name: 'Gold', points: '1000-1999', discount: 10, multiplier: 1.5 },
                    { tier: 'platinum', name: 'Platinum', points: '2000+', discount: 15, multiplier: 2 }
                  ].map((tierInfo) => (
                    <div
                      key={tierInfo.tier}
                      className={`p-6 rounded-lg border-2 ${loyaltyData.currentTier === tierInfo.tier
                          ? getTierColor(tierInfo.tier) + ' ring-2 ring-offset-2 ring-blue-500'
                          : 'border-gray-200 bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{getTierIcon(tierInfo.tier)}</span>
                          <div>
                            <h5 className="text-lg font-bold text-gray-900">{tierInfo.name}</h5>
                            <p className="text-sm text-gray-600">{tierInfo.points} points</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex space-x-6">
                            <div>
                              <p className="text-sm text-gray-600">Discount</p>
                              <p className="font-bold text-gray-900">{tierInfo.discount}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Point Multiplier</p>
                              <p className="font-bold text-gray-900">{tierInfo.multiplier}x</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {loyaltyData.currentTier === tierInfo.tier && (
                        <div className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full inline-block">
                          Current Tier
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
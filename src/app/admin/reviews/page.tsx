'use client';

import { useState, useEffect } from 'react';
import { getAllReviews, moderateReview } from '@/src/Services/api';

interface Review {
  _id: string;
  productId: {
    _id: string;
    title: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  images: string[];
  verified: boolean;
  helpful: number;
  size?: string;
  color?: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationReason?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [ratingFilter, setRatingFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [currentPage, statusFilter, ratingFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getAllReviews(
        currentPage,
        statusFilter,
        ratingFilter ? parseInt(ratingFilter) : undefined
      );
      setReviews(response.data.reviews);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (reviewId: string, status: 'approved' | 'rejected' | 'flagged') => {
    try {
      setActionLoading(reviewId);
      await moderateReview(reviewId, status, moderationReason);
      setSelectedReview(null);
      setModerationReason('');
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to moderate review');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600 mt-2">
            Moderate customer reviews and maintain content quality
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {['pending', 'approved', 'rejected', 'flagged'].map((status) => {
            const count = reviews.filter(r => r.status === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(status)}`}>
                      <span className="text-2xl">
                        {status === 'pending' ? '⏳' :
                          status === 'approved' ? '✅' :
                            status === 'rejected' ? '❌' : '🚩'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">⭐</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">No reviews match the current filter</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {/* Review Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-gray-600">
                                ({review.rating}/5)
                              </span>
                            </div>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>

                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                          </span>
                        </div>

                        {/* Product and User Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                          <div>
                            <p><span className="font-medium">Product:</span> {review.productId.title}</p>
                            <p><span className="font-medium">Customer:</span> {review.userId.name}</p>
                            <p><span className="font-medium">Email:</span> {review.userId.email}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Date:</span> {new Date(review.createdAt).toLocaleDateString()}</p>
                            {review.size && <p><span className="font-medium">Size:</span> {review.size}</p>}
                            {review.color && <p><span className="font-medium">Color:</span> {review.color}</p>}
                            <p><span className="font-medium">Helpful votes:</span> {review.helpful}</p>
                          </div>
                        </div>

                        {/* Review Content */}
                        {review.title && (
                          <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                        )}

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {/* Pros and Cons */}
                        {(review.pros.length > 0 || review.cons.length > 0) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            {review.pros.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-green-600 mb-1">Pros:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                  {review.pros.map((pro, index) => (
                                    <li key={index}>{pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {review.cons.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-red-600 mb-1">Cons:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                  {review.cons.map((con, index) => (
                                    <li key={index}>{con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Review Images */}
                        {review.images.length > 0 && (
                          <div className="flex space-x-2 mb-4">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={`${process.env.NEXT_PUBLIC_BASEURL}/${image}`}
                                alt={`Review image ${index + 1}`}
                                className="w-16 h-16 object-cover rounded border"
                              />
                            ))}
                          </div>
                        )}

                        {/* Moderation Info */}
                        {review.moderationReason && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-sm text-yellow-800">
                              <span className="font-medium">Moderation reason:</span> {review.moderationReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {review.status === 'pending' && (
                      <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Review
                        </button>

                        <button
                          onClick={() => handleModeration(review._id, 'approved')}
                          disabled={actionLoading === review._id}
                          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === review._id ? 'Processing...' : 'Quick Approve'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Moderation Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Moderate Review
              </h3>
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setModerationReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Review Preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                {renderStars(selectedReview.rating)}
                <span className="ml-2 text-sm text-gray-600">by {selectedReview.userId.name}</span>
              </div>

              {selectedReview.title && (
                <h4 className="font-medium text-gray-900 mb-2">{selectedReview.title}</h4>
              )}

              <p className="text-gray-700 mb-2">{selectedReview.comment}</p>

              <p className="text-sm text-gray-600">
                Product: {selectedReview.productId.title}
              </p>
            </div>

            {/* Moderation Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional for approval, required for rejection/flagging)
              </label>
              <textarea
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Provide feedback about the moderation decision..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleModeration(selectedReview._id, 'approved')}
                disabled={actionLoading === selectedReview._id}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === selectedReview._id ? 'Processing...' : '✅ Approve'}
              </button>

              <button
                onClick={() => handleModeration(selectedReview._id, 'flagged')}
                disabled={actionLoading === selectedReview._id}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {actionLoading === selectedReview._id ? 'Processing...' : '🚩 Flag'}
              </button>

              <button
                onClick={() => handleModeration(selectedReview._id, 'rejected')}
                disabled={actionLoading === selectedReview._id || !moderationReason.trim()}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === selectedReview._id ? 'Processing...' : '❌ Reject'}
              </button>

              <button
                onClick={() => {
                  setSelectedReview(null);
                  setModerationReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
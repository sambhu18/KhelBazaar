'use client';

import { useState, useEffect } from 'react';
import { getUserRentals, cancelRental, returnRental } from '@/src/Services/api';

interface Rental {
  _id: string;
  rentalNumber: string;
  productId: {
    _id: string;
    title: string;
    images: string[];
    rentalPrice: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  deposit: number;
  lateFee: number;
  damageFee: number;
  status: 'pending' | 'confirmed' | 'active' | 'returned' | 'overdue' | 'cancelled';
  paymentStatus: 'pending' | 'deposit_paid' | 'fully_paid' | 'refunded';
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  conditionAtReturn?: {
    rating: number;
    notes: string;
    images: string[];
    damageAssessment: string;
  };
  createdAt: string;
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showReturnModal, setShowReturnModal] = useState<Rental | null>(null);
  const [returnData, setReturnData] = useState({
    conditionRating: 5,
    notes: '',
    damageAssessment: ''
  });
  const [returnImages, setReturnImages] = useState<File[]>([]);

  useEffect(() => {
    fetchRentals();
  }, [currentPage, statusFilter]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await getUserRentals(currentPage, statusFilter);
      setRentals(response.data.rentals);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to fetch rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRental = async (rentalId: string) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      setActionLoading(rentalId);
      await cancelRental(rentalId, reason);
      fetchRentals();
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to cancel rental');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReturnRental = async () => {
    if (!showReturnModal) return;

    try {
      setActionLoading(showReturnModal._id);

      const formData = new FormData();
      formData.append('conditionRating', returnData.conditionRating.toString());
      formData.append('notes', returnData.notes);
      formData.append('damageAssessment', returnData.damageAssessment);

      returnImages.forEach((image) => {
        formData.append('images', image);
      });

      await returnRental(showReturnModal._id, formData);
      setShowReturnModal(null);
      setReturnData({ conditionRating: 5, notes: '', damageAssessment: '' });
      setReturnImages([]);
      fetchRentals();
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to return rental');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'deposit_paid': return 'bg-blue-100 text-blue-800';
      case 'fully_paid': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (rental: Rental) => {
    return new Date() > new Date(rental.endDate) && rental.status === 'active';
  };

  const getDaysRemaining = (rental: Rental) => {
    const today = new Date();
    const endDate = new Date(rental.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
          <p className="text-gray-600 mt-2">
            Manage your equipment rentals and track their status
          </p>
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
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Rentals List */}
        {rentals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📅</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No rentals found</h3>
            <p className="text-gray-600 mb-6">You haven't rented any equipment yet</p>
            <a
              href="/products?rentable=true"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Rentable Equipment
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {rentals.map((rental) => (
                <div key={rental._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          {rental.productId.images && rental.productId.images.length > 0 ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_BASEURL}/${rental.productId.images[0]}`}
                              alt={rental.productId.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Rental Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {rental.productId.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Rental #{rental.rentalNumber}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>
                              📅 {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                            </span>
                            <span>
                              ⏱️ {rental.totalDays} days
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(rental.paymentStatus)}`}>
                          {rental.paymentStatus.replace('_', ' ').charAt(0).toUpperCase() + rental.paymentStatus.replace('_', ' ').slice(1)}
                        </span>
                        {isOverdue(rental) && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rental Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Daily Rate</p>
                        <p className="text-sm font-medium text-gray-900">NPR {rental.dailyRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Total Amount</p>
                        <p className="text-sm font-medium text-gray-900">NPR {rental.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Deposit</p>
                        <p className="text-sm font-medium text-gray-900">NPR {rental.deposit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">
                          {rental.status === 'active' ? 'Days Remaining' : 'Duration'}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {rental.status === 'active' ?
                            `${getDaysRemaining(rental)} days` :
                            `${rental.totalDays} days`
                          }
                        </p>
                      </div>
                    </div>

                    {/* Additional Fees */}
                    {(rental.lateFee > 0 || rental.damageFee > 0) && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-red-800 mb-2">Additional Charges</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {rental.lateFee > 0 && (
                            <div>
                              <span className="text-red-600">Late Fee: NPR {rental.lateFee}</span>
                            </div>
                          )}
                          {rental.damageFee > 0 && (
                            <div>
                              <span className="text-red-600">Damage Fee: NPR {rental.damageFee}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Delivery Address */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">
                        {rental.deliveryAddress.name}<br />
                        {rental.deliveryAddress.address}<br />
                        {rental.deliveryAddress.city}, {rental.deliveryAddress.zipCode}<br />
                        📞 {rental.deliveryAddress.phone}
                      </p>
                    </div>

                    {/* Return Condition */}
                    {rental.conditionAtReturn && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Return Condition</h4>
                        <div className="text-sm text-blue-800">
                          <p>Rating: {rental.conditionAtReturn.rating}/5 ⭐</p>
                          {rental.conditionAtReturn.notes && (
                            <p>Notes: {rental.conditionAtReturn.notes}</p>
                          )}
                          {rental.conditionAtReturn.damageAssessment && (
                            <p>Damage Assessment: {rental.conditionAtReturn.damageAssessment}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {rental.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRental(rental._id)}
                          disabled={actionLoading === rental._id}
                          className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {actionLoading === rental._id ? 'Cancelling...' : 'Cancel Rental'}
                        </button>
                      )}

                      {rental.status === 'active' && (
                        <button
                          onClick={() => setShowReturnModal(rental)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                        >
                          Return Item
                        </button>
                      )}

                      <a
                        href={`/products/${rental.productId._id}`}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        View Product
                      </a>
                    </div>
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

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                  ))}

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

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Return {showReturnModal.productId.title}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition Rating (1-5)
                </label>
                <select
                  value={returnData.conditionRating}
                  onChange={(e) => setReturnData({ ...returnData, conditionRating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Fair</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={returnData.notes}
                  onChange={(e) => setReturnData({ ...returnData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes about the item condition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Photos (optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setReturnImages(Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleReturnRental}
                disabled={actionLoading === showReturnModal._id}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === showReturnModal._id ? 'Processing...' : 'Confirm Return'}
              </button>
              <button
                onClick={() => {
                  setShowReturnModal(null);
                  setReturnData({ conditionRating: 5, notes: '', damageAssessment: '' });
                  setReturnImages([]);
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
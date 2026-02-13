'use client';

import { useState, useEffect } from 'react';
import { getProducts, moderateProduct } from '@/src/Services/api';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  categories: string[];
  brand?: string;
  vendor?: {
    _id: string;
    name: string;
    profile?: {
      businessName: string;
    };
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
  createdAt: string;
  updatedAt: string;
  moderationReason?: string;
  moderatedAt?: string;
  moderatedBy?: string;
}

export default function ProductModerationPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [currentPage, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        status: statusFilter,
        page: currentPage,
        limit: 20
      });
      setProducts(response.data.products);
      setTotalPages(response.data.pagination?.pages || 1);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (productId: string, status: 'approved' | 'rejected') => {
    try {
      setActionLoading(productId);
      await moderateProduct(productId, status, moderationReason);
      setSelectedProduct(null);
      setModerationReason('');
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to moderate product');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Product Moderation</h1>
          <p className="text-gray-600 mt-2">
            Review and approve products submitted by vendors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {['pending', 'approved', 'rejected', 'draft'].map((status) => {
            const count = products.filter(p => p.status === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(status)}`}>
                      <span className="text-2xl">
                        {status === 'pending' ? '⏳' :
                          status === 'approved' ? '✅' :
                            status === 'rejected' ? '❌' : '📝'}
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
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Products List */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">No products match the current filter</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_BASEURL}/${product.images[0]}`}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>💰 {product.currency} {product.price.toLocaleString()}</span>
                            <span>🏷️ {product.categories.join(', ')}</span>
                            {product.brand && <span>🏢 {product.brand}</span>}
                          </div>

                          {product.vendor && (
                            <p className="text-sm text-gray-600">
                              👤 Vendor: {product.vendor.profile?.businessName || product.vendor.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end space-y-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>

                        {product.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
                      <div>
                        <span className="font-medium">Created:</span> {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}
                      </div>
                      {product.moderatedAt && (
                        <div>
                          <span className="font-medium">Moderated:</span> {new Date(product.moderatedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Moderation Reason */}
                    {product.moderationReason && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Reason:</span> {product.moderationReason}
                        </p>
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
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Review Product: {selectedProduct.title}
              </h3>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setModerationReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Product Preview */}
            <div className="mb-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASEURL}/${selectedProduct.images[0]}`}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📦
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedProduct.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{selectedProduct.description}</p>
                  <div className="text-sm text-gray-600">
                    <p>Price: {selectedProduct.currency} {selectedProduct.price.toLocaleString()}</p>
                    <p>Categories: {selectedProduct.categories.join(', ')}</p>
                    {selectedProduct.brand && <p>Brand: {selectedProduct.brand}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Moderation Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional for approval, required for rejection)
              </label>
              <textarea
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Provide feedback to the vendor..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleModeration(selectedProduct._id, 'approved')}
                disabled={actionLoading === selectedProduct._id}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === selectedProduct._id ? 'Processing...' : '✅ Approve'}
              </button>

              <button
                onClick={() => handleModeration(selectedProduct._id, 'rejected')}
                disabled={actionLoading === selectedProduct._id || !moderationReason.trim()}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === selectedProduct._id ? 'Processing...' : '❌ Reject'}
              </button>

              <button
                onClick={() => {
                  setSelectedProduct(null);
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
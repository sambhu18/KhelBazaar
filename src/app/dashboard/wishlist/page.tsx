'use client';

import { useState, useEffect } from 'react';
import { getWishlist, removeFromWishlist, moveWishlistToCart } from '@/src/Services/api';

interface WishlistItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    averageRating: number;
    stock: number;
    status: string;
  };
  addedAt: string;
  notes?: string;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, [currentPage]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlist(currentPage);
      setWishlistItems(response.data.wishlist);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setActionLoading(productId);
      await removeFromWishlist({ productId });
      setWishlistItems(items => items.filter(item => item.productId._id !== productId));
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to remove from wishlist');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      setActionLoading(productId);
      await moveWishlistToCart({ productId, quantity: 1 });
      setWishlistItems(items => items.filter(item => item.productId._id !== productId));
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to move to cart');
    } finally {
      setActionLoading(null);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  </div>
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
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">♡</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-200">
                    {item.productId.images && item.productId.images.length > 0 ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASEURL}/${item.productId.images[0]}`}
                        alt={item.productId.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* Stock Status */}
                    {item.productId.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {item.productId.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      {renderStars(item.productId.averageRating)}
                      <span className="text-sm text-gray-600 ml-2">
                        ({item.productId.averageRating.toFixed(1)})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="text-lg font-bold text-gray-900 mb-3">
                      NPR {item.productId.price.toLocaleString()}
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-gray-500 mb-4">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-sm text-gray-600 mb-4 italic">
                        "{item.notes}"
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMoveToCart(item.productId._id)}
                        disabled={item.productId.stock === 0 || actionLoading === item.productId._id}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${item.productId.stock === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                          } ${actionLoading === item.productId._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {actionLoading === item.productId._id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          </div>
                        ) : item.productId.stock === 0 ? (
                          'Out of Stock'
                        ) : (
                          'Add to Cart'
                        )}
                      </button>

                      <button
                        onClick={() => handleRemoveFromWishlist(item.productId._id)}
                        disabled={actionLoading === item.productId._id}
                        className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${actionLoading === item.productId._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        Remove
                      </button>
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
    </div>
  );
}
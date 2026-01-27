"use client";

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/src/Services/axiosinstance';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string; // Note: Backend uses 'title', fixing this to 'title' as well to match backend? 
  // Wait, the backend returns 'title'. The interface says 'name'. 
  // If I look at the screenshot or code, does it render 'name'?
  // Page.tsx (homepage) uses 'title'.
  // This dashboard file uses 'name'. 
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  stock: number;
  categories: string[];
  sizes?: string[];
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCategory, setFilteredCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/products');
      // Map backend response to interface if needed, or just use raw if it matches enough
      // Backend: title, price, stock, categories, images
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // flatten categories and remove duplicates and potential falsy values
  const allCategories = products.flatMap(p => p.categories || []);
  const categories = ['all', ...Array.from(new Set(allCategories)).filter(c => c)];

  const displayProducts = filteredCategory === 'all'
    ? products
    : products.filter(p => p.categories?.includes(filteredCategory));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white relative overflow-hidden py-16 px-6 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">📊 Products Dashboard</h1>
          <p className="text-teal-100 text-lg">Manage and explore your product inventory</p>
        </div>
      </div>

      <div className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Products</h2>
            <p className="text-gray-600">Browse and manage all available products</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <p className="text-gray-500 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-teal-600 mt-2">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <p className="text-gray-500 text-sm font-medium">In Stock</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {products.filter(p => p.stock > 0).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <p className="text-gray-500 text-sm font-medium">Total Value</p>
              <p className="text-3xl font-bold text-teal-600 mt-2">
                NPR {products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <p className="text-gray-500 text-sm font-medium">Categories</p>
              <p className="text-3xl font-bold text-cyan-600 mt-2">
                {new Set(products.flatMap(p => p.categories || [])).size}
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilteredCategory(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${filteredCategory === category
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-500'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-teal-500"></div>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-gray-500 text-lg font-medium">No products found</p>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No image</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <h3 className="font-bold text-gray-900 truncate mb-2">
                    {product.title}
                  </h3>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block bg-teal-50 text-teal-600 text-xs font-bold px-3 py-1 rounded-full">
                      {product.categories?.[0] || 'Uncategorized'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-teal-600">
                        NPR {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          NPR {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span className={`text-sm font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      // If product has sizes, redirect to details
                      if (product.sizes && product.sizes.length > 0) {
                        window.location.href = `/products/${product._id}`;
                        return;
                      }

                      const { addToCart } = await import("@/src/Services/cartUtils");
                      const result = await addToCart(product);
                      if (result.success) alert(result.message);
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-bold transition ${product.stock > 0
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? (product.sizes && product.sizes.length > 0 ? '�️ View Options' : '�🛒 Add to Cart') : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

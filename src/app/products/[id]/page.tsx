'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  getProductById,
  getProductReviews,
  addToWishlist,
  createReview,
  checkRentalAvailability,
  createRental
} from '@/src/Services/api';
import { addToCart } from '@/src/Services/cartUtils';

interface Product {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  variants: Array<{
    size: string;
    stock: number;
    price?: number;
  }>;
  categories: string[];
  brand: string;
  material: string;
  color: string;
  averageRating: number;
  totalReviews: number;
  stock: number;
  isRentable: boolean;
  rentalPrice?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  customizable: boolean;
  customizationOptions?: {
    allowNamePrint: boolean;
    allowNumberPrint: boolean;
    maxNameLength: number;
    numberRange: { min: number; max: number };
    customizationPrice: number;
  };
  sizeChart?: {
    type: string;
    measurements: Array<{
      size: string;
      chest: number;
      waist: number;
      length: number;
    }>;
  };
}

interface Review {
  _id: string;
  userId: {
    name: string;
    avatar?: string;
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
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Product interaction states
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({
    name: '',
    number: '',
    additionalText: ''
  });

  // UI states
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Rental states
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [rentalAvailability, setRentalAvailability] = useState<any>(null);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "https://placehold.co/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const base = process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:5001';
    return `${base}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await getProductById(productId);
      setProduct(response.data.product);
      setReviews(response.data.reviews || []);
      setRelatedProducts(response.data.relatedProducts || []);

      // Update Recently Viewed
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = recentlyViewed.filter((item: any) => item._id !== response.data.product._id);
      const updated = [response.data.product, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));

      setError('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setActionLoading('cart');

      // Validate size selection for products with variants
      if (product.variants && product.variants.length > 0 && !selectedSize) {
        window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: 'Please select a size', type: "error" } }));
        return;
      }

      await addToCart(
        product,
        quantity,
        selectedSize,
        (product.customizable && (customization.name || customization.number)) ? customization : null
      );
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to add to cart');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    try {
      setActionLoading('wishlist');
      await addToWishlist({ productId: product._id });
      alert('Added to wishlist successfully!');
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to add to wishlist');
    } finally {
      setActionLoading(null);
    }
  };

  const checkRentalDates = async () => {
    if (!product || !rentalDates.startDate || !rentalDates.endDate) return;

    try {
      const response = await checkRentalAvailability(
        product._id,
        rentalDates.startDate,
        rentalDates.endDate
      );
      setRentalAvailability(response.data);
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to check availability');
    }
  };

  const handleRentProduct = async () => {
    if (!product || !rentalAvailability?.available) return;

    try {
      setActionLoading('rent');
      await createRental({
        productId: product._id,
        startDate: rentalDates.startDate,
        endDate: rentalDates.endDate,
        deliveryAddress: {} // This would come from user's default address
      });
      alert('Rental booking created successfully!');
      setShowRentalModal(false);
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to create rental booking');
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-xl'
    };

    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${sizeClasses[size]} ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const calculatePrice = () => {
    if (!product) return 0;

    let basePrice = product.price;

    // Check for variant-specific pricing
    if (selectedSize && product.variants) {
      const variant = product.variants.find(v => v.size === selectedSize);
      if (variant && variant.price) {
        basePrice = variant.price;
      }
    }

    // Add customization cost
    if (product.customizable && product.customizationOptions &&
      (customization.name || customization.number)) {
      basePrice += product.customizationOptions.customizationPrice;
    }

    return basePrice * quantity;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">😞</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Product not found</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Main Section */}
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="aspect-square bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100 shadow-sm relative group">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[selectedImage])}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                    📦
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? 'border-[#00B8AE] shadow-md scale-105' : 'border-gray-200 hover:border-[#00B8AE]/50'
                        }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Title and Rating */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-teal-50 text-teal-700 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full border border-teal-100">
                    {product.categories?.[0] || 'Equipment'}
                  </span>
                  {product.isRentable && (
                    <span className="bg-purple-50 text-purple-700 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full border border-purple-100">
                      Rentable
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tighter">{product.title}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    {renderStars(product.averageRating)}
                    <span className="ml-2 font-bold text-gray-700">
                      {product.averageRating.toFixed(1)} <span className="text-gray-400 font-medium">({product.totalReviews} reviews)</span>
                    </span>
                  </div>
                  {product.brand && (
                    <span className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {product.brand}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-5xl font-black text-[#00B8AE] tracking-tighter">
                    {product.currency} {calculatePrice().toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl font-bold text-gray-400 line-through mb-1.5">
                      {product.currency} {(product.originalPrice * quantity).toLocaleString()}
                    </span>
                  )}
                </div>
                {product.isRentable && product.rentalPrice && (
                  <div className="inline-block mt-3 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 text-sm font-bold text-blue-700">
                    📅 Available for Rent — from {product.currency} {product.rentalPrice.daily}/day
                  </div>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-600 text-lg leading-relaxed mb-8 font-medium">
                  {product.shortDescription}
                </p>
              )}

              {/* Size Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-black text-gray-900 uppercase tracking-widest">
                      Select Size
                    </label>
                    {product.sizeChart && (
                      <button
                        onClick={() => setShowSizeChart(true)}
                        className="text-sm font-bold text-[#00B8AE] hover:text-teal-600 flex items-center gap-1"
                      >
                        📐 Size Guide
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedSize(variant.size)}
                        disabled={variant.stock === 0}
                        className={`relative px-6 py-3 border-2 rounded-xl text-base font-bold transition-all duration-300 ${selectedSize === variant.size
                          ? 'bg-[#00B8AE] text-white border-[#00B8AE] shadow-lg shadow-teal-500/30 scale-105'
                          : variant.stock === 0
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                            : 'border-gray-200 text-gray-700 hover:border-[#00B8AE] hover:text-[#00B8AE] bg-white'
                          }`}
                      >
                        {variant.size}
                        {variant.stock === 0 && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                            Sold Out
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.color && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: product.color.toLowerCase() }}
                    ></div>
                    <span className="text-sm text-gray-600">{product.color}</span>
                  </div>
                </div>
              )}

              {/* Customization Options */}
              {product.customizable && product.customizationOptions && (
                <div className="mb-8 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 shadow-inner">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm mb-4">✨ Customize Your Gear</h3>

                  {product.customizationOptions.allowNamePrint && (
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                        Name Print (Max {product.customizationOptions.maxNameLength} char)
                      </label>
                      <input
                        type="text"
                        maxLength={product.customizationOptions.maxNameLength}
                        value={customization.name}
                        onChange={(e) => setCustomization({ ...customization, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-white rounded-xl focus:border-[#00B8AE] focus:outline-none focus:ring-4 focus:ring-teal-500/10 font-medium text-gray-900 shadow-sm transition-all"
                        placeholder="e.g. RONALDO"
                      />
                    </div>
                  )}

                  {product.customizationOptions.allowNumberPrint && (
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                        Squad Number ({product.customizationOptions.numberRange.min}-{product.customizationOptions.numberRange.max})
                      </label>
                      <input
                        type="number"
                        min={product.customizationOptions.numberRange.min}
                        max={product.customizationOptions.numberRange.max}
                        value={customization.number}
                        onChange={(e) => setCustomization({ ...customization, number: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-white rounded-xl focus:border-[#00B8AE] focus:outline-none focus:ring-4 focus:ring-teal-500/10 font-medium text-gray-900 shadow-sm transition-all"
                        placeholder="e.g. 7"
                      />
                    </div>
                  )}

                  <div className="font-black text-[#00B8AE] text-sm flex items-center gap-2 mt-4 bg-white px-4 py-2 rounded-lg inline-flex shadow-sm">
                    <span>🪙</span> Customization Fee: +{product.currency} {product.customizationOptions.customizationPrice}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-1 shadow-sm w-max">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#00B8AE] hover:bg-teal-50 rounded-lg transition-colors font-bold text-xl"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900 text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#00B8AE] hover:bg-teal-50 rounded-lg transition-colors font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Stock Status */}
                  <div className="ml-4">
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {product.stock} in stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mt-auto pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || actionLoading === 'cart'}
                    className={`flex-1 py-4 px-8 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 ${product.stock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white hover:shadow-xl hover:shadow-teal-500/30 transform hover:-translate-y-1 active:scale-95'
                      } ${actionLoading === 'cart' ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {actionLoading === 'cart' ? (
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : product.stock === 0 ? (
                      'OUT OF STOCK'
                    ) : (
                      'ADD TO CART'
                    )}
                  </button>

                  <button
                    onClick={handleAddToWishlist}
                    disabled={actionLoading === 'wishlist'}
                    className={`py-4 px-8 border-2 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-2 ${actionLoading === 'wishlist' 
                      ? 'border-gray-200 text-gray-400 bg-gray-50' 
                      : 'border-gray-200 text-gray-700 bg-white hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 active:scale-95'
                      }`}
                  >
                    {actionLoading === 'wishlist' ? '...' : 'Add to Wishlist'}
                  </button>
                </div>

                {/* Rental Button */}
                {product.isRentable && (
                  <button
                    onClick={() => setShowRentalModal(true)}
                    className="w-full py-4 px-8 bg-black text-white rounded-xl font-black text-lg hover:bg-gray-900 transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-3 active:scale-95 border border-black"
                  >
                    RENT GEAR NOW 
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 mb-12 overflow-hidden">
          <div className="border-b-2 border-gray-100 bg-gray-50/50">
            <nav className="flex space-x-2 px-8 pt-4 no-scrollbar overflow-x-auto">
              {['description', 'personalization', 'reviews', 'specifications'].map((tab) => {
                if (tab === 'personalization' && !product.customizable) return null;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-8 font-black text-sm uppercase tracking-widest rounded-t-2xl transition-all duration-300 ${activeTab === tab
                      ? 'bg-white text-[#00B8AE] shadow-[0_-4px_10px_rgba(0,0,0,0.02)] border-t-2 border-l-2 border-r-2 border-gray-100 border-b-0 -mb-[2px] z-10'
                      : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 border-2 border-transparent'
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none p-4">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description || 'No description available.'}
                </p>
              </div>
            )}

            {activeTab === 'personalization' && product.customizable && (
              <div className="p-4 md:p-8 animate-fade-in-up">
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Personalize Your Product <span className="text-[#00B8AE] ml-2">{product.currency} {product.customizationOptions?.customizationPrice}</span></h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                     <button 
                       onClick={() => setCustomization({ name: '', number: '', additionalText: '' })}
                       className={`py-5 px-8 border-2 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${(!customization.name && !customization.number) ? 'border-[#00B8AE] text-[#00B8AE] bg-teal-50' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                     >
                       NONE
                     </button>
                     <button 
                       onClick={() => { if(!customization.name && !customization.number) setCustomization({ ...customization, name: 'PLAYER' }) }}
                       className={`py-5 px-8 border-2 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${(customization.name || customization.number) ? 'border-rose-500 text-rose-500 bg-rose-50' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                     >
                       PLAYER
                     </button>
                  </div>

                  {(customization.name || customization.number || true) && (
                    <div className="space-y-8 p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">👕</div>
                         <div>
                            <p className="font-black text-gray-900 uppercase text-xs tracking-[0.2em]">Live Preview Area</p>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Type below to see change</p>
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">NAME PRINT (MAX {product.customizationOptions?.maxNameLength})</label>
                            <input
                              type="text"
                              maxLength={product.customizationOptions?.maxNameLength}
                              value={customization.name}
                              onChange={(e) => setCustomization({ ...customization, name: e.target.value.toUpperCase() })}
                              className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-6 text-xl font-black focus:border-[#00B8AE] transition-all outline-none placeholder:text-gray-200 uppercase"
                              placeholder="YOUR NAME"
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">NUMBER</label>
                            <input
                              type="number"
                              min={product.customizationOptions?.numberRange.min}
                              max={product.customizationOptions?.numberRange.max}
                              value={customization.number}
                              onChange={(e) => setCustomization({ ...customization, number: e.target.value })}
                              className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-6 text-xl font-black focus:border-[#00B8AE] transition-all outline-none placeholder:text-gray-200"
                              placeholder="00"
                            />
                         </div>
                       </div>

                       <div className="flex gap-4 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                          <span className="text-xl">🛡️</span>
                          <p className="text-xs font-bold text-teal-800 leading-relaxed uppercase tracking-widest">
                            Professional thermal-press technology. Guaranteed to last through intensive matches and washes. High-visibility athlete font style.
                          </p>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Customer Reviews ({reviews.length})
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-6 py-3 bg-[#00B8AE] hover:bg-teal-600 text-white font-bold rounded-xl transition-colors shadow-md"
                  >
                    Write Review
                  </button>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {review.userId.avatar ? (
                              <img
                                src={review.userId.avatar}
                                alt={review.userId.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {review.userId.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {review.userId.name}
                              </span>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center mb-2">
                              {renderStars(review.rating, 'sm')}
                              {review.size && (
                                <span className="ml-2 text-xs text-gray-500">
                                  Size: {review.size}
                                </span>
                              )}
                            </div>

                            {review.title && (
                              <h4 className="font-medium text-gray-900 mb-2">
                                {review.title}
                              </h4>
                            )}

                            <p className="text-gray-600 mb-3">{review.comment}</p>

                            {review.pros.length > 0 && (
                              <div className="mb-2">
                                <span className="text-sm font-medium text-green-600">Pros: </span>
                                <span className="text-sm text-gray-600">
                                  {review.pros.join(', ')}
                                </span>
                              </div>
                            )}

                            {review.cons.length > 0 && (
                              <div className="mb-2">
                                <span className="text-sm font-medium text-red-600">Cons: </span>
                                <span className="text-sm text-gray-600">
                                  {review.cons.join(', ')}
                                </span>
                              </div>
                            )}

                            {review.images.length > 0 && (
                              <div className="flex space-x-2 mb-3">
                                {review.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={getImageUrl(image)}
                                    alt={`Review image ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}

                            <div className="flex items-center space-x-4 text-sm">
                              <button className="text-gray-500 hover:text-gray-700">
                                👍 Helpful ({review.helpful})
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Brand:</span>
                      <span className="text-gray-600">{product.brand}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Material:</span>
                      <span className="text-gray-600">{product.material}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Color:</span>
                      <span className="text-gray-600">{product.color}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Categories:</span>
                    <span className="text-gray-600">{product.categories.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <a
                  key={relatedProduct._id}
                  href={`/products/${relatedProduct._id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <img
                          src={getImageUrl(relatedProduct.images[0])}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {relatedProduct.title}
                      </h4>
                      <p className="text-lg font-bold text-gray-900">
                        {product.currency} {relatedProduct.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rental Modal */}
      {showRentalModal && product.isRentable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rent {product.title}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={rentalDates.startDate}
                  onChange={(e) => setRentalDates({ ...rentalDates, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={rentalDates.endDate}
                  onChange={(e) => setRentalDates({ ...rentalDates, endDate: e.target.value })}
                  min={rentalDates.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {rentalDates.startDate && rentalDates.endDate && (
                <button
                  onClick={checkRentalDates}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Check Availability
                </button>
              )}

              {rentalAvailability && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  {rentalAvailability.available ? (
                    <div className="text-green-600">
                      <p className="font-medium">✓ Available for rental</p>
                      <div className="mt-2 text-sm">
                        <p>Duration: {rentalAvailability.pricing.totalDays} days</p>
                        <p>Daily Rate: {product.currency} {rentalAvailability.pricing.dailyRate}</p>
                        <p>Total: {product.currency} {rentalAvailability.pricing.totalAmount}</p>
                        <p>Deposit: {product.currency} {rentalAvailability.pricing.deposit}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <p className="font-medium">✗ Not available for selected dates</p>
                      <p className="text-sm">Please choose different dates</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              {rentalAvailability?.available && (
                <button
                  onClick={handleRentProduct}
                  disabled={actionLoading === 'rent'}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading === 'rent' ? 'Booking...' : 'Book Rental'}
                </button>
              )}
              <button
                onClick={() => {
                  setShowRentalModal(false);
                  setRentalAvailability(null);
                  setRentalDates({ startDate: '', endDate: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && product.sizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Size Chart</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chest (cm)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waist (cm)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Length (cm)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.sizeChart.measurements.map((measurement, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {measurement.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {measurement.chest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {measurement.waist}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {measurement.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowSizeChart(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/src/Services/api";

function ProductDetailsContent({ params }: { params: any }) {
  const router = useRouter();
  const { id } = use(params) as { id: string };
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [custom, setCustom] = useState({ name: "", number: "" });
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/products/${id}`);
        setProduct(response.data);

        // Fetch related products
        try {
          const relatedRes = await API.get(`/products?category=${response.data.category}&limit=4`);
          setRelatedProducts(relatedRes.data.filter((p: any) => p._id !== id));
        } catch {
          console.log("Could not fetch related products");
        }
      } catch (err: any) {
        setError(err?.response?.data?.msg || "Failed to load product");
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600 font-medium text-xl">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-600 font-medium text-xl mb-6">{error || "Product not found"}</p>
          <Link
            href="/products"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const allImages = images.length > 0 ? images : ['🖼️'];

  const addToCart = async () => {
    // If product has sizes, require selection
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size first!");
      return;
    }

    const { addToCart } = await import("@/src/Services/cartUtils");
    // Only pass customization if name or number is provided
    const customizationData = (custom.name || custom.number) ? custom : null;
    const result = await addToCart(product, quantity, selectedSize, customizationData);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/cart");
      }, 1500);
    } else {
      alert(result.message);
    }
  };

  const toggleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isWishlisted) {
      wishlist = wishlist.filter((p: any) => p._id !== id);
    } else {
      wishlist.push(product);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  // Mock reviews
  const reviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Excellent quality! Perfect for professional use.",
      date: "2 days ago"
    },
    {
      name: "Priya Singh",
      rating: 4,
      comment: "Good product, delivery was fast.",
      date: "1 week ago"
    },
    {
      name: "Amit Patel",
      rating: 5,
      comment: "Worth every penny! Highly recommended.",
      date: "2 weeks ago"
    }
  ];

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-teal-600">Products</Link>
          <span>/</span>
          <span className="text-teal-600 font-semibold">{product.title}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 border border-gray-100">
              <div className="relative w-full bg-linear-to-br from-gray-100 to-gray-200 aspect-square flex items-center justify-center">
                {typeof allImages[selectedImage] === 'string' && allImages[selectedImage].startsWith('http') ? (
                  <img
                    src={allImages[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-8xl">{allImages[selectedImage]}</div>
                )}

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  -20%
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition h-20 ${selectedImage === idx
                      ? 'border-[#00B8AE] shadow-lg'
                      : 'border-gray-200 hover:border-[#00B8AE]'
                      }`}
                  >
                    <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-block bg-teal-600/10 text-teal-600 px-4 py-1 rounded-full text-sm font-bold mb-3">
                {product.category || "Sports"}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-gray-700 font-semibold">{avgRating}/5 ({reviews.length} reviews)</span>
              </div>

              {/* Price Section */}
              <div className="border-b-2 border-gray-200 pb-6">
                <div className="flex items-baseline gap-4 mb-4">
                  <p className="text-4xl font-bold text-teal-600">NPR {product.price}</p>
                  <p className="text-xl text-gray-400 line-through">NPR {Math.round(product.price * 1.25)}</p>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">Save 20%</span>
                </div>
                <p className="text-green-600 font-semibold">✓ In Stock ({Math.floor(Math.random() * 20) + 5} available)</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{product.description}</p>

            {/* Customization (for jerseys) */}
            {(product.categories && product.categories.some((c: string) => c.toLowerCase() === 'jersey')) && (
              <div className="bg-linear-to-r from-blue-600/10 to-indigo-700/10 border-l-4 border-blue-600 p-5 rounded-lg mb-6">
                <h3 className="font-bold text-gray-900 mb-4">👕 Customize Your Jersey</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Player Name</label>
                    <input
                      type="text"
                      placeholder="Enter name (e.g., MESSI)"
                      maxLength={12}
                      value={custom.name}
                      onChange={(e) => setCustom({ ...custom, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-teal-600/30 rounded-lg focus:outline-none focus:border-teal-600 font-bold text-center uppercase transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Jersey Number</label>
                    <input
                      type="number"
                      placeholder="0-99"
                      min="0"
                      max="99"
                      value={custom.number}
                      onChange={(e) => setCustom({ ...custom, number: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-teal-600/30 rounded-lg focus:outline-none focus:border-teal-600 font-bold text-center transition"
                    />
                  </div>
                  {(custom.name || custom.number) && (
                    <div className="p-4 bg-white border-2 border-teal-600/30 rounded-lg text-center">
                      <p className="text-xs text-gray-600 mb-2">Preview:</p>
                      <p className="text-3xl font-bold text-teal-600 tracking-widest">{custom.name || "NAME"}</p>
                      <p className="text-2xl font-bold text-teal-600">{custom.number || "00"}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 border-2 rounded-lg font-semibold transition ${selectedSize === s
                        ? "border-teal-600 bg-teal-600 text-white shadow-md"
                        : "border-gray-200 text-gray-700 hover:border-teal-600 hover:text-teal-600"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-bold text-gray-700">Quantity:</label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-[#00B8AE] hover:bg-gray-200 font-bold text-lg transition"
                >
                  −
                </button>
                <span className="px-6 py-2 font-bold text-gray-900 text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-[#00B8AE] hover:bg-gray-200 font-bold text-lg transition"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-600 ml-auto">Total: <span className="font-bold text-teal-600">NPR {product.price * quantity}</span></p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={addToCart}
                className="flex-1 bg-linear-to-r from-teal-500 to-cyan-600 text-white font-bold py-4 rounded-lg hover:shadow-xl transition active:scale-95 text-lg flex items-center justify-center gap-2"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                className={`w-16 font-bold py-4 rounded-lg transition border-2 flex items-center justify-center text-xl ${isWishlisted
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-red-300'
                  }`}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded flex items-center gap-2">
                <span className="text-xl">✅</span>
                <p className="font-semibold">Added to cart! Redirecting...</p>
              </div>
            )}

            {/* Shipping Info */}
            <div className="bg-blue-600/10 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-bold text-gray-900">Free Shipping</p>
                  <p className="text-gray-600">On orders over NPR 1,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">↩️</span>
                <div>
                  <p className="font-bold text-gray-900">Easy Returns</p>
                  <p className="text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-bold text-gray-900">Secure Payment</p>
                  <p className="text-gray-600">100% secure transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16 border border-gray-100">
          {/* Tab Headers */}
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-4 px-6 font-bold text-lg transition ${activeTab === "details"
                ? 'border-b-4 border-teal-600 text-teal-600 bg-teal-600/5'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              📋 Product Details
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-4 px-6 font-bold text-lg transition ${activeTab === "reviews"
                ? 'border-b-4 border-teal-600 text-teal-600 bg-teal-600/5'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              ⭐ Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "details" ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">About This Product</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">Features</h3>
                  <ul className="space-y-2">
                    {["Premium Quality Materials", "Durable & Long-lasting", "Comfortable Fit", "Professional Grade", "Perfect for Training & Play"].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="text-teal-600 font-bold text-xl">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-lg mb-4">Customer Reviews</h3>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-teal-600">{avgRating}</p>
                      <div className="flex text-yellow-400 text-lg justify-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Based on {reviews.length} reviews</p>
                    </div>
                  </div>
                </div>

                {reviews.map((review, idx) => (
                  <div key={idx} className="border-b-2 border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-gray-900">{review.name}</div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              🛍️ Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p: any) => (
                <Link
                  href={`/products/${p._id}`}
                  key={p._id}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-600">
                    <div className="relative overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 h-48">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">📦</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 text-sm mb-2 group-hover:text-[#00B8AE] transition line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-xl font-bold text-teal-600">NPR {p.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetails({ params }: { params: any }) {
  return (
    <Suspense fallback={<p className="p-10 text-lg">Loading...</p>}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/src/Services/axiosinstance";

export default function HomePage() {
  const route = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/api/products");
      // Basic validation to ensure we have an array
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Products", icon: "🏆" },
    { id: "football", name: "Football", icon: "⚽" },
    { id: "cricket", name: "Cricket", icon: "🏏" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
  ];

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => {
      // Handle categories as array or string just in case
      if (Array.isArray(p.categories)) {
        return p.categories.some((c: string) => c.toLowerCase() === selectedCategory.toLowerCase());
      }
      return p.categories?.toLowerCase().includes(selectedCategory.toLowerCase());
    });

  // Display only first 8 products for "Featured" if strict about it, or all for now
  const displayProducts = filteredProducts.slice(0, 8);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "https://placehold.co/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white relative overflow-hidden h-[600px] flex items-center">



        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/10 z-0"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 z-10 w-full">
          <h1 className="text-6xl font-bold mb-4 leading-tight drop-shadow-md">
            Play Your Game
            <br />
            <span className="text-blue-100">With Premium Gear</span>
          </h1>
          <p className="text-xl opacity-95 mb-8 max-w-2xl text-white drop-shadow-sm font-medium">
            Discover the best sports equipment from trusted brands. Whether you're a professional athlete or just starting out, we have everything you need.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => route.push('/products')}
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🛍️ Shop Now
            </button>
            <button
              onClick={() => route.push('/community')}
              className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition transform hover:-translate-y-1 backdrop-blur-sm"
            >
              👥 Join Community
            </button>
            <button
              onClick={() => route.push('/auth/Login')}
              className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition transform hover:-translate-y-1 backdrop-blur-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12 px-6 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600 mb-2">{products.length > 0 ? `${products.length}+` : "100+"}</p>
              <p className="text-gray-700 font-medium">Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 mb-2">10K+</p>
              <p className="text-gray-700 font-medium">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600 mb-2">⭐ 4.8</p>
              <p className="text-gray-700 font-medium">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600 mb-2">24/7</p>
              <p className="text-gray-700 font-medium">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-lg font-semibold transition text-center ${selectedCategory === cat.id
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Jersey Customization Promo */}
      <div className="bg-gray-900 text-white py-16 px-6 relative overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-500 opacity-10 transform skew-x-12"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-left md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">
              Wear Your Passion on Your Back
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Customize your jersey with your own name and number.
              Show your support in style with our premium quality printing.
            </p>
            <button
              onClick={() => route.push('/products?category=jersey')}
              className="bg-teal-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-teal-600 transition shadow-lg text-lg transform hover:-translate-y-1"
            >
              Start Customizing 👕
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Visual representation of a jersey */}
            <div className="relative bg-white text-gray-900 w-64 h-80 rounded-3xl shadow-2xl flex flex-col items-center justify-center border-4 border-teal-500 transform rotate-3 hover:rotate-0 transition duration-500">
              <div className="text-6xl font-black text-teal-500 mb-2">MESSI</div>
              <div className="text-8xl font-black text-teal-500">10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Detailed Products</h2>
          <p className="text-gray-600">Premium sports equipment curated just for you</p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-56 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((p: any) => (
              <Link
                key={p._id}
                href={`/products/${p._id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100 h-56">
                    <img
                      src={getImageUrl(p.images?.[0])}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Optional Badges based on logic, keeping static for now if needed or remove */}
                    {/* <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      SALE
                    </div> */}
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex flex-col grow">
                    <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition line-clamp-2">
                      {p.title}
                    </h3>

                    {/* Rating (Static since DB doesn't have it yet, or use random/default) */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(0)</span>
                    </div>

                    {/* Price Section */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-2xl font-bold text-green-600">{p.currency || 'NPR'} {p.price}</p>
                        {/* <p className="text-lg text-gray-400 line-through">NPR {Math.round(p.price * 1.25)}</p> */}
                      </div>

                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          // If product has sizes, redirect to details
                          if (p.sizes && p.sizes.length > 0) {
                            route.push(`/products/${p._id}`);
                            return;
                          }

                          const { addToCart } = await import("@/src/Services/cartUtils");
                          const result = await addToCart(p);
                          if (result.success) {
                            alert(result.message);
                          } else {
                            alert(result.message);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 rounded-lg hover:shadow-lg transition font-semibold"
                      >
                        {p.sizes && p.sizes.length > 0 ? '👁️ View Options' : '🛒 Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Products */}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-10 py-4 rounded-lg font-bold hover:shadow-xl transition shadow-lg text-lg"
          >
            View All Products →
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why Choose Khel Bazaar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="font-bold text-lg mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free delivery on orders above NPR 2000</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-bold text-lg mb-2">Quality Assured</h3>
              <p className="text-gray-600">100% authentic products from trusted brands</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-bold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Price match guarantee and regular discounts</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day hassle-free return policy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white py-16 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Game?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of athletes and sports enthusiasts who trust Khel Bazaar for their gear needs.
        </p>
        <button
          onClick={() => route.push('/products')}
          className="bg-white text-teal-600 px-10 py-4 rounded-lg font-bold hover:bg-gray-50 transition text-lg shadow-lg"
        >
          Start Shopping Now
        </button>
      </div>
    </div>
  );
}

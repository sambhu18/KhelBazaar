"use client";

import API from "@/src/Services/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    // Sync category from URL if it changes (optional but good for back button)
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["all", ...new Set(products.map((p: any) => p.category || "sports"))];

  let filteredProducts = products.filter((p: any) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()))
  );

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts].reverse();
  }

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    // Update URL without refresh
    const newUrl = cat === "all" ? "/products" : `/products?category=${cat}`;
    router.replace(newUrl);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-linear-to-r from-[#00B8AE] to-teal-500 text-white py-12 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">🛍️ All Products</h1>
          <p className="text-teal-100 text-lg">Discover premium sports equipment for every athlete</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00B8AE] font-medium text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === cat
                      ? 'bg-[#00B8AE] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00B8AE] font-medium text-gray-700"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-700 font-semibold text-lg">
            {loading ? "Loading..." : `${filteredProducts.length} products found`}
          </p>
          <Link href="/products" className="text-[#00B8AE] hover:text-teal-600 font-semibold flex items-center gap-2" onClick={() => handleCategoryChange("all")}>
            Clear Filters ✕
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="inline-flex flex-col items-center">
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <p className="text-gray-600 font-medium text-xl">Loading amazing products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 font-medium text-xl mb-6">No products match your filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                handleCategoryChange("all");
              }}
              className="bg-[#00B8AE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredProducts.map((p: any) => (
              <Link
                href={`/products/${p._id}`}
                key={p._id}
                className="group h-full"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100 hover:border-[#00B8AE] hover:scale-105">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 h-64">
                    {p.images?.[0] && typeof p.images[0] === 'string' && p.images[0].startsWith('http') ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">📦</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        SALE -20%
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-[#00B8AE] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ⭐ Hot
                      </div>
                    </div>

                    {/* Quick View Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-[#00B8AE] text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-600 transition transform -translate-y-2 group-hover:translate-y-0">
                        👁️ Quick View
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col grow">
                    <p className="text-xs text-[#00B8AE] font-bold uppercase tracking-wider mb-2">
                      {p.category || 'Sports'}
                    </p>

                    <h3 className="font-bold text-gray-900 text-base mb-3 group-hover:text-[#00B8AE] transition line-clamp-2 min-h-12">
                      {p.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 font-semibold">(48)</span>
                    </div>

                    {/* Price */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-2xl font-bold text-[#00B8AE]">NPR {p.price}</p>
                        <p className="text-sm text-gray-400 line-through">NPR {Math.round(p.price * 1.25)}</p>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={async (e) => {
                          e.preventDefault();

                          if (p.sizes && p.sizes.length > 0) {
                            router.push(`/products/${p._id}`);
                            return;
                          }

                          const { addToCart } = await import("@/src/Services/cartUtils");
                          const result = await addToCart(p);
                          if (result.success) alert(result.message);
                        }}
                        className="w-full bg-linear-to-r from-[#00B8AE] to-teal-500 hover:shadow-lg text-white py-3 rounded-lg transition font-bold active:scale-95 flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

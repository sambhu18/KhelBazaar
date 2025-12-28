"use client";

import API from "@/src/Services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p: any) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (e: any, product: any) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">🛍️ All Products</h1>
          <p className="text-blue-100 text-lg">Browse our complete collection of sports equipment</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 font-medium"
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700 font-semibold">
            {loading ? "Loading..." : `${filteredProducts.length} products found`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600 font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
            {filteredProducts.map((p: any) => (
              <Link
                href={`/products/${p._id}`}
                key={p._id}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100 h-56">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      SALE -20%
                    </div>
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Hot
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col grow">
                    <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition line-clamp-2">
                      {p.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(48)</span>
                    </div>

                    {/* Price */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-2xl font-bold text-green-600">NPR {p.price}</p>
                        <p className="text-lg text-gray-400 line-through">NPR {Math.round(p.price * 1.25)}</p>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        🛒 Add to Cart
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

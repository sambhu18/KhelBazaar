'use client';
import Link from "next/link";
import {register, login} from "@/src/Services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const route = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [{
    _id: "1",
    title: "Football",
    price: 1500,
    category: "football",
    images: ["/images/football.jpg"],
    rating: 4.8,
    reviews: 128,
  },
  {
    _id: "2",
    title: "Cricket Bat",
    price: 3500,
    category: "cricket",
    images: ["/images/cricket_bat.jpg"],
    rating: 4.6,
    reviews: 95,
  },
  {
    _id: "3",
    title: "Football",
    price: 1500,
    category: "football",
    images: ["/images/football.jpg"],
    rating: 4.8,
    reviews: 128,
  },
  {
    _id: "4",
    title: "Cricket Bat",
    price: 3500,
    category: "cricket",
    images: ["/images/cricket_bat.jpg"],
    rating: 4.6,
    reviews: 95,
  }
]

  const categories = [
    { id: "all", name: "All Products", icon: "🏆" },
    { id: "football", name: "Football", icon: "⚽" },
    { id: "cricket", name: "Cricket", icon: "🏏" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <h1 className="text-6xl font-bold mb-4 leading-tight">
            Play Your Game
            <br />
            <span className="text-blue-200">With Premium Gear</span>
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl">
            Discover the best sports equipment from trusted brands. Whether you're a professional athlete or just starting out, we have everything you need.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => route.push('/products')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl"
            >
              🛍️ Shop Now
            </button>
            <button 
              onClick={() => route.push('/community')}
              className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              👥 Join Community
            </button>
            <button 
              onClick={() => route.push('/auth/Login')}
              className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              🔐 Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12 px-6 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-2">5000+</p>
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
              className={`p-4 rounded-lg font-semibold transition text-center ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
          <p className="text-gray-600">Premium sports equipment curated just for you</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p: any) => (
            <Link
              key={p._id}
              href={`/products/${p._id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
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

                {/* Content Container */}
                <div className="p-5 flex flex-col grow">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {p.title}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(p.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({p.reviews})</span>
                  </div>

                  {/* Price Section */}
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <p className="text-2xl font-bold text-green-600">NPR {p.price}</p>
                      <p className="text-lg text-gray-400 line-through">NPR {Math.round(p.price * 1.25)}</p>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
                        cart.push({ ...p, qty: 1 });
                        localStorage.setItem("cart", JSON.stringify(cart));
                        route.push("/cart");
                      }}
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

        {/* View All Products */}
        <div className="text-center mt-16">
          <Link 
            href="/products"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl text-lg"
          >
            View All {filteredProducts.length} Products →
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

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Game?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of athletes and sports enthusiasts who trust Khel Bazaar for their gear needs.
        </p>
        <button 
          onClick={() => route.push('/products')}
          className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-gray-50 transition text-lg shadow-lg"
        >
          Start Shopping Now
        </button>
      </div>
    </div>
  );
}




// import { redirect } from "next/navigation";
// export default function Home() {
//   redirect("/auth/Login");
// }

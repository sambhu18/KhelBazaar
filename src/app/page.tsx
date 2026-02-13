'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/src/Services/axiosinstance";

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [rentalProducts, setRentalProducts] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchRentals();
    fetchRecentGear();

    // Scroll Animation Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleDonate = (amount: number | string) => {
    alert(`Thank you for your generous donation of ${typeof amount === 'number' ? 'RS ' + amount : amount}! Together, we're changing grassroots sports. ❤️`);
  };

  const fetchRecentGear = () => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(saved);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/api/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await axiosInstance.get("/api/products?isRentable=true");
      setRentalProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch rentals", error);
    }
  };

  const categories = [
    { id: "all", name: "All Gear", icon: "🏆" },
    { id: "football", name: "Football", icon: "⚽" },
    { id: "cricket", name: "Cricket", icon: "🏏" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
    { id: "jersey", name: "Jerseys", icon: "👕" },
  ];

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => {
      if (Array.isArray(p.categories)) {
        return p.categories.some((c: string) => c.toLowerCase() === selectedCategory.toLowerCase());
      }
      return p.categories?.toLowerCase().includes(selectedCategory.toLowerCase());
    });

  const displayProducts = filteredProducts.slice(0, 8);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "https://placehold.co/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-white selection:bg-teal-500 selection:text-white">
      {/* Premium Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center overflow-hidden bg-black">
        {/* Background Image with Parallax-like Scroll */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 scale-105 transition-transform duration-[10000ms] ease-linear hover:scale-110"
          style={{ backgroundImage: "url('/hero-banner.png')" }}
        ></div>

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/20 z-10"></div>

        <div className="relative max-w-7xl mx-auto px-6 z-20 w-full animate-fade-in-up">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-400 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md border border-teal-500/30">
              New Season 2026 Arrived
            </span>
            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
              ELEVATE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 text-glow">PERFORMANCE</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed font-medium max-w-2xl">
              Professional-grade gear for the athletes who never stop. Discover curated equipment engineered for champions.
            </p>

            <div className="flex flex-wrap gap-5">
              <button
                onClick={() => router.push('/products')}
                className="group relative px-10 py-5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl font-black text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  SHOP COLLECTION <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>

              <button
                onClick={() => router.push('/community')}
                className="px-10 py-5 glass-effect text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 border border-white/20"
              >
                JOIN THE ELITE
              </button>
            </div>
          </div>
        </div>

        {/* Floating Trust Badges */}
        <div className="absolute bottom-12 right-12 z-20 hidden lg:flex gap-8">
          <div className="flex items-center gap-3 text-white/70">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-xl">🛡️</div>
            <div className="text-xs uppercase tracking-widest font-bold">Authentic<br />Guaranteed</div>
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-xl">⚡</div>
            <div className="text-xs uppercase tracking-widest font-bold">Global<br />Fast Shipping</div>
          </div>
        </div>
      </section>

      {/* Stats Counter - Floating Section */}
      <div className="relative z-30 -mt-20 max-w-6xl mx-auto px-6">
        <div className="glass-effect-dark backdrop-blur-2xl rounded-[32px] p-10 grid grid-cols-2 md:grid-cols-4 gap-8 border border-white/10 shadow-2xl">
          {[
            { label: "Elite Products", value: products.length > 0 ? `${products.length}+` : "150+", color: "text-teal-400" },
            { label: "Active Athletes", value: "12K+", color: "text-blue-400" },
            { label: "Pro Rating", value: "4.9", color: "text-yellow-400" },
            { label: "Clubs Partnered", value: "85+", color: "text-purple-400" }
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-default">
              <p className={`text-3xl md:text-4xl font-black mb-1 transition-transform group-hover:scale-110 ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Modern Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-0">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Browse Excellence</h2>
            <p className="text-gray-500 text-lg font-medium">Select your discipline and discover tools built for your game.</p>
          </div>
          <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 min-w-[140px] ${selectedCategory === cat.id
                  ? "bg-white text-teal-600 shadow-xl scale-105 z-10"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                <span className="text-xl mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="space-y-6">
                <div className="bg-gray-100 aspect-[4/5] rounded-[32px] animate-pulse"></div>
                <div className="h-6 bg-gray-100 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/2 animate-pulse"></div>
              </div>
            ))
          ) : displayProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
              <p className="text-2xl text-gray-400 font-bold italic">No gear found in this sector.</p>
            </div>
          ) : (
            displayProducts.map((p: any) => (
              <div
                key={p._id}
                className="group relative bg-white rounded-[32px] border border-gray-100 p-4 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-4"
              >
                <Link href={`/products/${p._id}`} className="block overflow-hidden rounded-[24px] bg-gray-50 h-72 mb-6">
                  <img
                    src={getImageUrl(p.images?.[0])}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-8 left-8 flex flex-col gap-2">
                    {p.newArrival && (
                      <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        New Arrival
                      </span>
                    )}
                    {p.trending && (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Trending
                      </span>
                    )}
                  </div>
                </Link>

                <div className="px-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-teal-600 transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < Math.floor(p.averageRating || 4) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                    ))}
                    <span className="text-[10px] font-bold text-gray-400 ml-1">{p.averageRating || '4.0'} ({p.totalReviews || '12'} Reviews)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Price</span>
                      <p className="text-2xl font-black text-gray-900">{p.currency || 'NPR'} {p.price}</p>
                    </div>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if ((p.variants && p.variants.length > 0) || (p.sizes && p.sizes.length > 0)) {
                          router.push(`/products/${p._id}`);
                          return;
                        }
                        const { addToCart } = await import("@/src/Services/cartUtils");
                        const result = await addToCart(p);
                        if (result.success) {
                          alert(result.message);
                        } else {
                          alert(`Error: ${result.message}`);
                        }
                      }}
                      className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center transition-all duration-300 hover:bg-teal-500 hover:shadow-[0_10px_20px_rgba(20,184,166,0.3)] active:scale-95"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 group text-xl font-black text-gray-900 border-b-4 border-teal-500 pb-1 hover:text-teal-600 transition-all"
          >
            DISCOVER ALL GEAR <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Elite Rentals Section */}
      {rentalProducts.length > 0 && (
        <section className="py-12 bg-gray-900 overflow-hidden relative transition-all duration-1000">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
              <div className="max-w-2xl">
                <span className="text-teal-400 font-black uppercase tracking-[0.2em] mb-4 block">Flexibility & Performance</span>
                <h2 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
                  ELITE <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-outline-2">RENTALS</span>
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Access professional-grade sports equipment without the long-term commitment. Perfect for tournaments, seasonal training, or trial periods.
                </p>
              </div>
              <Link href="/products?isRentable=true" className="mt-10 md:mt-0 flex items-center gap-3 text-white font-bold group">
                <span className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-teal-500 transition-colors">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                VIEW ALL RENTALS
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rentalProducts.slice(0, 3).map((p: any) => (
                <div key={p._id} className="group bg-gray-800/50 backdrop-blur-md rounded-[40px] border border-gray-700/50 p-6 transition-all duration-500 hover:border-teal-500/50">
                  <Link href={`/products/${p._id}`} className="block relative aspect-[4/5] rounded-[32px] overflow-hidden mb-8">
                    <img
                      src={getImageUrl(p.images?.[0])}
                      alt={p.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <div>
                        <p className="text-teal-400 font-bold text-sm mb-1">Starting from</p>
                        <p className="text-2xl font-black text-white">{p.currency || 'NPR'} {p.rentalPrice?.daily}<span className="text-xs text-gray-400 font-normal ml-1">/ day</span></p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] text-white font-black uppercase tracking-widest border border-white/10">
                        Gear Rental
                      </div>
                    </div>
                  </Link>
                  <div className="px-2">
                    <h3 className="text-2xl font-bold text-white mb-4">{p.title}</h3>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${p._id}`}
                        className="flex-1 py-4 bg-teal-500 text-gray-900 rounded-2xl font-black text-center text-sm transition-all hover:bg-teal-400 active:scale-95"
                      >
                        BOOK NOW
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grassroots Support & Donation Section */}
      <section className="pt-8 pb-16 relative overflow-hidden bg-white transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[64px] overflow-hidden bg-gray-950 min-h-[500px] flex items-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
            {/* Background Image with Parallax-like feel */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 scale-105"
              style={{ backgroundImage: "url('/donation-bg.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/40 to-transparent"></div>

            <div className="relative z-20 p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full reveal opacity-0 transition-all duration-1000">
              <div className="space-y-10">
                <span className="inline-block px-4 py-2 rounded-full bg-teal-500/20 backdrop-blur-md text-teal-400 text-xs font-black uppercase tracking-[0.3em] border border-teal-500/30">
                  Social Impact
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                  GRASSROOTS <br />
                  <span className="text-teal-500 italic">SUPPORT</span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed max-w-md">
                  Every piece of gear tells a story. Your contributions help us provide authentic sports equipment to young athletes in underserved communities.
                </p>

                {/* Stats Glass Card */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 max-w-md">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Goal: 1000 Kits</span>
                    <span className="text-white font-black text-2xl">72%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-8">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 w-[72%] rounded-full shadow-[0_0_20px_rgba(20,184,166,0.5)]"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-white font-black text-xl">500+</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Kits</p>
                    </div>
                    <div className="text-center border-x border-white/10">
                      <p className="text-white font-black text-xl">20+</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Pitches</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-black text-xl">5k+</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Youth</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation Selector Card */}
              <div className="bg-white/10 backdrop-blur-3xl rounded-[48px] p-10 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-8">Make an Impact</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[100, 500, 1000, 2500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleDonate(amount)}
                      className="py-4 rounded-2xl border-2 border-white/10 text-white font-black hover:bg-teal-500 hover:border-teal-500 transition-all active:scale-95"
                    >
                      RS {amount}
                    </button>
                  ))}
                </div>
                <div className="relative mb-10">
                  <input
                    type="text"
                    placeholder="Custom Amount"
                    className="w-full bg-black/40 border-2 border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-teal-500 outline-none placeholder:text-gray-600"
                  />
                </div>
                <button
                  onClick={() => handleDonate("your custom gift")}
                  className="w-full py-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-gray-900 font-black rounded-2xl shadow-xl hover:shadow-teal-500/20 active:scale-[0.98] transition-all uppercase tracking-widest"
                >
                  Donate Now
                </button>
                <p className="text-center text-gray-500 text-xs mt-6 font-medium uppercase tracking-tighter">
                  Secure encrypted transaction • 100% to grassroots
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Gear Section */}
      {recentlyViewed.length > 0 && (
        <section className="py-16 bg-white overflow-hidden transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-4xl font-black text-gray-900">RECENTLY <span className="text-teal-500">VIEWED</span></h2>
              <div className="h-0.5 flex-1 bg-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {recentlyViewed.slice(0, 5).map((p: any) => (
                <Link
                  key={`recent-${p._id}`}
                  href={`/products/${p._id}`}
                  className="group block"
                >
                  <div className="aspect-square rounded-[24px] overflow-hidden bg-gray-50 mb-4 border border-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                    <img
                      src={getImageUrl(p.images?.[0])}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 truncate px-2">{p.title}</h4>
                  <p className="text-teal-600 font-black px-2">{p.currency || 'NPR'} {p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Professional Promo Section */}
      <section className="py-16 px-6 overflow-hidden transition-all duration-1000">
        <div className="max-w-7xl mx-auto rounded-[48px] overflow-hidden bg-gray-950 relative min-h-[500px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
            style={{ backgroundImage: "url('/jersey-promo.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent z-10"></div>

          <div className="relative z-20 p-12 md:p-24 max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              PUT YOUR NAME <br />
              ON THE LINE.
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium">
              Elite jersey customization with professional thermal-press technology. Wear your identity with pride.
            </p>
            <button
              onClick={() => router.push('/products?category=jersey')}
              className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-2xl"
            >
              START CUSTOMIZING NOW
            </button>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-left">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-8">🚀</div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">ELITE LOGISTICS</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Next-day delivery available for metro areas. Track your gear with precision.
              </p>
            </div>
            <div className="text-left">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-8">🛡️</div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">PRO PROTECTION</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                12-month performance warranty on all professional gear categories.
              </p>
            </div>
            <div className="text-left">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mb-8">👑</div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">ELITE LOYALTY</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Join our MVP program for early access to limited edition drops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Epic Footer CTA */}
      <section className="relative py-24 px-6 text-center bg-gray-950 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500"></div>
        <div className="relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase italic outline-text">
            No More Excuses.
          </h2>
          <p className="text-2xl text-teal-400 font-black mb-12 tracking-[0.2em] uppercase">
            GEAR UP FOR GLORY
          </p>
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center gap-4 px-12 py-6 bg-teal-500 text-white rounded-[32px] font-black text-2xl hover:bg-white hover:text-teal-600 transition-all duration-500 shadow-[0_20px_80px_rgba(20,184,166,0.4)]"
          >
            GET THE GEAR NOW
          </button>
        </div>
      </section>
    </div>
  );
}

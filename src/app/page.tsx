'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/src/Services/axiosinstance";
import { getImageUrl } from "@/src/Services/imgUtils";

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [rentalProducts, setRentalProducts] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchRentals();
    fetchRecentGear();
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleDonate = (amount: number | string) => {
    alert(`Thank you for your generous donation of ${typeof amount === 'number' ? 'RS ' + amount : amount}! Together, we're changing grassroots sports. ❤️`);
  };

  const categories = [
    { id: "football", name: "Football", sub: "Elite Pitch Gear", icon: "⚽", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop" },
    { id: "cricket", name: "Cricket", sub: "Pro Match Kits", icon: "🏏", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070&auto=format&fit=crop" },
    { id: "basketball", name: "Basketball", sub: "Elite Court Gear", icon: "🏀", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop" },
    { id: "jersey", name: "Jerseys", sub: "Custom Team Kits", icon: "👕", img: "https://images.unsplash.com/photo-1588698943485-618828062534?q=80&w=2070&auto=format&fit=crop" },
  ];

  // Live activity ticker data
  const activities = [
    "Rohan purchased Nike Football ⚡",
    "Sita joined Elite Runners Club 🏃",
    "Hari rented a Cricket Kit 🏏",
    "Mina left a 5-star review ⭐",
    "Bikash donated NPR 1000 ❤️",
    "Priya customized her team jersey 👕",
    "Suresh booked a basketball court 🏀",
    "Anita shared a community post 📸",
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-teal-500 selection:text-white">
      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative h-[95vh] min-h-[800px] flex items-center overflow-hidden bg-black">
        {/* Animated Ambient Lights */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal-500/15 blur-[150px] rounded-full animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-teal-400/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '5s' }} />
        </div>

        {/* Background with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-100 will-change-transform"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2070&auto=format&fit=crop')",
            transform: `translateY(${scrollY * 0.15}px) scale(1.1)`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/20 z-10" />

        {/* Fine grain texture overlay */}
        <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-6 z-20 w-full pt-14">
          <div className="max-w-4xl space-y-10">
            <div className="reveal active inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-3xl shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
              <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.3em]">Nepal's Elite Sports Portal</span>
            </div>

            <h1 className="reveal active text-[80px] md:text-[120px] lg:text-[140px] font-black text-white leading-[0.78] tracking-tight hover:tracking-tighter transition-all duration-1000 uppercase">
              REDEFINE <br />
              <span className="text-gradient text-glow">PERFORMANCE.</span>
            </h1>

            <p className="reveal active text-xl md:text-2xl text-gray-400 leading-relaxed font-bold max-w-3xl border-l-[6px] border-[#00B8AE] pl-8">
              Experience the pinnacle of sports engineering. We bridge the gap between grassroots passion and professional excellence.
            </p>

            <div className="reveal active flex flex-wrap gap-6 pt-4">
              <button
                onClick={() => router.push('/products')}
                className="group relative px-12 py-5 bg-[#00B8AE] text-white rounded-2xl font-black text-lg transition-all duration-500 hover:bg-teal-400 hover:shadow-[0_25px_60px_rgba(0,184,174,0.4)] transform hover:-translate-y-2 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3 italic">
                  GEAR UP NOW <span className="text-2xl">⚡</span>
                </span>
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>

              <button
                onClick={() => router.push('/community')}
                className="px-12 py-5 bg-white/5 backdrop-blur-xl text-white border-2 border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 active:scale-95 shadow-2xl"
              >
                THE COMMUNITY
              </button>
            </div>
          </div>
        </div>

        {/* Floating Social Proof */}
        <div className="absolute bottom-16 right-12 z-20 hidden lg:block reveal active">
          <div className="glass-card-dark p-5 rounded-2xl border border-white/10 flex items-center gap-4 shadow-3xl">
             <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center font-bold text-xs text-white">U{i}</div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-black bg-teal-500 flex items-center justify-center font-bold text-xs text-black shadow-lg shadow-teal-500/40">+25k</div>
             </div>
             <div className="text-sm">
                <p className="text-white font-black">Elite Athletes</p>
                <p className="text-teal-400 font-bold text-xs">JOIN THE REVOLUTION</p>
             </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-teal-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============ LIVE ACTIVITY TICKER ============ */}
      <div className="bg-gray-950 border-b border-white/5 overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...activities, ...activities].map((activity, i) => (
            <span key={i} className="mx-8 text-sm text-gray-400 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              {activity}
            </span>
          ))}
        </div>
      </div>

      {/* ============ STATS COUNTER ============ */}
      <div className="relative z-30 -mt-0 bg-gray-950 pb-20 pt-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card-dark rounded-[40px] p-12 lg:p-16 grid grid-cols-2 lg:grid-cols-4 gap-12 border border-white/10 shadow-3xl">
            {[
              { label: "Products", value: products.length > 0 ? `${products.length}+` : "250+", color: "text-white", icon: "💎" },
              { label: "Rentals Available", value: rentalProducts.length > 0 ? `${rentalProducts.length}+` : "50+", color: "text-[#00B8AE]", icon: "🏟️" },
              { label: "Categories", value: "12+", color: "text-white", icon: "🌎" },
              { label: "Elite Clubs", value: "95+", color: "text-[#00B8AE]", icon: "🤝" }
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="text-3xl mb-3 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{stat.icon}</div>
                <p className={`text-4xl lg:text-6xl font-black mb-2 transition-transform group-hover:scale-110 ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ THE COLLECTION ============ */}
      <section className="py-28 overflow-hidden bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-12 reveal active">
            <div className="max-w-3xl">
              <div className="w-20 h-1.5 bg-[#00B8AE] mb-8 rounded-full" />
              <h2 className="text-6xl md:text-8xl font-black text-gray-950 leading-none tracking-tighter uppercase mb-4">
                THE <br />
                <span className="text-[#00B8AE] italic">COLLECTION</span>
              </h2>
            </div>
            <Link href="/products" className="group flex items-center gap-4 text-gray-900 font-black text-sm tracking-widest uppercase hover:text-[#00B8AE] transition-all">
              EXPLORE ALL DISCIPLINES
              <span className="w-14 h-14 rounded-full border-2 border-gray-900 group-hover:border-[#00B8AE] flex items-center justify-center transition-all bg-white shadow-xl">
                <span className="text-xl group-hover:translate-x-1.5 transition-transform">→</span>
              </span>
            </Link>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                onClick={() => router.push(`/products?category=${cat.id}`)}
                className="group relative h-[550px] rounded-[40px] overflow-hidden cursor-pointer shadow-xl transition-all duration-700 hover:-translate-y-3 hover:shadow-teal-500/20"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent z-10 transition-opacity group-hover:opacity-90" />

                <div className="absolute bottom-10 left-10 z-20">
                  <p className="text-teal-400 font-black text-3xl mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">{cat.icon}</p>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-1 group-hover:text-[#00B8AE] transition-colors">{cat.name}</h3>
                  <p className="text-gray-400 font-bold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 delay-100">{cat.sub}</p>
                  <div className="w-10 h-1 bg-[#00B8AE] rounded-full group-hover:w-full transition-all duration-700 mt-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS (REAL DATA) ============ */}
      {products.length > 0 && (
        <section className="py-28 bg-white" ref={featuredRef}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-teal-600 text-[10px] font-black uppercase tracking-[0.2em]">Fresh Drops</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-gray-950 leading-none tracking-tighter uppercase">
                  TRENDING <span className="text-[#00B8AE] italic">NOW</span>
                </h2>
              </div>
              <Link href="/products" className="text-gray-900 font-black text-xs tracking-widest uppercase hover:text-[#00B8AE] transition-colors flex items-center gap-3">
                VIEW ALL <span className="text-lg">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product: any, i: number) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group block"
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="relative aspect-[3/4] rounded-[28px] overflow-hidden bg-gray-100 mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Quick view overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="bg-white/95 backdrop-blur-md rounded-xl py-2.5 text-center font-bold text-gray-900 text-sm shadow-xl">
                        Quick View →
                      </div>
                    </div>

                    {/* Tags */}
                    {product.isNewArrival && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-teal-500 text-white text-[10px] font-black uppercase rounded-full tracking-wider">
                        NEW
                      </div>
                    )}
                    {product.discount > 0 && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-full tracking-wider">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="px-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                      {product.category || product.brand || 'Sports'}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-1.5 truncate group-hover:text-[#00B8AE] transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-[#00B8AE] font-black text-lg">{product.currency || 'NPR'} {product.price?.toLocaleString()}</p>
                      {product.costPrice && product.costPrice > product.price && (
                        <p className="text-gray-400 text-sm line-through">{product.costPrice?.toLocaleString()}</p>
                      )}
                    </div>
                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className="flex">
                          {[...Array(5)].map((_, si) => (
                            <span key={si} className={`text-xs ${si < Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">({product.numReviews || 0})</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ ELITE RENTALS ============ */}
      {rentalProducts.length > 0 && (
        <section className="py-28 bg-gray-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00B8AE]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-12 reveal active">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-5">
                  <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">Flexibility & Performance</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-tight uppercase">
                  ELITE <br /><span className="text-gradient text-glow">RENTALS</span>
                </h2>
              </div>
              <Link href="/products?isRentable=true" className="group flex items-center gap-4 text-white font-black text-xs tracking-widest uppercase hover:text-teal-400 transition-colors">
                VIEW ALL RENTALS <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentalProducts.slice(0, 3).map((p: any) => (
                <div key={p._id} className="group reveal active bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10 p-5 transition-all duration-700 hover:border-[#00B8AE]/30 hover:bg-white/10">
                  <Link href={`/products/${p._id}`} className="block relative aspect-[4/5] rounded-[30px] overflow-hidden mb-6">
                    <img
                      src={getImageUrl(p.images?.[0])}
                      alt={p.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-5 left-5 right-5">
                        <p className="text-[#00B8AE] font-black text-xs uppercase tracking-widest mb-1">Rental</p>
                        <p className="text-xl font-black text-white leading-none">{p.currency || 'NPR'} {p.rentalPrice?.daily}<span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">/ day</span></p>
                    </div>
                  </Link>
                  <h3 className="text-xl font-black text-white mb-5 uppercase tracking-tight truncate">{p.title}</h3>
                  <button
                    onClick={() => router.push(`/products/${p._id}`)}
                    className="w-full py-3.5 bg-white text-black rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-500 hover:bg-[#00B8AE] hover:text-white"
                  >
                    BOOK GEAR NOW
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ GRASSROOTS DONATION ============ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[50px] overflow-hidden bg-gray-950 shadow-2xl relative p-10 md:p-20 flex flex-col lg:flex-row gap-14 items-center">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/90 to-teal-950/80" />

             <div className="relative z-10 flex-1 space-y-7">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-teal-400 text-[10px] font-black uppercase tracking-widest">Grassroots Initiative</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                  GIVING BACK <br />
                  <span className="text-[#00B8AE] italic">TO THE GAME</span>
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed font-bold max-w-lg">Your contributions fund professional equipment for youth athletes across Nepal.</p>
                <div className="grid grid-cols-3 gap-4 pt-2">
                   {[
                     { val: "500+", label: "Kits" },
                     { val: "20+", label: "Places" },
                     { val: "5K+", label: "Youth" },
                   ].map((s, i) => (
                     <div key={i} className="text-center bg-white/5 p-5 rounded-2xl border border-white/10">
                        <p className="text-3xl font-black text-white mb-0.5">{s.val}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
                     </div>
                   ))}
                </div>
             </div>

             <div className="relative z-10 w-full lg:w-[380px]">
                <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-8 border border-white/20 shadow-2xl">
                   <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tighter">Donate Now</h3>
                   <div className="grid grid-cols-2 gap-3 mb-8">
                      {[100, 500, 1000, 2500].map(amt => (
                         <button key={amt} onClick={() => handleDonate(amt)} className="py-4 rounded-xl border border-white/10 bg-white/5 text-white font-black hover:bg-[#00B8AE] hover:border-teal-400 transition-all text-sm">RS {amt}</button>
                      ))}
                   </div>
                   <button onClick={() => handleDonate("your gift")} className="w-full py-5 bg-[#00B8AE] text-white font-black rounded-xl shadow-xl hover:shadow-teal-500/40 hover:bg-teal-400 transition-all text-sm tracking-wider">GIVE THE GIFT OF SPORT</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ============ RECENTLY VIEWED ============ */}
      {recentlyViewed.length > 0 && (
        <section className="py-20 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-black text-gray-950 uppercase italic">Back on your radar</h2>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{recentlyViewed.length} items</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {recentlyViewed.slice(0, 5).map((p: any) => (
                <Link key={p._id} href={`/products/${p._id}`} className="group">
                  <div className="aspect-square rounded-[24px] overflow-hidden bg-white mb-4 border border-gray-200 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                    <img src={getImageUrl(p.images?.[0])} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1s]" />
                  </div>
                  <h4 className="font-bold text-gray-900 truncate px-1 text-sm">{p.title}</h4>
                  <p className="text-[#00B8AE] font-black px-1">{p.currency || 'NPR'} {p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ JERSEY PROMO ============ */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto rounded-[50px] overflow-hidden bg-gray-950 relative min-h-[500px] flex items-center shadow-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547941126-3d5322b218b0?q=80&w=1974&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent z-10" />
          <div className="relative z-20 p-10 md:p-24 max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[0.85] uppercase tracking-tighter">
              BEYOND THE <br />
              <span className="text-gradient text-glow italic">APPAREL.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-bold max-w-2xl">Elite jersey customization with professional thermal-press technology.</p>
            <button
              onClick={() => router.push('/products?category=jersey')}
              className="px-14 py-6 bg-white text-black rounded-[20px] font-black text-lg hover:bg-[#00B8AE] hover:text-white transition-all duration-500 shadow-xl"
            >
              START CUSTOMIZING NOW
            </button>
          </div>
        </div>
      </section>

      {/* ============ TRUST PILLARS ============ */}
      <section className="bg-white py-28 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { title: "ELITE DELIVERY", desc: "Express logistics across all major districts.", color: "bg-teal-500", icon: "🚀" },
              { title: "PRO WARRANTY", desc: "12-month performance guarantee.", color: "bg-blue-500", icon: "🛡️" },
              { title: "INSIDER ACCESS", desc: "Join our pro-tier for early drops.", color: "bg-[#00B8AE]", icon: "🔑" }
            ].map((pillar, i) => (
              <div key={i} className="group relative text-center md:text-left">
                <div className="text-4xl mb-6">{pillar.icon}</div>
                <div className={`w-14 h-14 rounded-2xl ${pillar.color} mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-xl opacity-80`} />
                <h3 className="text-2xl font-black text-gray-950 mb-4 uppercase tracking-tighter">{pillar.title}</h3>
                <p className="text-lg text-gray-500 font-medium italic">{pillar.desc}</p>
                <div className="h-1 w-0 bg-gray-900 group-hover:w-full transition-all duration-1000 mt-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER CTA ============ */}
      <section className="relative py-40 px-6 text-center bg-gray-950 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#00B8AE]/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-14 reveal active">
          <h2 className="text-[72px] md:text-[120px] lg:text-[150px] font-black text-white tracking-tighter uppercase italic leading-[0.7] mb-5">
            LEAVE <br />
            <span className="text-gradient text-glow">A LEGACY</span>
          </h2>
          <button
            onClick={() => router.push('/products')}
            className="group inline-flex items-center gap-6 px-16 py-7 bg-white text-black rounded-full font-black text-xl uppercase tracking-[0.2em] transition-all duration-700 hover:bg-[#00B8AE] hover:text-white transform hover:-translate-y-3 shadow-2xl"
          >
            STEP INTO THE ARENA
            <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/src/Services/axiosinstance";
import { getImageUrl } from "@/src/Services/imgUtils";

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
    // Force all reveal elements active
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
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

  return (
    <div className="min-h-screen bg-white selection:bg-teal-500 selection:text-white">
      {/* Cinematic Hero */}
      <section className="relative h-[90vh] min-h-[750px] flex items-center overflow-hidden bg-black">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-[#00B8AE]/5 z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/20 blur-[120px] rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Ultra Premium Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-100 transition-transform duration-[20000ms] ease-linear hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/20 z-10"></div>

        <div className="relative max-w-7xl mx-auto px-6 z-20 w-full pt-14">
          <div className="max-w-4xl space-y-10">
            <div className="reveal active inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-3xl shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></span>
              <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.3em]">Nepal's Elite Sports Portal</span>
            </div>
            
            <h1 className="reveal active text-[100px] md:text-[140px] font-black text-white leading-[0.75] tracking-tight hover:tracking-tighter transition-all duration-1000 uppercase">
              REDEFINE <br />
              <span className="text-gradient text-glow">PERFORMANCE.</span>
            </h1>
            
            <p className="reveal active text-2xl md:text-3xl text-gray-400 leading-relaxed font-bold max-w-3xl border-l-[6px] border-[#00B8AE] pl-8">
              Experience the pinnacle of sports engineering. We bridge the gap between grassroots passion and professional excellence.
            </p>

            <div className="reveal active flex flex-wrap gap-8 pt-6">
              <button
                onClick={() => router.push('/products')}
                className="group relative px-14 py-6 bg-[#00B8AE] text-white rounded-2xl font-black text-xl transition-all duration-500 hover:bg-teal-400 hover:shadow-[0_25px_60px_rgba(0,184,174,0.4)] transform hover:-translate-y-2 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3 italic">
                  GEAR UP NOW <span className="text-2xl">⚡</span>
                </span>
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>

              <button
                onClick={() => router.push('/community')}
                className="px-14 py-6 bg-white/5 backdrop-blur-xl text-white border-2 border-white/10 rounded-2xl font-black text-xl hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 active:scale-95 shadow-2xl"
              >
                THE COMMUNITY
              </button>
            </div>
          </div>
        </div>

        {/* Floating Social Proof */}
        <div className="absolute bottom-12 right-12 z-20 hidden lg:block reveal active">
          <div className="glass-card-dark p-6 rounded-3xl border border-white/10 flex items-center gap-5 shadow-3xl">
             <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center font-bold text-xs text-white">U{i}</div>
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-black bg-teal-500 flex items-center justify-center font-bold text-xs text-black shadow-lg shadow-teal-500/40">+25k</div>
             </div>
             <div className="text-sm">
                <p className="text-white font-black">Elite Athletes</p>
                <p className="text-teal-400 font-bold text-xs">JOIN THE REVOLUTION</p>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <div className="relative z-30 -mt-20 max-w-7xl mx-auto px-6">
        <div className="glass-card-dark rounded-[50px] p-16 grid grid-cols-2 lg:grid-cols-4 gap-16 border border-white/10 shadow-3xl">
          {[
            { label: "Elite Gear", value: "2.5K+", color: "text-white", icon: "💎" },
            { label: "Pro Venues", value: "150+", color: "text-[#00B8AE]", icon: "🏟️" },
            { label: "Global Reach", value: "12+", color: "text-white", icon: "🌎" },
            { label: "Elite Clubs", value: "95+", color: "text-[#00B8AE]", icon: "🤝" }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${i*0.5}s` }}>{stat.icon}</div>
              <p className={`text-5xl lg:text-7xl font-black mb-3 transition-transform group-hover:scale-110 ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* THE COLLECTION */}
      <section className="py-32 overflow-hidden bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 reveal active">
            <div className="max-w-3xl">
              <div className="w-24 h-2 bg-[#00B8AE] mb-10 rounded-full"></div>
              <h2 className="text-7xl md:text-[100px] font-black text-gray-950 leading-none tracking-tighter uppercase mb-4">
                THE <br />
                <span className="text-[#00B8AE] italic">COLLECTION</span>
              </h2>
            </div>
            <Link href="/products" className="group flex items-center gap-5 text-gray-900 font-black text-sm tracking-widest uppercase hover:text-[#00B8AE] transition-all">
              EXPLORE ALL DISCIPLINES
              <span className="w-16 h-16 rounded-full border-2 border-gray-900 group-hover:border-[#00B8AE] flex items-center justify-center transition-all bg-white shadow-xl">
                <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
              </span>
            </Link>
          </div>

          {/* Large Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                onClick={() => router.push(`/products?category=${cat.id}`)}
                className="group relative h-[600px] rounded-[50px] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:shadow-teal-500/20"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
                
                <div className="absolute bottom-12 left-12 z-20">
                  <p className="text-teal-400 font-black text-4xl mb-3 opacity-0 group-hover:opacity-100 transition-all">{cat.icon}</p>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-[#00B8AE] transition-colors">{cat.name}</h3>
                  <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">{cat.sub}</p>
                  <div className="w-12 h-1.5 bg-[#00B8AE] rounded-full group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elite Rentals Section (Restored) */}
      {rentalProducts.length > 0 && (
        <section className="py-32 bg-gray-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00B8AE]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12 reveal active">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
                  <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">Flexibility & Performance</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tight uppercase">
                  ELITE <br /><span className="text-gradient text-glow">RENTALS</span>
                </h2>
              </div>
              <Link href="/products?isRentable=true" className="group flex items-center gap-4 text-white font-black text-xs tracking-widest uppercase">
                VIEW ALL RENTALS
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {rentalProducts.slice(0, 3).map((p: any) => (
                <div key={p._id} className="group reveal active bg-white/5 backdrop-blur-md rounded-[48px] border border-white/10 p-6 transition-all duration-700 hover:border-[#00B8AE]/30">
                  <Link href={`/products/${p._id}`} className="block relative aspect-[4/5] rounded-[36px] overflow-hidden mb-8">
                    <img
                      src={getImageUrl(p.images?.[0])}
                      alt={p.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-[#00B8AE] font-black text-xs uppercase tracking-widest mb-1">Rental</p>
                        <p className="text-2xl font-black text-white leading-none">{p.currency || 'NPR'} {p.rentalPrice?.daily}<span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">/ day</span></p>
                    </div>
                  </Link>
                  <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight truncate">{p.title}</h3>
                  <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-500 hover:bg-[#00B8AE] hover:text-white">BOOK GEAR NOW</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grassroots Support & Donation (Restored) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[60px] overflow-hidden bg-gray-950 shadow-2xl relative p-12 md:p-24 flex flex-col lg:flex-row gap-16 items-center">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/90 to-teal-950/80"></div>
             
             <div className="relative z-10 flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  <span className="text-teal-400 text-[10px] font-black uppercase tracking-widest">Grassroots Initiative</span>
                </div>
                <h2 className="text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                  GIVING BACK <br />
                  <span className="text-[#00B8AE] italic">TO THE GAME</span>
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed font-bold">Your contributions fund professional equipment for youth athletes across Nepal.</p>
                <div className="grid grid-cols-3 gap-6 pt-4">
                   <div className="text-center bg-white/5 p-6 rounded-3xl border border-white/10">
                      <p className="text-4xl font-black text-white mb-1">500+</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kits</p>
                   </div>
                   <div className="text-center bg-white/5 p-6 rounded-3xl border border-white/10">
                      <p className="text-4xl font-black text-white mb-1">20+</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Places</p>
                   </div>
                   <div className="text-center bg-white/5 p-6 rounded-3xl border border-white/10">
                      <p className="text-4xl font-black text-white mb-1">5K+</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Youth</p>
                   </div>
                </div>
             </div>

             <div className="relative z-10 w-full lg:w-[400px]">
                <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-10 border border-white/20 shadow-2xl">
                   <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter">Donate Now</h3>
                   <div className="grid grid-cols-2 gap-4 mb-10">
                      {[100, 500, 1000, 2500].map(amt => (
                         <button key={amt} onClick={() => handleDonate(amt)} className="py-5 rounded-2xl border border-white/10 bg-white/5 text-white font-black hover:bg-[#00B8AE] transition-all">RS {amt}</button>
                      ))}
                   </div>
                   <button onClick={() => handleDonate("your gift")} className="w-full py-6 bg-[#00B8AE] text-white font-black rounded-2xl shadow-xl hover:shadow-teal-500/40">GIVE THE GIFT OF SPORT</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Gear (Restored) */}
      {recentlyViewed.length > 0 && (
        <section className="py-24 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-gray-950 mb-16 uppercase italic">Back on your radar</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
              {recentlyViewed.slice(0, 5).map((p: any) => (
                <Link key={p._id} href={`/products/${p._id}`} className="group">
                  <div className="aspect-square rounded-[32px] overflow-hidden bg-white mb-6 border border-gray-200 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                    <img src={getImageUrl(p.images?.[0])} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1s]" />
                  </div>
                  <h4 className="font-bold text-gray-900 truncate px-2">{p.title}</h4>
                  <p className="text-[#00B8AE] font-black px-2">{p.currency || 'NPR'} {p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Jersey Promo Section (Restored) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto rounded-[60px] overflow-hidden bg-gray-950 relative min-h-[550px] flex items-center shadow-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547941126-3d5322b218b0?q=80&w=1974&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent z-10"></div>
          <div className="relative z-20 p-12 md:p-32 max-w-4xl">
            <h2 className="text-6xl md:text-[80px] font-black text-white mb-10 leading-[0.85] uppercase tracking-tighter">
              BEYOND THE <br />
              <span className="text-gradient text-glow italic">APPAREL.</span>
            </h2>
            <p className="text-2xl text-gray-400 mb-12 leading-relaxed font-bold max-w-2xl">Elite jersey customization with professional thermal-press technology.</p>
            <button
              onClick={() => router.push('/products?category=jersey')}
              className="px-16 py-7 bg-white text-black rounded-[24px] font-black text-xl hover:bg-[#00B8AE] hover:text-white transition-all duration-500"
            >
              START CUSTOMIZING NOW
            </button>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="bg-white py-32 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {[
              { title: "ELITE DELIVERY", desc: "Express logistics across all major districts.", color: "bg-teal-500" },
              { title: "PRO WARRANTY", desc: "12-month performance guarantee.", color: "bg-blue-500" },
              { title: "INSIDER ACCESS", desc: "Join our pro-tier for early drops.", color: "bg-[#00B8AE]" }
            ].map((pillar, i) => (
              <div key={i} className="group relative">
                <div className={`w-16 h-16 rounded-3xl ${pillar.color} mb-12 rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-xl`}></div>
                <h3 className="text-3xl font-black text-gray-950 mb-6 uppercase tracking-tighter">{pillar.title}</h3>
                <p className="text-xl text-gray-500 font-medium italic">{pillar.desc}</p>
                <div className="h-1.5 w-0 bg-gray-900 group-hover:w-full transition-all duration-1000 mt-10 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-48 px-6 text-center bg-gray-950 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#00B8AE]/10 blur-[180px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 space-y-16 reveal active">
          <h2 className="text-[100px] md:text-[160px] font-black text-white tracking-tighter uppercase italic leading-[0.7] mb-5">
            LEAVE <br />
            <span className="text-gradient text-glow">A LEGACY</span>
          </h2>
          <button
            onClick={() => router.push('/products')}
            className="group inline-flex items-center gap-10 px-20 py-8 bg-white text-black rounded-full font-black text-2xl uppercase tracking-[0.3em] transition-all duration-700 hover:bg-[#00B8AE] hover:text-white transform hover:-translate-y-4 shadow-2xl"
          >
            STEP INTO THE ARENA
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

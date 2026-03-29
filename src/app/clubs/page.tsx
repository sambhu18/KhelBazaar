"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/Services/axiosinstance";

export default function ClubsDirectory() {
  const router = useRouter();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axiosInstance.get("/api/clubs");
      setClubs(response.data);
    } catch (error) {
      console.error("Failed to fetch clubs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px]">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center overflow-hidden bg-black mx-6 rounded-[40px] shadow-2xl mb-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 transition-transform duration-[10000ms] ease-linear scale-105 hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2072&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

        <div className="relative max-w-7xl mx-auto px-12 z-20 w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-xl mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">Verified Partners</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tight uppercase mb-4">
            ELITE <span className="text-gradient text-glow italic">CLUBS</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto mb-8">
            Discover and connect with top-tier athletic clubs providing professional gear, services, and events.
          </p>
          <button
            onClick={() => router.push("/clubs/dashboard")}
            className="px-8 py-3 bg-[#00B8AE] hover:bg-teal-400 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-xl hover:-translate-y-1"
          >
            Club Owner Dashboard →
          </button>
        </div>
      </section>

      {/* Directory Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#00B8AE] rounded-full animate-spin" />
          </div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-6xl mb-4">🏟️</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Clubs Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are currently no registered clubs. Become the first to establish an elite presence on KhelBazar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club) => (
              <div key={club._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2 flex flex-col">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {club.bannerUrl ? (
                    <img
                      src={club.bannerUrl}
                      alt={club.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-900 to-gray-900 flex items-center justify-center">
                      <span className="text-6xl opacity-30">🏆</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white truncate">{club.name}</h3>
                      <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mt-1">Official Club</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {club.description || "An elite sports club offering premium goods and services to professional athletes and enthusiasts alike."}
                  </p>
                  <Link
                    href={`/community?tab=marketplace`}
                    className="w-full py-3.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest text-center hover:bg-[#00B8AE] hover:text-white hover:border-[#00B8AE] transition-all"
                  >
                    View Club Goods
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

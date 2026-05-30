"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/src/Services/axiosinstance";

export default function PlayerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlayerProfile();
    }
  }, [id]);

  const fetchPlayerProfile = async () => {
    try {
      // Typically we'd fetch community profile details. Currently just a placeholder.
      await new Promise(resolve => setTimeout(resolve, 500));
      setPlayer({ 
        _id: id, 
        name: "Community Member", 
        role: "Player", 
        bio: "An active sports enthusiast on KhelBazar.",
        joined: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to load player profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#00B8AE] rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Profile Not Found</h1>
        <button onClick={() => router.back()} className="px-6 py-2 bg-[#00B8AE] text-white rounded-lg font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-24 px-6 relative">
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-gray-950 to-gray-800" />
        <div className="px-10 pb-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl shadow-xl shrink-0">
               🏃
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-gray-900">{player.name}</h1>
              <p className="text-[#00B8AE] font-bold text-sm tracking-widest uppercase">{player.role}</p>
            </div>
          </div>
          <div className="space-y-4">
             <h3 className="font-bold text-gray-900 text-lg uppercase">Biography</h3>
             <p className="text-gray-600 leading-relaxed font-medium">{player.bio}</p>
             <p className="text-gray-400 text-sm mt-4">Joined {new Date(player.joined).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

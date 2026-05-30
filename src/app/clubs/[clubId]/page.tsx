"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/src/Services/axiosinstance";

export default function ClubDetailsPage() {
  const { clubId } = useParams();
  const router = useRouter();
  const [club, setClub] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clubId) {
      fetchClubData();
    }
  }, [clubId]);

  const fetchClubData = async () => {
    try {
      // In a real scenario, you'd fetch the specific club details first.
      const postsRes = await axiosInstance.get(`/api/club-posts?clubId=${clubId}`);
      setPosts(postsRes.data || []);
      
      const clubsRes = await axiosInstance.get("/api/clubs");
      const foundClub = clubsRes.data.find((c: any) => c._id === clubId);
      setClub(foundClub);

    } catch (error) {
      console.error("Failed to fetch club data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
         <div className="w-12 h-12 border-4 border-gray-200 border-t-[#00B8AE] rounded-full animate-spin" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center pt-20 px-6">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Club Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The club you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/clubs')} className="px-8 py-3 bg-[#00B8AE] text-white rounded-xl font-bold">Return to Directory</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px] pb-24">
      {/* Club Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative h-[300px] w-full rounded-3xl overflow-hidden bg-gray-900 shadow-xl">
           {club.bannerUrl ? (
             <img src={club.bannerUrl} alt={club.name} className="w-full h-full object-cover opacity-70" />
           ) : (
             <div className="w-full h-full bg-gradient-to-r from-teal-900 to-gray-900 flex items-center justify-center opacity-80" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
           <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
             <div>
                <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">Official Club</p>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase">{club.name}</h1>
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-black text-gray-900 uppercase mb-4">About</h3>
             <p className="text-gray-600 text-sm leading-relaxed">{club.description || "No description provided."}</p>
           </div>
        </div>

        {/* Right Col: Products/Posts */}
        <div className="lg:col-span-2">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-2xl font-black text-gray-900 uppercase">Live Assets</h3>
             <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">{posts.length} Items</span>
           </div>
           
           {posts.length === 0 ? (
             <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">This club hasn't uploaded any assets yet.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                  <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                       {post.images?.[0] ? (
                         <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-300">#</div>
                       )}
                       <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase text-gray-800">
                         {post.postType}
                       </div>
                    </div>
                    <div className="p-5">
                       <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">{post.title}</h4>
                       <p className="text-gray-500 text-xs mb-4 line-clamp-2">{post.description}</p>
                       <div className="flex justify-between items-center">
                          <span className="font-black text-[#00B8AE]">{post.price > 0 ? `NPR ${post.price}` : 'Free'}</span>
                          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-[#00B8AE] transition-colors">Details</button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

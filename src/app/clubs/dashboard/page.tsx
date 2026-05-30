"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/Services/axiosinstance";

export default function ClubDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, upload, manage
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    clubId: "",
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    postType: "goods",
    images: [] as File[],
    imagePreviews: [] as string[],
    tags: "",
    specifications: {
      condition: "new",
      size: "",
      color: "",
      material: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsRes, clubsRes] = await Promise.all([
        axiosInstance.get("/api/club-posts?status=active"),
        axiosInstance.get("/api/clubs")
      ]);
      setPosts(postsRes.data || []);
      
      // Auto-select first club for the form if user is club owner
      const clubList = clubsRes.data || [];
      setClubs(clubList);
      if (clubList.length > 0) {
        setFormData(prev => ({ ...prev, clubId: clubList[0]._id }));
      }
    } catch (error: any) {
      console.error("Failed to fetch dashboard data");
      setErrorMsg("Failed to load dashboard data. Please log in.");
    } finally {
      setLoading(false);
    }
  };

  // Metrics calculation
  const metrics = {
    totalPosts: posts.length,
    totalGoods: posts.filter(p => p.postType === "goods").length,
    totalServices: posts.filter(p => p.postType === "service").length,
    totalEvents: posts.filter(p => p.postType === "event").length,
    totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
    totalComments: posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 4 - formData.images.length);
    const updatedFiles = [...formData.images, ...newFiles].slice(0, 4);
    
    // Revoke old previews
    formData.imagePreviews.forEach(url => URL.revokeObjectURL(url));
    const newPreviews = updatedFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev, 
      images: updatedFiles,
      imagePreviews: newPreviews
    }));
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(formData.imagePreviews[index]);
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.clubId || !formData.title || !formData.category) {
      setErrorMsg("Please fill in all required fields: Club, Title, Category");
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append("clubId", formData.clubId);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("postType", formData.postType);
      submitData.append("category", formData.category);
      submitData.append("price", formData.price || "0");
      submitData.append("quantity", formData.quantity || "1");
      submitData.append("tags", formData.tags);
      submitData.append("specifications", JSON.stringify(formData.specifications));

      formData.images.forEach((file) => {
        submitData.append("images", file);
      });

      if (editingId) {
        await axiosInstance.put(`/api/club-posts/${editingId}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Product updated successfully! ⚡");
      } else {
        await axiosInstance.post("/api/club-posts", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Product uploaded to marketplace successfully! 🎉");
      }

      resetForm();
      fetchData();
      setActiveTab("manage");
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.msg || "Failed to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      title: "",
      description: "",
      category: "",
      price: "",
      quantity: "",
      postType: "goods",
      images: [],
      imagePreviews: [],
      tags: "",
      specifications: { condition: "new", size: "", color: "", material: "" },
    }));
    setEditingId(null);
  };

  const handleEdit = (post: any) => {
    setFormData({
      clubId: post.clubId?._id || formData.clubId,
      title: post.title,
      description: post.description || "",
      category: post.category,
      price: post.price?.toString() || "",
      quantity: post.quantity?.toString() || "",
      postType: post.postType || "goods",
      images: [],
      imagePreviews: post.images || [], // Load existing URLs as previews initially
      tags: post.tags?.join(", ") || "",
      specifications: post.specifications || { condition: "new", size: "", color: "", material: "" },
    });
    setEditingId(post._id);
    setActiveTab("upload");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing? It cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/api/club-posts/${id}`);
      setSuccessMsg("Listing deleted permanently.");
      fetchData();
    } catch (error: any) {
      setErrorMsg("Failed to delete post.");
    }
  };

  if (loading && !posts.length) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[120px] pb-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#00B8AE] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px] pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Dashboard Frame */}
        <div className="bg-gray-950 rounded-[40px] p-10 md:p-14 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00B8AE]/15 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">Partner Central</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight">
                CLUB <span className="text-[#00B8AE] italic">DASHBOARD</span>
              </h1>
              <p className="text-gray-400 font-bold max-w-lg mt-3">
                Command center. Track analytics, configure storefronts, and upload premium gear to the community marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hidden-scrollbar">
          {[
            { id: "overview", label: "📊 Analytics", desc: "Performance overview" },
            { id: "upload", label: "✨ New Upload", desc: "List goods & events" },
            { id: "manage", label: "⚙️ Manage Assets", desc: "Edit directories" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start p-4 rounded-2xl border min-w-[200px] transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white border-[#00B8AE] shadow-[0_10px_40px_rgba(0,184,174,0.15)] ring-2 ring-[#00B8AE]/20"
                  : "bg-white border-gray-100 shadow-sm text-gray-500 hover:border-gray-300"
              }`}
            >
              <span className={`text-lg font-black mb-1 ${activeTab === tab.id ? "text-gray-900" : "text-gray-500"}`}>
                {tab.label}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === tab.id ? "text-teal-600" : "text-gray-400"}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Global Messages */}
        {successMsg && (
          <div className="mb-8 p-5 bg-teal-50 border border-teal-200 rounded-2xl flex items-center gap-3 animate-fade-in">
            <span className="text-xl">✅</span>
            <p className="text-teal-800 font-bold">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-fade-in">
            <span className="text-xl">⚠️</span>
            <p className="text-red-800 font-bold">{errorMsg}</p>
          </div>
        )}

        {/* TAB: OVERVIEW ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Assets", val: metrics.totalPosts, icon: "📦" },
                { label: "Community Likes", val: metrics.totalLikes, icon: "❤️" },
                { label: "Discussions", val: metrics.totalComments, icon: "💬" },
                { label: "Marketplace Goods", val: metrics.totalGoods, icon: "🛍️" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-teal-50 transition-colors">
                    {stat.icon}
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-1">{stat.val}</p>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900 uppercase">Recent Engagements</h3>
                  <button onClick={() => setActiveTab("manage")} className="text-[#00B8AE] font-bold text-sm tracking-wider uppercase">View All →</button>
                </div>
                {posts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">No data yet</p>
                    <button onClick={() => setActiveTab("upload")} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider">Upload First Item</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.slice(0, 5).map(post => (
                      <div key={post._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          {post.images?.[0] ? (
                            <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">#</div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-gray-900 truncate">{post.title}</p>
                          <div className="flex gap-3 text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                            <span className="text-[#00B8AE]">{post.postType}</span>
                            <span>{post.likes || 0} Likes</span>
                            <span>{post.comments?.length || 0} Comments</span>
                          </div>
                        </div>
                        <div className="font-black text-gray-900">
                          {post.currency || 'NPR'} {post.price}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-950 p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B8AE]/20 blur-[50px] rounded-full" />
                <h3 className="text-xl font-black mb-6 uppercase">Pro Tips ⚡</h3>
                <ul className="space-y-6 relative z-10">
                  <li className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">📸</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1 text-teal-400">High Quality Imagery</h4>
                      <p className="text-sm text-gray-400">Posts with 3+ clean images receive 40% more engagement.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">🏷️</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1 text-teal-400">Accurate Specs</h4>
                      <p className="text-sm text-gray-400">Always list exact sizing and material to reduce bounce rate.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">💬</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1 text-teal-400">Active Replies</h4>
                      <p className="text-sm text-gray-400">Reply to post comments directly in the community hub.</p>
                    </div>
                  </li>
                </ul>
                <button onClick={() => router.push('/community?tab=marketplace')} className="w-full py-4 mt-8 bg-white/10 hover:bg-[#00B8AE] transition-colors rounded-xl font-bold uppercase tracking-widest text-xs">View Marketplace</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: NEW UPLOAD & EDIT */}
        {activeTab === "upload" && (
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 animate-fade-in relative overflow-hidden">
             
            <div className="max-w-4xl mx-auto">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                    {editingId ? "Update Listing ⚙️" : "New Market Upload 🚀"}
                  </h2>
                  <p className="text-gray-500 font-medium">Broadcast premium gear and services to the entire ecosystem.</p>
                </div>
                {editingId && (
                  <button onClick={() => {resetForm(); setActiveTab("upload");}} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors">
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Core Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Select Club */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Origin Club *</label>
                    <select
                      name="clubId"
                      value={formData.clubId}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-[#00B8AE] outline-none transition-all font-semibold text-gray-800"
                      required
                    >
                      <option value="" disabled>Select your storefront</option>
                      {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Post Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Asset Type *</label>
                    <select
                      name="postType"
                      value={formData.postType}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-[#00B8AE] outline-none transition-all font-semibold text-gray-800"
                    >
                      <option value="goods">Physical Goods (Jerseys, Boots)</option>
                      <option value="service">Service (Coaching, Maintenance)</option>
                      <option value="event">Event / Tournament</option>
                      <option value="announcement">General Announcement</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Headline / Title *</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Authentic Pro Cleats 2024"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-[#00B8AE] outline-none transition-all font-black text-xl placeholder:text-gray-300 placeholder:font-medium"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Item Category *</label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g. Footwear / Accessories"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-[#00B8AE] outline-none transition-all font-medium text-gray-800"
                    />
                  </div>

                  {/* Price & Quantity Grid nested */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price (NPR)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-[#00B8AE] outline-none transition-all font-medium text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Quantity available</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="1"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-[#00B8AE] outline-none transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Condition & Specs Contextual Row */}
                {formData.postType === "goods" && (
                  <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl space-y-6">
                    <h3 className="font-black text-gray-900 uppercase">Product Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Condition</label>
                        <select
                          name="condition"
                          value={formData.specifications.condition}
                          onChange={handleSpecificationChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B8AE] outline-none text-sm font-semibold text-gray-800"
                        >
                          <option value="new">Pristine / New</option>
                          <option value="like-new">Like New</option>
                          <option value="good">Good Condition</option>
                          <option value="fair">Fair Use</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Size</label>
                        <input
                          name="size"
                          value={formData.specifications.size}
                          onChange={handleSpecificationChange}
                          placeholder="e.g. 42, L"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B8AE] outline-none text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Color Variant</label>
                        <input
                          name="color"
                          value={formData.specifications.color}
                          onChange={handleSpecificationChange}
                          placeholder="e.g. Crimson Red"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B8AE] outline-none text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Material Core</label>
                        <input
                          name="material"
                          value={formData.specifications.material}
                          onChange={handleSpecificationChange}
                          placeholder="e.g. Carbon Fiber"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B8AE] outline-none text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Description & Tags */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description Deep Dive</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Give athletes the full backstory. Why does this perform better?"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-[#00B8AE] outline-none transition-all font-medium text-gray-800 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tags (Comma Separated)</label>
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g. performance, elite, running"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-[#00B8AE] outline-none transition-all font-medium text-gray-800"
                    />
                  </div>
                </div>

                {/* Image Upload Gallery Mode */}
                <div className="space-y-2 border-t border-gray-100 pt-8">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex justify-between items-center">
                    <span>High-Res Assets (Max 4)</span>
                    <span className="text-[#00B8AE]">{formData.imagePreviews.length}/4 Included</span>
                  </label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group bg-gray-100 border border-gray-200">
                        <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    {formData.imagePreviews.length < 4 && (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#00B8AE] bg-gray-50 hover:bg-teal-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors group"
                      >
                        <span className="text-3xl text-gray-300 group-hover:text-[#00B8AE] transition-colors mb-2">📸</span>
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-teal-600 uppercase tracking-widest">Add Media</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                {/* Submit Action Block */}
                <div className="pt-8 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative px-10 py-5 bg-[#00B8AE] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-400 hover:shadow-[0_15px_30px_rgba(0,184,174,0.3)] transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       {loading ? "Deploying Asset..." : editingId ? "Update Live Listing ⚡" : "Deploy to Marketplace 🚀"}
                    </span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB: MANAGE ASSETS */}
        {activeTab === "manage" && (
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 animate-fade-in relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                Manage Hub 📦
              </h2>
              <span className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-widest">{posts.length} Live Items</span>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <span className="text-6xl text-gray-200 block mb-6">🏜️</span>
                <p className="text-gray-500 font-medium mb-6">No assets deployed to the marketplace yet.</p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#00B8AE] transition-colors shadow-lg"
                >
                  Create First Asset
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b-2 border-gray-100">
                    <tr>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset Title</th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock / Status</th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Price (NPR)</th>
                      <th className="py-4 px-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Console</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {posts.map(post => (
                      <tr key={post._id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                               {post.images?.[0] ? (
                                  <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                               ) : (<div className="w-full h-full text-gray-300 flex items-center justify-center">🏷️</div>)}
                            </div>
                            <div>
                               <p className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#00B8AE] transition-colors">{post.title}</p>
                               <p className="text-xs text-gray-400 font-medium">{post.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                           <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">{post.postType}</span>
                        </td>
                        <td className="py-5 px-4">
                           <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${post.quantity > 0 || post.postType !== 'goods' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                              <span className="font-bold text-sm text-gray-700">{post.quantity > 0 ? `${post.quantity} left` : 'Out of stock'}</span>
                           </div>
                        </td>
                        <td className="py-5 px-4">
                           <span className="font-black text-gray-900">{post.price > 0 ? post.price.toLocaleString() : 'Free'}</span>
                        </td>
                        <td className="py-5 px-4 text-right">
                           <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                             <button
                               onClick={() => handleEdit(post)}
                               className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                             >
                               Edit
                             </button>
                             <button
                               onClick={() => handleDelete(post._id)}
                               className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                             >
                               Drop
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
      
      <style jsx>{`
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hidden-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getClubPosts, createClubPost, likeClubPost, commentOnPost } from "@/src/Services/api";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = "";
      if (activeTab === "trending") query = "?sort=likes";
      if (activeTab === "events") query = "?postType=event";
      if (activeTab === "marketplace") query = "?postType=goods";
      const response = await getClubPosts(query);
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 4 - selectedImages.length);
    const updatedFiles = [...selectedImages, ...newFiles].slice(0, 4);
    setSelectedImages(updatedFiles);

    // Generate previews
    const previews = updatedFiles.map(file => URL.createObjectURL(file));
    // Revoke old previews
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    const newFiles = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim() && selectedImages.length === 0) return;

    try {
      setPosting(true);
      const formData = new FormData();
      formData.append("title", newPost.split("\n")[0] || "Community Post");
      formData.append("description", newPost);
      formData.append("category", "General");
      formData.append("postType", "announcement");

      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      await createClubPost(formData);
      fetchPosts();
      setNewPost("");
      setSelectedImages([]);
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
    } catch (error: any) {
      console.error("Failed to create post:", error);
      alert(error.response?.data?.msg || "Failed to create post. Please make sure you are logged in.");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likeClubPost(postId);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: p.likes + 1 } : p));
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;

    try {
      const response = await commentOnPost(postId, { text });
      setPosts(posts.map(p => p._id === postId ? response.data.post : p));
      setCommentTexts({ ...commentTexts, [postId]: "" });
    } catch (error: any) {
      console.error("Failed to add comment:", error);
      alert(error.response?.data?.msg || "Please login to comment");
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const athletes = [
    { name: "Virat Kohli", role: "Cricket Legend", followers: "12.5M", avatar: "🏏" },
    { name: "PV Sindhu", role: "Badminton Champion", followers: "8.2M", avatar: "🏸" },
    { name: "Neeraj Chopra", role: "Track & Field", followers: "6.8M", avatar: "🎯" },
    { name: "Mary Kom", role: "Boxing Champion", followers: "5.3M", avatar: "🥊" },
  ];

  const tabs = [
    { id: "feed", label: "Feed", icon: "📱" },
    { id: "trending", label: "Trending", icon: "🔥" },
    { id: "marketplace", label: "Marketplace", icon: "🛍️" },
    { id: "events", label: "Events", icon: "📅" },
  ];

  // Image grid layout component
  const ImageGrid = ({ images }: { images: string[] }) => {
    if (!images || images.length === 0) return null;

    const gridClass = images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-2"
        : images.length === 3
          ? "grid-cols-2"
          : "grid-cols-2";

    return (
      <div className={`grid ${gridClass} gap-1.5 rounded-2xl overflow-hidden mb-4`}>
        {images.slice(0, 4).map((img, idx) => (
          <div
            key={idx}
            className={`relative cursor-pointer group overflow-hidden ${
              images.length === 3 && idx === 0 ? "row-span-2" : ""
            } ${images.length === 1 ? "max-h-[500px]" : "aspect-square"}`}
            onClick={() => setLightboxImage(img)}
          >
            <img
              src={img}
              alt={`Post image ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {idx === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-3xl font-black">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Marketplace card component
  const MarketplaceCard = ({ post }: { post: any }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {post.images?.[0] ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">🏷️</div>
        )}
        {/* Condition badge */}
        {post.specifications?.condition && (
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md ${
              post.specifications.condition === 'new'
                ? 'bg-emerald-500/90 text-white'
                : post.specifications.condition === 'like-new'
                  ? 'bg-blue-500/90 text-white'
                  : 'bg-amber-500/90 text-white'
            }`}>
              {post.specifications.condition}
            </span>
          </div>
        )}
        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
          <p className="text-white text-2xl font-black">
            {post.price ? `NPR ${post.price.toLocaleString()}` : "Contact for Price"}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
            {post.clubId?.name?.charAt(0) || post.createdBy?.name?.charAt(0) || "C"}
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            {post.clubId?.name || post.createdBy?.name || "Community"}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{post.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.description}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          {post.specifications?.size && <span>Size: {post.specifications.size}</span>}
          {post.specifications?.color && <span>Color: {post.specifications.color}</span>}
          {post.quantity > 0 && <span>Qty: {post.quantity}</span>}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-[#00B8AE] text-white rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors">
            Contact Seller
          </button>
          <button
            onClick={() => handleLike(post._id)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:text-red-500 transition-all text-sm font-bold"
          >
            ❤️ {post.likes || 0}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px]">
      {/* Premium Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center overflow-hidden bg-black mx-6 rounded-[40px] shadow-2xl mb-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-105 transition-transform duration-[10000ms] ease-linear hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2072&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/20 z-10" />

        <div className="relative max-w-7xl mx-auto px-12 z-20 w-full reveal active">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-xl mb-4">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">Athlete Network</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tight uppercase">
              COMMUNITY <br />
              <span className="text-gradient text-glow">HUB</span>
            </h1>

            <p className="text-gray-400 text-lg font-medium max-w-xl">
              Connect with fellow athletes, share your victories, and grow with the elite sports community of Nepal.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gray-900 text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Create Post — only for non-marketplace tabs */}
            {activeTab !== "marketplace" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                    ✍️
                  </div>
                  <div className="flex-grow">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your sports experience, tips, or questions..."
                      className="w-full p-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#00B8AE] focus:ring-4 focus:ring-teal-500/10 resize-none font-medium text-gray-800 placeholder:text-gray-400 transition-all"
                      rows={3}
                    />

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {imagePreviews.map((preview, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {selectedImages.length < 4 && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-all"
                          >
                            <span className="text-2xl">+</span>
                            <span className="text-[10px] font-bold mt-0.5">ADD</span>
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-all font-semibold text-sm border border-gray-100"
                        >
                          📷 Photo
                          {selectedImages.length > 0 && (
                            <span className="w-5 h-5 bg-teal-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                              {selectedImages.length}
                            </span>
                          )}
                        </button>
                      </div>
                      <button
                        onClick={handlePostSubmit}
                        disabled={(!newPost.trim() && selectedImages.length === 0) || posting}
                        className="bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white px-8 py-2.5 rounded-xl hover:shadow-lg hover:shadow-teal-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm flex items-center gap-2"
                      >
                        {posting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Post →"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Feed / Marketplace */}
            <div className="space-y-5">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-[#00B8AE] rounded-full animate-spin mx-auto" />
                  <p className="mt-4 text-gray-500 font-medium">Loading {activeTab}...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
                  <div className="text-6xl mb-4">
                    {activeTab === "marketplace" ? "🛍️" : activeTab === "events" ? "📅" : "📝"}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {activeTab === "marketplace"
                      ? "No goods listed yet"
                      : activeTab === "events"
                        ? "No upcoming events"
                        : "No posts yet"}
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === "marketplace"
                      ? "Clubs and members haven't listed any items for sale yet."
                      : "Be the first to share something!"}
                  </p>
                </div>
              ) : activeTab === "marketplace" ? (
                // Marketplace Grid
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {posts.map((post) => (
                    <MarketplaceCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                // Regular Feed
                posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                    {/* Post Header */}
                    <div className="p-6 pb-3">
                      <div className="flex items-start gap-3.5 mb-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-gray-600 text-sm shrink-0 shadow-sm">
                          {post.createdBy?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-gray-900 truncate">{post.createdBy?.name || "Member"}</h4>
                            {post.postType === "event" && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full font-bold uppercase">Event</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium">{formatTimeAgo(post.createdAt)}</span>
                            {post.category && post.category !== "General" && (
                              <>
                                <span className="text-gray-300">·</span>
                                <span className="text-xs text-teal-600 font-semibold">{post.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      {post.title && post.title !== "Community Post" && (
                        <h3 className="text-lg font-bold text-gray-900 mb-1.5">{post.title}</h3>
                      )}
                      {post.description && (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.description}</p>
                      )}
                    </div>

                    {/* Post Images */}
                    {post.images?.length > 0 && (
                      <div className="px-6">
                        <ImageGrid images={post.images} />
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="px-6 py-3 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleLike(post._id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors text-gray-500 hover:text-red-500 font-bold text-sm"
                        >
                          ❤️ <span>{post.likes || 0}</span>
                        </button>
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-500 font-bold text-sm"
                        >
                          💬 <span>{post.comments?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors text-gray-500 hover:text-teal-600 font-bold text-sm ml-auto">
                          🔗 Share
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {(expandedComments[post._id] || (post.comments?.length > 0 && post.comments.length <= 2)) && (
                      <div className="px-6 pb-4 border-t border-gray-50">
                        {post.comments?.length > 0 && (
                          <div className="space-y-2.5 py-3">
                            {post.comments.slice(0, expandedComments[post._id] ? undefined : 3).map((comment: any, idx: number) => (
                              <div key={idx} className="flex gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                  {comment.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="bg-gray-50 rounded-xl px-3.5 py-2 flex-grow">
                                  <span className="font-bold text-gray-900 text-sm">{comment.userId?.name || "User"}</span>
                                  <p className="text-gray-700 text-sm mt-0.5">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={commentTexts[post._id] || ""}
                            onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(post._id)}
                            placeholder="Write a comment..."
                            className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00B8AE] focus:border-transparent outline-none transition-all"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post._id)}
                            disabled={!commentTexts[post._id]?.trim()}
                            className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-gray-800 transition-colors"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Featured Athletes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-black text-gray-900 mb-5 uppercase tracking-wider">Featured Athletes</h3>
              <div className="space-y-4">
                {athletes.map((athlete, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                      {athlete.avatar}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm">{athlete.name}</h4>
                      <p className="text-xs text-gray-500">{athlete.role}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg font-bold hover:bg-[#00B8AE] transition-colors text-xs">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-black text-gray-900 mb-5 uppercase tracking-wider text-center">Community</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "50.2K", label: "Members", color: "text-[#00B8AE]" },
                  { value: "1.2M", label: "Posts", color: "text-emerald-500" },
                  { value: "340", label: "Events", color: "text-purple-500" },
                ].map((stat, i) => (
                  <div key={i} className="text-center py-3 bg-gray-50 rounded-xl">
                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href: "/clubs", label: "Browse Clubs", icon: "🏆" },
                  { href: "/clubs/posts", label: "Manage Posts", icon: "📝" },
                  { href: "/products", label: "Shop Gear", icon: "🛒" },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="font-semibold text-gray-700 text-sm group-hover:text-[#00B8AE] transition-colors">{link.label}</span>
                    <span className="ml-auto text-gray-300 group-hover:text-teal-400 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <h4 className="font-black text-sm uppercase tracking-wider mb-4">📋 Guidelines</h4>
              <ul className="text-sm text-gray-300 space-y-2.5">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Be respectful to all members</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Share authentic experiences</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> No hate speech or discrimination</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Support fellow athletes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            ✕
          </button>
          <img
            src={lightboxImage}
            alt="Full size"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

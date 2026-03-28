"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getClubPosts, createClubPost, likeClubPost, commentOnPost } from "@/src/Services/api";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = "";
      if (activeTab === "trending") query = "?sort=likes";
      if (activeTab === "events") query = "?postType=event";
      const response = await getClubPosts(query);
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (newPost.trim()) {
      try {
        const formData = new FormData();
        formData.append("title", newPost.split("\n")[0]);
        formData.append("description", newPost);
        formData.append("category", "General");
        await createClubPost(formData);
        fetchPosts();
        setNewPost("");
      } catch (error: any) {
        console.error("Failed to create post:", error);
        alert(error.response?.data?.msg || "Failed to create post. Please make sure you are logged in.");
      }
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
      // The API returns the updated post, replace it in the state
      setPosts(posts.map(p => p._id === postId ? response.data.post : p));
      setCommentTexts({ ...commentTexts, [postId]: "" });
    } catch (error: any) {
      console.error("Failed to add comment:", error);
      alert(error.response?.data?.msg || "Please login to comment");
    }
  };

  const athletes = [
    { name: "Virat Kohli", role: "Cricket Legend", followers: "12.5M", avatar: "🏏" },
    { name: "PV Sindhu", role: "Badminton Champion", followers: "8.2M", avatar: "🏸" },
    { name: "Neeraj Chopra", role: "Track & Field", followers: "6.8M", avatar: "🎯" },
    { name: "Mary Kom", role: "Boxing Champion", followers: "5.3M", avatar: "🥊" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px]">
      {/* Premium Hero Section for Community */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center overflow-hidden bg-black mx-6 rounded-[40px] shadow-2xl mb-12">
        {/* Background Image - Community Themed */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-105 transition-transform duration-[10000ms] ease-linear hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2072&auto=format&fit=crop')" }}
        ></div>
        
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/20 z-10"></div>

        <div className="relative max-w-7xl mx-auto px-12 z-20 w-full reveal active">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-xl mb-4">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
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
            <div className="flex gap-4 border-b border-gray-200 mb-6">
              {["feed", "trending", "events"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-4 font-semibold transition ${
                    activeTab === tab
                      ? "border-b-2 border-[#00B8AE] text-[#00B8AE]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab === "feed" && "📱 Feed"}
                  {tab === "trending" && "🔥 Trending"}
                  {tab === "events" && "📅 Events"}
                </button>
              ))}
            </div>

            {/* Create Post */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">✍️ Share Your Story</h3>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share your sports experience, tips, or questions..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00B8AE] resize-none font-medium"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="ml-auto bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white px-8 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8AE] mx-auto"></div>
                   <p className="mt-4 text-gray-500">Loading community feed...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                  <p className="text-gray-500">No posts yet. Be the first to share something!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                    {/* Post Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-3xl bg-gray-100 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                        {post.createdBy?.avatar || "👤"}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{post.createdBy?.name || "Member"}</h4>
                          <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-semibold">
                            {post.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-700 mb-4">{post.description}</p>

                    {/* Post Stats */}
                    <div className="flex items-center gap-6 py-4 border-y border-gray-100 text-gray-600">
                      <button 
                        onClick={() => handleLike(post._id)}
                        className="flex items-center gap-2 hover:text-red-500 transition text-sm font-bold"
                      >
                        Like
                        <span className="font-bold">{post.likes}</span>
                      </button>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        Comment
                        <span className="font-bold">{post.comments?.length || 0}</span>
                      </div>
                      <button className="flex items-center gap-2 hover:text-[#00B8AE] transition ml-auto text-sm font-bold uppercase tracking-widest">
                        Share
                      </button>
                    </div>

                    {/* Comments Section */}
                    {post.comments?.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-50">
                        {post.comments.slice(0, 3).map((comment: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                            <span className="font-bold text-gray-900">{comment.userId?.name}: </span>
                            <span className="text-gray-700">{comment.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="mt-4 flex gap-2">
                      <input 
                        type="text"
                        value={commentTexts[post._id] || ""}
                        onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                        placeholder="Write a comment..."
                        className="flex-grow bg-gray-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#00B8AE] outline-none"
                      />
                      <button 
                        onClick={() => handleCommentSubmit(post._id)}
                        disabled={!commentTexts[post._id]?.trim()}
                        className="text-[#00B8AE] font-bold text-sm px-2 disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Featured Athletes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider">Featured Athletes</h3>
              <div className="space-y-4">
                {athletes.map((athlete, i) => (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">A</div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">{athlete.name}</h4>
                      <p className="text-sm text-gray-600">{athlete.role}</p>
                      <p className="text-xs text-[#00B8AE] font-semibold">{athlete.followers} followers</p>
                    </div>
                    <button className="px-3 py-1 bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white rounded-full font-semibold hover:shadow-md transition text-sm">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider text-center">Community Stats</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#00B8AE]">50.2K</p>
                  <p className="text-sm text-gray-600">Active Members</p>
                </div>
                <div className="text-center border-y border-gray-200 py-4">
                  <p className="text-3xl font-bold text-green-600">1.2M</p>
                  <p className="text-sm text-gray-600">Posts & Comments</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">340</p>
                  <p className="text-sm text-gray-600">Events Hosted</p>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-r from-[#00B8AE]/10 to-teal-500/10 border border-[#00B8AE]/30 rounded-lg p-4">
              <h4 className="font-bold text-[#00B8AE] mb-3">📋 Community Guidelines</h4>
              <ul className="text-sm text-[#00B8AE] space-y-2">
                <li>✓ Be respectful to all members</li>
                <li>✓ Share authentic experiences</li>
                <li>✓ No hate speech or discrimination</li>
                <li>✓ Support fellow athletes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

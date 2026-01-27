"use client";

import { useState } from "react";
import Link from "next/link";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Raj Kumar",
      avatar: "👨‍🏫",
      title: "Best Football Techniques for Beginners",
      content: "I've been playing football for 10 years and here are my top tips for beginners...",
      likes: 324,
      comments: 45,
      timestamp: "2 hours ago",
      category: "Tips",
    },
    {
      id: 2,
      author: "Priya Singh",
      avatar: "⚽",
      title: "Local Cricket Tournament Next Month",
      content: "Anyone interested in joining our local cricket tournament? Registration opens soon!",
      likes: 156,
      comments: 23,
      timestamp: "4 hours ago",
      category: "Events",
    },
    {
      id: 3,
      author: "Amit Patel",
      avatar: "🏆",
      title: "How I Improved My Basketball Skills",
      content: "My journey from casual player to competitive athlete in just 6 months...",
      likes: 512,
      comments: 89,
      timestamp: "1 day ago",
      category: "Stories",
    },
  ]);

  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: "You",
        avatar: "👤",
        title: newPost.split("\n")[0],
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: "now",
        category: "General",
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  const athletes = [
    { name: "Virat Kohli", role: "Cricket Legend", followers: "12.5M", avatar: "🏏" },
    { name: "PV Sindhu", role: "Badminton Champion", followers: "8.2M", avatar: "🏸" },
    { name: "Neeraj Chopra", role: "Track & Field", followers: "6.8M", avatar: "🎯" },
    { name: "Mary Kom", role: "Boxing Champion", followers: "5.3M", avatar: "🥊" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-[#00B8AE] to-teal-500 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">👥 Khel Bazaar Community</h1>
          <p className="text-teal-100 text-lg">Connect with athletes, share experiences, and grow together</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
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
                  className="ml-auto bg-linear-to-r from-[#00B8AE] to-teal-500 text-white px-8 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl">{post.avatar}</div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{post.author}</h4>
                        <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-semibold">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.content}</p>

                  {/* Post Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-gray-200 text-gray-600">
                    <button className="flex items-center gap-2 hover:text-red-600 transition">
                      <span>👍</span>
                      <span className="font-semibold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#00B8AE] transition">
                      <span>💬</span>
                      <span className="font-semibold">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-green-600 transition ml-auto">
                      <span>📤</span>
                      <span className="font-semibold">Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Featured Athletes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">⭐ Featured Athletes</h3>
              <div className="space-y-4">
                {athletes.map((athlete, i) => (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="text-3xl">{athlete.avatar}</div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">{athlete.name}</h4>
                      <p className="text-sm text-gray-600">{athlete.role}</p>
                      <p className="text-xs text-[#00B8AE] font-semibold">{athlete.followers} followers</p>
                    </div>
                    <button className="px-3 py-1 bg-linear-to-r from-[#00B8AE] to-teal-500 text-white rounded-full font-semibold hover:shadow-md transition text-sm">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Community Stats</h3>
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
            <div className="bg-linear-to-r from-[#00B8AE]/10 to-teal-500/10 border border-[#00B8AE]/30 rounded-lg p-4">
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

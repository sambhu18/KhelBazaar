"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/Services/axiosinstance";

export default function ClubPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    clubId: "",
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    postType: "goods",
    images: [] as File[],
    tags: "",
    condition: "new",
    specifications: {
      size: "",
      color: "",
      material: "",
    },
  });

  useEffect(() => {
    fetchPosts();
    fetchClubs();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/club-posts?status=active");
      setPosts(response.data);
    } catch (error: any) {
      setErrorMsg("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await axiosInstance.get("/api/clubs");
      setClubs(response.data);
    } catch (error) {
      console.log("Failed to fetch clubs");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.clubId || !formData.title || !formData.category) {
      setErrorMsg("Please fill in all required fields");
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
        setSuccessMsg("Post updated successfully!");
      } else {
        await axiosInstance.post("/api/club-posts", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Post created successfully!");
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.msg || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clubId: "",
      title: "",
      description: "",
      category: "",
      price: "",
      quantity: "",
      postType: "goods",
      images: [],
      tags: "",
      condition: "new",
      specifications: {
        size: "",
        color: "",
        material: "",
      },
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (post: any) => {
    setFormData({
      clubId: post.clubId._id,
      title: post.title,
      description: post.description || "",
      category: post.category,
      price: post.price?.toString() || "",
      quantity: post.quantity?.toString() || "",
      postType: post.postType || "goods",
      images: [],
      tags: post.tags?.join(", ") || "",
      condition: post.specifications?.condition || "new",
      specifications: post.specifications || {},
    });
    setEditingId(post._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axiosInstance.delete(`/api/club-posts/${id}`);
      setSuccessMsg("Post deleted successfully!");
      fetchPosts();
    } catch (error: any) {
      setErrorMsg("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Club Goods & Services</h1>
            <p className="text-gray-600 mt-1">Manage club posts and vendor items</p>
          </div>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {showForm ? "Cancel" : "+ New Post"}
          </button>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Add/Edit Post Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Post" : "Create New Post"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Club Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Club *
                  </label>
                  <select
                    name="clubId"
                    value={formData.clubId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select a club</option>
                    {clubs.map((club) => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Post Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Post Type
                  </label>
                  <select
                    name="postType"
                    value={formData.postType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="goods">Goods</option>
                    <option value="service">Service</option>
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Football Jersey"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Sports Equipment"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Condition */}
                {formData.postType === "goods" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specifications: {
                            ...prev.specifications,
                            condition: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="new">New</option>
                      <option value="like-new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Size
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.specifications.size}
                      onChange={handleSpecificationChange}
                      placeholder="e.g., Medium, Large"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.specifications.color}
                      onChange={handleSpecificationChange}
                      placeholder="e.g., Red, Blue"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.specifications.material}
                      onChange={handleSpecificationChange}
                      placeholder="e.g., Cotton, Polyester"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of your item"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., football, jersey, official"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
                {formData.images.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.images.length} file(s) selected
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  {loading ? "Processing..." : editingId ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Grid */}
        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No posts found
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {post.images?.[0] && (
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mb-2">
                      {post.postType}
                    </span>

                    <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {post.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-purple-600">
                        {post.price ? `${post.price}` : "Contact"}
                      </span>
                      <span className="text-sm text-gray-600">Qty: {post.quantity}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

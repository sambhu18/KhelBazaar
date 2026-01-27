"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/src/Services/axiosinstance";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "NPR",
    stock: "",
    categories: "",
    sizes: [] as string[],
    sku: "",
    images: [] as File[],
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "admin") {
      router.push("/admin/login");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/products");
      setProducts(response.data);
    } catch (error: any) {
      setErrorMsg("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentSizes = prev.sizes;
      if (checked) {
        return { ...prev, sizes: [...currentSizes, value] };
      } else {
        return { ...prev, sizes: currentSizes.filter((s) => s !== value) };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: files,
      }));

      // Generate previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.title || !formData.price || !formData.stock) {
      setErrorMsg("Please fill in all required fields marked with *");
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("currency", formData.currency);
      submitData.append("stock", formData.stock);
      submitData.append("categories", formData.categories);
      submitData.append("sku", formData.sku);
      formData.sizes.forEach(size => submitData.append("sizes[]", size));

      formData.images.forEach((file) => {
        submitData.append("images", file);
      });

      if (editingId) {
        await axiosInstance.put(`/api/products/${editingId}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Product updated successfully!");
      } else {
        await axiosInstance.post("/api/products", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Product added successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.msg || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      currency: "NPR",
      stock: "",
      categories: "",
      sizes: [],
      sku: "",
      images: [],
    });
    setPreviewImages([]);
    setEditingId(null);
    setShowForm(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleEdit = (product: any) => {
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price.toString(),
      currency: product.currency || "NPR",
      stock: product.stock.toString(),
      categories: product.categories?.join(", ") || "",
      sizes: product.sizes || [],
      sku: product.sku || "",
      images: [],
    });
    // Set existing images as previews if needed, though they are URLs not blobs
    // For simplicity, we just clear previews or show existing ones if we handled that
    setPreviewImages(product.images && product.images.length > 0 ? product.images.map((img: string) => img.startsWith('http') ? img : `http://localhost:5000${img}`) : []); // Assuming backend runs on 5000

    setEditingId(product._id);
    setShowForm(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axiosInstance.delete(`/api/products/${id}`);
      setSuccessMsg("Product deleted successfully!");
      fetchProducts();
    } catch (error: any) {
      setErrorMsg("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-500 mt-1">Add, edit, and organize your store catalog</p>
          </div>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className={`px-6 py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${showForm
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
          >
            {showForm ? (
              <>✕ Cancel</>
            ) : (
              <>+ Add Product</>
            )}
          </button>
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg flex items-center animate-fade-in">
            <span className="text-green-500 text-xl mr-3">✓</span>
            <p className="text-green-800 font-medium">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center animate-fade-in">
            <span className="text-red-500 text-xl mr-3">⚠</span>
            <p className="text-red-800 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Product Details" : "New Product Details"}
              </h2>
            </div>


            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Media */}
                <div className="lg:col-span-1 space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Images
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <div className="text-4xl text-gray-400 group-hover:text-blue-500 transition-colors">📷</div>
                      <p className="text-sm text-gray-500 font-medium">Click to upload images</p>
                      <p className="text-xs text-gray-400">JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  </div>

                  {/* Previews */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {previewImages.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                          <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Professional Cricket Bat"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          {formData.currency}
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="flex-1 w-full px-4 py-2.5 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                      >
                        <option value="NPR">NPR (Nepalese Rupee)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Optional)</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="e.g. SKU-1234"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                      <input
                        type="text"
                        name="categories"
                        value={formData.categories}
                        onChange={handleInputChange}
                        placeholder="e.g. Sports, Summer, Sale (comma separated)"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple categories with commas</p>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Detailed product description..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Saving...
                        </>
                      ) : (
                        <>{editingId ? "Update Product" : "Publish Product"}</>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </form>
          </div>
        )}

        {/* Product List Table */}
        {!showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Table Header/Filter could go here */}

            {loading && products.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6">Start by adding your first product to the inventory.</p>
                <button onClick={() => setShowForm(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Create Product</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{product.title}</p>
                              <p className="text-xs text-gray-500 font-mono">{product.sku || 'No SKU'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          {product.currency} {product.price}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {product.categories?.join(", ") || "-"}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            🗑
                          </button>
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
    </div>
  );
}

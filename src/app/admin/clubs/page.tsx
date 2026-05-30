"use client";

import { useState, useEffect } from "react";
import { getClubs, createClub, updateClub, deleteClub } from "@/src/Services/api";
import { useRouter } from "next/navigation";

interface Club {
    _id: string;
    name: string;
    description: string;
    bannerUrl?: string;
    storefrontSettings?: {
        currency: string;
        shippingRegions: string[];
    };
}

export default function AdminClubsPage() {
    const router = useRouter();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        bannerUrl: "",
    });

    useEffect(() => {
        checkAdminAccess();
        fetchClubs();
    }, []);

    const checkAdminAccess = () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        if (!token || role !== "admin") {
            router.push("/admin/login");
        }
    };

    const fetchClubs = async () => {
        try {
            setLoading(true);
            const response = await getClubs();
            setClubs(response.data || []);
        } catch (error: any) {
            console.error("Failed to fetch clubs", error);
            setErrorMsg("Failed to fetch clubs. Ensure backend is running on port 5001.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        try {
            setLoading(true);
            if (editingId) {
                await updateClub(editingId, formData);
                setSuccessMsg("Club updated successfully!");
            } else {
                await createClub(formData);
                setSuccessMsg("Club created successfully!");
            }
            resetForm();
            fetchClubs();
        } catch (error: any) {
            setErrorMsg(error?.response?.data?.msg || "Failed to save club. The Club API might not be fully implemented yet.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", description: "", bannerUrl: "" });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (club: Club) => {
        setFormData({
            name: club.name,
            description: club.description || "",
            bannerUrl: club.bannerUrl || "",
        });
        setEditingId(club._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this club?")) return;
        try {
            await deleteClub(id);
            setSuccessMsg("Club deleted successfully!");
            fetchClubs();
        } catch (error) {
            setErrorMsg("Failed to delete club");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Club Management</h1>
                        <p className="text-gray-500 mt-1">Manage sports clubs and their settings</p>
                    </div>
                    <button
                        onClick={() => (showForm ? resetForm() : setShowForm(true))}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md transition-all flex items-center gap-2"
                    >
                        {showForm ? "✕ Cancel" : "+ Add Club"}
                    </button>
                </div>

                {/* Feedback Messages */}
                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-lg shadow-sm">
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg shadow-sm">
                        {errorMsg}
                    </div>
                )}

                {/* Form Section */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {editingId ? "Edit Club" : "Register New Club"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Club Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Kathmandu Legends"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="About the club..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Image URL</label>
                                <input
                                    type="text"
                                    name="bannerUrl"
                                    value={formData.bannerUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/banner.jpg"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                                >
                                    {loading ? "Saving..." : editingId ? "Update Club" : "Create Club"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Clubs List */}
                {!showForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {loading && clubs.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">Loading clubs...</div>
                        ) : clubs.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="text-6xl mb-4">🏆</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Clubs Registered</h3>
                                <p className="text-gray-500 mb-6">Manage all sports clubs participating in the platform.</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Register First Club
                                </button>
                                <div className="mt-8 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg max-w-md mx-auto">
                                    Note: The Club Management API is currently in placeholder mode.
                                    Creating a club will require the backend implementation.
                                </div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Club</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {clubs.map((club) => (
                                        <tr key={club._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                        {club.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{club.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                                                {club.description || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleEdit(club)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    ✎ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(club._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    🗑 Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

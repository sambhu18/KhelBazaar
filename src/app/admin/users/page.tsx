"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/src/Services/axiosinstance";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/users");
      setUsers(response.data);
    } catch (error: any) {
      setErrorMsg("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");

      await axiosInstance.put(`/api/users/${userId}/role`, { role: newRole });
      setSuccessMsg("User role updated successfully!");
      fetchUsers();
      setShowDetails(false);
    } catch (error: any) {
      setErrorMsg("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setErrorMsg("");
      setSuccessMsg("");

      await axiosInstance.delete(`/api/users/${userId}`);
      setSuccessMsg("User deleted successfully!");
      fetchUsers();
      setShowDetails(false);
    } catch (error: any) {
      setErrorMsg("Failed to delete user");
    }
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: "bg-red-100 text-red-800",
      customer: "bg-blue-100 text-blue-800",
      club: "bg-green-100 text-green-800",
      player: "bg-purple-100 text-purple-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-2">Manage all system users</p>
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

      {/* Role Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "admin", "customer", "club", "player"].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              roleFilter === role
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {user.verified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* User Info */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Name</label>
                  <p className="text-gray-700">{selectedUser.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Email</label>
                  <p className="text-gray-700">{selectedUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Phone</label>
                  <p className="text-gray-700">{selectedUser.phone || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Address</label>
                  <p className="text-gray-700">{selectedUser.address || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">City</label>
                    <p className="text-gray-700">{selectedUser.city || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Zip Code</label>
                    <p className="text-gray-700">{selectedUser.zipCode || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {selectedUser.verified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">User Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleRoleUpdate(selectedUser._id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="club">Club</option>
                    <option value="player">Player</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="pt-2 text-xs text-gray-500">
                  <p>Joined: {new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteUser(selectedUser._id)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete User
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/src/Services/axiosinstance";

interface Rental {
  _id: string;
  rentalNumber: string;
  userId: { name: string; email: string; phone: string };
  productId: { title: string };
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  status: "pending" | "confirmed" | "active" | "returned" | "overdue" | "cancelled";
  totalAmount: number;
  deposit: number;
  paymentStatus: string;
  remindersSent: any[];
}

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reminderType, setReminderType] = useState("return");
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    fetchRentals();
    const interval = setInterval(fetchRentals, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/rentals/admin/all");
      console.log("Rentals API Response:", res.data); // Debug log
      
      // Handle different response formats
      const rentalsData = Array.isArray(res.data) 
        ? res.data 
        : res.data.rentals || [];
      
      console.log("Rentals Data:", rentalsData); // Debug log
      setRentals(rentalsData);
    } catch (error: any) {
      console.error("Failed to fetch rentals:", error);
      
      let errorMsg = "Failed to fetch rentals";
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        errorMsg = "Admin access required. Please log in as an admin to view all rentals.";
      } else if (error.response?.status === 401) {
        errorMsg = "Session expired. Please log in again.";
      } else if (error.response?.data?.msg) {
        errorMsg = error.response.data.msg;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      console.error("Error details:", errorMsg);
      
      window.dispatchEvent(new CustomEvent("show-toast", {
        detail: { message: errorMsg, type: "error" }
      }));
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRentals = () => {
    const now = new Date();
    
    switch (filter) {
      case "active":
        return rentals.filter(r => r.status === "active");
      case "overdue":
        return rentals.filter(r => r.status === "overdue" || (new Date(r.endDate) < now && r.status === "active"));
      case "pending_return":
        return rentals.filter(r => {
          const daysUntilReturn = Math.ceil((new Date(r.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return r.status === "active" && daysUntilReturn <= 3 && daysUntilReturn > 0;
        });
      case "returned":
        return rentals.filter(r => r.status === "returned");
      case "cancelled":
        return rentals.filter(r => r.status === "cancelled");
      default:
        return rentals;
    }
  };

  const sendReminder = async (rental: Rental, type: string) => {
    try {
      setSendingReminder(true);
      
      // Call backend API to send reminder
      await axiosInstance.post(`/api/rentals/admin/${rental._id}/send-reminder`, {
        reminderType: type,
      });
      
      window.dispatchEvent(new CustomEvent("show-toast", {
        detail: { message: `${type === "return" ? "Return reminder" : "Overdue notice"} sent successfully!`, type: "success" }
      }));
      
      fetchRentals(); // Refresh to show updated reminder status
    } catch (error: any) {
      console.error("Failed to send reminder", error);
      window.dispatchEvent(new CustomEvent("show-toast", {
        detail: { message: error.response?.data?.msg || "Failed to send reminder", type: "error" }
      }));
    } finally {
      setSendingReminder(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      returned: "bg-gray-100 text-gray-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getDaysUntilReturn = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredRentals = getFilteredRentals();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Rental Management</h1>
        <p className="text-gray-600 mt-2">Track rentals and manage return reminders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { key: "active", label: "Active" },
          { key: "pending_return", label: "Due Soon" },
          { key: "overdue", label: "Overdue" },
          { key: "returned", label: "Returned" },
          { key: "cancelled", label: "Cancelled" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === tab.key
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {tab.key === "overdue" && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {rentals.filter(r => r.status === "overdue").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Rentals Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          No rentals found in this category
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRentals.map(rental => {
            const daysUntilReturn = getDaysUntilReturn(rental.endDate);
            const isUrgent = daysUntilReturn <= 3 && daysUntilReturn > 0;
            const isOverdue = daysUntilReturn < 0;

            return (
              <div
                key={rental._id}
                className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
                  isOverdue
                    ? "border-l-red-500 bg-red-50"
                    : isUrgent
                    ? "border-l-yellow-500 bg-yellow-50"
                    : "border-l-blue-500"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Rental #</p>
                    <p className="text-lg font-bold text-gray-900">{rental.rentalNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                    {rental.status}
                  </span>
                </div>

                {/* Product & Customer */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Product</p>
                      <p className="font-semibold text-gray-900">{rental.productId.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Customer</p>
                      <p className="font-semibold text-gray-900">{rental.userId.name}</p>
                      <p className="text-xs text-gray-500">{rental.userId.email}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-semibold">{new Date(rental.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Return Due</p>
                      <p className={`font-semibold ${isOverdue ? "text-red-600" : isUrgent ? "text-yellow-600" : ""}`}>
                        {new Date(rental.endDate).toLocaleDateString()}
                      </p>
                      <p className={`text-xs font-semibold ${isOverdue ? "text-red-600" : isUrgent ? "text-yellow-600" : "text-green-600"}`}>
                        {isOverdue
                          ? `${Math.abs(daysUntilReturn)} days OVERDUE`
                          : isUrgent
                          ? `${daysUntilReturn} days until return`
                          : `${daysUntilReturn} days remaining`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="font-semibold">Rs. {rental.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Deposit</p>
                      <p className="font-semibold">Rs. {rental.deposit}</p>
                    </div>
                  </div>
                </div>

                {/* Reminder Status */}
                {rental.remindersSent.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200 text-xs">
                    <p className="text-gray-600 mb-1">Reminders Sent:</p>
                    <div className="flex flex-wrap gap-1">
                      {rental.remindersSent.map((reminder: any, idx: number) => (
                        <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {reminder.type} - {new Date(reminder.sentAt).toLocaleDateString()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {rental.status === "active" || rental.status === "overdue" ? (
                    <>
                      {isOverdue && (
                        <button
                          onClick={() => sendReminder(rental, "overdue")}
                          disabled={sendingReminder}
                          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                        >
                          🚨 Send Overdue Notice
                        </button>
                      )}
                      {isUrgent && !isOverdue && (
                        <button
                          onClick={() => sendReminder(rental, "return")}
                          disabled={sendingReminder}
                          className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                        >
                          ⏰ Send Return Reminder
                        </button>
                      )}
                    </>
                  ) : null}

                  <button
                    onClick={() => {
                      setSelectedRental(rental);
                      setShowDetails(true);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Rental Details</h2>
                  <p className="text-gray-600">{selectedRental.rentalNumber}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{selectedRental.userId.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedRental.userId.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{selectedRental.userId.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rental Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${getStatusColor(selectedRental.status)}`}>
                      {selectedRental.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rental Dates */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Rental Period</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Start</p>
                    <p className="font-semibold">{new Date(selectedRental.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">End</p>
                    <p className="font-semibold">{new Date(selectedRental.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Days</p>
                    <p className="font-semibold">{Math.ceil((new Date(selectedRental.endDate).getTime() - new Date(selectedRental.startDate).getTime()) / (1000 * 60 * 60 * 24))}</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Pricing Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-semibold">Rs. {selectedRental.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit</span>
                    <span className="font-semibold">Rs. {selectedRental.deposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className="font-semibold text-purple-600">{selectedRental.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Reminders */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Send Reminder</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => sendReminder(selectedRental, "return")}
                    disabled={sendingReminder}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                  >
                    📧 Return Reminder
                  </button>
                  <button
                    onClick={() => sendReminder(selectedRental, "overdue")}
                    disabled={sendingReminder}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                  >
                    🚨 Overdue Notice
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/src/Services/axiosinstance";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/orders");
      let filteredOrders = response.data;

      if (statusFilter !== "all") {
        filteredOrders = filteredOrders.filter((order: any) => order.status === statusFilter);
      }

      setOrders(filteredOrders);
    } catch (error: any) {
      setErrorMsg("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, order?: any) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      
      const updateData: any = { status: newStatus };
      
      // Add tracking details when shipping
      if (newStatus === "shipped" && order?.status === "confirmed") {
        if (!trackingNumber.trim()) {
          setErrorMsg("Please enter a tracking number");
          return;
        }
        updateData.trackingNumber = trackingNumber;
        if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
      }
      
      await axiosInstance.put(`/api/orders/${orderId}/status`, updateData);
      setSuccessMsg("Order status updated successfully!");
      setTrackingNumber("");
      setEstimatedDelivery("");
      fetchOrders();
      
      // Update selected order if it's open
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, trackingNumber: trackingNumber || selectedOrder.trackingNumber });
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.msg || "Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-50 text-yellow-700",
      completed: "bg-green-50 text-green-700",
      failed: "bg-red-50 text-red-700",
    };
    return colors[status] || "bg-gray-50 text-gray-700";
  };

  const renderStatusActions = (order: any) => {
    switch(order.status) {
      case "pending":
        return (
          <button
            onClick={() => handleStatusUpdate(order._id, "confirmed")}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Confirm
          </button>
        );
      case "confirmed":
        return (
          <button
            onClick={() => {
              setSelectedOrder(order);
              setShowDetails(true);
            }}
            className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Ship Now
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={() => handleStatusUpdate(order._id, "delivered")}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Deliver
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage customer orders and parcel tracking</p>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✓ {successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">✕ {errorMsg}</p>
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === status
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tracking</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.userId?.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {order.currency} {order.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.trackingNumber ? (
                        <code className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-mono">{order.trackingNumber}</code>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {renderStatusActions(order)}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
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

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-gray-600">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
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
                    <p className="font-medium text-gray-900">{selectedOrder.userId?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedOrder.userId?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedOrder.userId?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <p className="text-sm text-gray-900">
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}{" "}
                  {selectedOrder.shippingAddress?.zipCode}
                </p>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Section */}
              {selectedOrder.status === "confirmed" && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">📦 Ship This Order</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter tracking number (e.g., TRK123456)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="date"
                      placeholder="Estimated delivery date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder._id, "shipped", selectedOrder)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Ship Order
                    </button>
                  </div>
                </div>
              )}

              {/* Current Tracking Info */}
              {selectedOrder.trackingNumber && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">📍 Tracking Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <code className="font-mono font-semibold text-blue-600">{selectedOrder.trackingNumber}</code>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Delivery:</span>
                        <span className="font-semibold">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedOrder.shippedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipped At:</span>
                        <span className="font-semibold">{new Date(selectedOrder.shippedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status & Payment */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Order Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Status</label>
                  <span className={`block px-3 py-2 rounded-lg text-sm font-semibold text-center ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-purple-50 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {selectedOrder.currency} {selectedOrder.totalPrice}
                  </span>
                </div>
                {selectedOrder.loyaltyPointsEarned > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Loyalty Points Earned: {selectedOrder.loyaltyPointsEarned}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
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


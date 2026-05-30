"use client";

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/src/Services/axiosinstance';
import Link from 'next/link';

interface Order {
    _id: string;
    orderNumber: string;
    createdAt: string; // Backend returns createdAt? orderController: sort({ createdAt: -1 })
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: any[];
}

export default function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/auth/Login";
                return;
            }
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const response = await axiosInstance.get('/api/orders/user/my-orders');
            setOrders(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load your orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-teal-100 text-teal-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded mb-6">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-lg text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <Link href="/products" className="text-teal-600 font-bold hover:underline">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500 block">Order Placed</span>
                                        <span className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 block">Order Number</span>
                                        <span className="font-mono text-gray-900">{order.orderNumber}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 block">Total Amount</span>
                                        <span className="font-bold text-[#00B8AE]">NPR {order.totalPrice}</span>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 py-4 border-b last:border-0 border-gray-100">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.productId && item.productId.images && item.productId.images[0] ? (
                                                    <img src={item.productId.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">🖼️</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                                                {item.customization && (item.customization.name || item.customization.number) && (
                                                    <div className="flex gap-2 text-xs mt-1">
                                                        {item.customization.name && <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">Name: <span className="font-bold">{item.customization.name}</span></span>}
                                                        {item.customization.number && <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">Number: <span className="font-bold">{item.customization.number}</span></span>}
                                                    </div>
                                                )}
                                                <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">NPR {item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

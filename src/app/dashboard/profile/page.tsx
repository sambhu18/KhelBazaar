"use client";

import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, getAddresses, addAddress, updateAddress, deleteAddress, getLoyaltyPoints } from '@/src/Services/api';
import Image from 'next/image';

interface Address {
    _id: string;
    type: 'home' | 'work' | 'other';
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loyalty, setLoyalty] = useState<any>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, addressesRes, loyaltyRes] = await Promise.all([
                getUserProfile(),
                getAddresses(),
                getLoyaltyPoints()
            ]);
            setUser(profileRes.data.user);
            setAddresses(addressesRes.data.addresses);
            setLoyalty(loyaltyRes.data);
        } catch (err) {
            console.error('Error fetching profile data:', err);
            setMessage({ type: 'error', text: 'Failed to load profile data' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUpdating(true);
            await updateUserProfile(user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUpdating(true);
            if (currentAddress?._id) {
                await updateAddress(currentAddress._id, currentAddress);
            } else {
                await addAddress(currentAddress);
            }
            setShowAddressModal(false);
            fetchData();
            setMessage({ type: 'success', text: 'Address saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save address' });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await deleteAddress(id);
            fetchData();
            setMessage({ type: 'success', text: 'Address deleted' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete address' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-700 h-64 relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-5xl mx-auto px-6 h-full flex flex-col justify-end pb-8 relative">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-2xl relative overflow-hidden group">
                            {user?.avatar ? (
                                <Image src={user.avatar} alt={user.name} fill className="object-cover rounded-xl" />
                            ) : (
                                <div className="w-full h-full bg-teal-100 flex items-center justify-center text-4xl text-teal-600">
                                    {user?.name?.charAt(0) || '👤'}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-white text-xs font-bold">Change PHOTO</span>
                            </div>
                        </div>
                        <div className="text-center md:text-left text-white">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                <h1 className="text-4xl font-black tracking-tight">{user?.name}</h1>
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
                                    {user?.role}
                                </span>
                            </div>
                            <p className="text-teal-50 font-medium opacity-90">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Account Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Message */}
                        {message.text && (
                            <div className={`p-4 rounded-xl border-2 flex items-center gap-3 animate-in fade-in slide-in-from-top ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                                }`}>
                                <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                                <p className="font-bold">{message.text}</p>
                            </div>
                        )}

                        {/* Personal Information */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                    <p className="text-gray-500 text-sm">Update your public profile and details</p>
                                </div>
                                <span className="text-3xl">👤</span>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={user?.name || ''}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bio</label>
                                        <input
                                            type="text"
                                            value={user?.profile?.bio || ''}
                                            onChange={(e) => setUser({ ...user, profile: { ...user.profile, bio: e.target.value } })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            value={user?.phone || ''}
                                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                                        <select
                                            value={user?.profile?.gender || ''}
                                            onChange={(e) => setUser({ ...user, profile: { ...user.profile, gender: e.target.value } })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white outline-none transition-all font-medium"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {updating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Address Book */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Address Book</h2>
                                    <p className="text-gray-500 text-sm">Manage your shipping and billing addresses</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setCurrentAddress({ type: 'home', country: 'Nepal', isDefault: addresses.length === 0 });
                                        setShowAddressModal(true);
                                    }}
                                    className="bg-teal-50 text-teal-600 hover:bg-teal-100 font-bold px-4 py-2 rounded-xl transition"
                                >
                                    + Add New
                                </button>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.length === 0 ? (
                                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-400 font-medium">No addresses saved yet</p>
                                    </div>
                                ) : (
                                    addresses.map((addr) => (
                                        <div key={addr._id} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all relative group">
                                            {addr.isDefault && (
                                                <span className="absolute top-4 right-4 bg-teal-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Default</span>
                                            )}
                                            <p className="text-xs font-black text-teal-600 uppercase mb-2">{addr.type}</p>
                                            <p className="font-bold text-gray-900 mb-1">{addr.name}</p>
                                            <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
                                            <p className="text-sm text-gray-600 mb-3">{addr.city}, {addr.zipCode}</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setCurrentAddress(addr);
                                                        setShowAddressModal(true);
                                                    }}
                                                    className="text-xs font-bold text-teal-600 hover:underline"
                                                >Edit</button>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr._id)}
                                                    className="text-xs font-bold text-red-500 hover:underline"
                                                >Delete</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Loyalty & Activity */}
                    <div className="space-y-8">
                        {/* Loyalty Card */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">💎</div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-sm">👑</span>
                                Membership Status
                            </h3>
                            <div className="mb-8">
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Current Tier</p>
                                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 uppercase tracking-tighter">
                                    {loyalty?.currentTier || 'BRONZE'}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-gray-400">Total Points</span>
                                        <span className="text-teal-400">{loyalty?.totalPoints || 0} pts</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-1000"
                                            style={{ width: `${Math.min(((loyalty?.totalPoints || 0) / (loyalty?.nextTierThreshold || 1000)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 text-right">
                                        {loyalty?.pointsToNextTier || 1000} more points to reach next tier
                                    </p>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-bold transition-all text-sm">
                                View Rewards Catalog
                            </button>
                        </div>

                        {/* Order History link card */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <a href="/my-orders" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-teal-50 group transition">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📦</span>
                                        <span className="font-bold text-gray-700 group-hover:text-teal-600">My Orders</span>
                                    </div>
                                    <span className="text-gray-400 group-hover:translate-x-1 transition">→</span>
                                </a>
                                <a href="/dashboard/wishlist" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-teal-50 group transition">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">❤️</span>
                                        <span className="font-bold text-gray-700 group-hover:text-teal-600">Wishlist</span>
                                    </div>
                                    <span className="text-gray-400 group-hover:translate-x-1 transition">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddressModal(false)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">{currentAddress?._id ? 'Edit Address' : 'New Address'}</h3>
                            <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
                        </div>
                        <form onSubmit={handleSaveAddress} className="p-8 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Address Label</label>
                                    <div className="flex gap-2">
                                        {['home', 'work', 'other'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setCurrentAddress({ ...currentAddress, type: type as any })}
                                                className={`flex-1 py-2 rounded-xl border-2 font-bold text-xs uppercase transition ${currentAddress?.type === type ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-100 text-gray-400'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={currentAddress?.name || ''}
                                        onChange={(e) => setCurrentAddress({ ...currentAddress, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                                    <input
                                        required
                                        type="text"
                                        value={currentAddress?.phone || ''}
                                        onChange={(e) => setCurrentAddress({ ...currentAddress, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Street Address</label>
                                    <input
                                        required
                                        type="text"
                                        value={currentAddress?.address || ''}
                                        onChange={(e) => setCurrentAddress({ ...currentAddress, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">City</label>
                                    <input
                                        required
                                        type="text"
                                        value={currentAddress?.city || ''}
                                        onChange={(e) => setCurrentAddress({ ...currentAddress, city: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Zip Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={currentAddress?.zipCode || ''}
                                        onChange={(e) => setCurrentAddress({ ...currentAddress, zipCode: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-teal-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="default"
                                    checked={currentAddress?.isDefault}
                                    onChange={(e) => setCurrentAddress({ ...currentAddress, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-teal-500 rounded"
                                />
                                <label htmlFor="default" className="text-sm font-bold text-gray-600">Set as default address</label>
                            </div>
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {updating ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

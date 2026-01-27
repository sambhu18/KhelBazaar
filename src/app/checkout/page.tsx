"use client";

import { useEffect, useState } from "react";
import API from "@/src/Services/api";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "esewa"
  });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Fix: authenticated users might not have cart in local storage
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await API.get("/users/cart");
          // Backend returns { cartItems, totalPrice }
          // We need to map it to match the structure used in checkout (which seems to expect array directly?)
          // The current cart/page.tsx uses res.data.cartItems.
          setCart(res.data.cartItems || []);
        } catch (err) {
          console.error("Failed to fetch cart", err);
        }
      } else {
        setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
      }
    };
    fetchCart();
  }, []);

  const subtotal = cart.reduce((a: any, b: any) => a + (b.price * b.quantity), 0);
  const tax = Math.round(subtotal * 0.13);
  const shipping = subtotal > 2000 ? 0 : 100;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      setLoading(true);
      await API.post("/orders", {
        items: cart,
        total,
        ...formData
      });

      alert("Order placed successfully! Redirecting to payment...");
      localStorage.removeItem("cart");
      // Redirect to payment
      window.location.href = "/";
    } catch (error) {
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#00B8AE] via-teal-500 to-cyan-500 text-white relative overflow-hidden py-12 px-6 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">💳 Checkout</h1>
          <p className="text-teal-100 text-lg">Complete your purchase securely</p>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-7xl mb-6">📦</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 text-lg">Add items to your cart to checkout</p>
              <Link
                href="/products"
                className="inline-block bg-linear-to-r from-[#00B8AE] to-teal-500 text-white px-10 py-4 rounded-lg font-bold hover:shadow-lg transition text-lg"
              >
                Continue Shopping 🏃
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                {/* Steps */}
                <div className="flex gap-4 mb-8">
                  {[1, 2, 3].map(s => (
                    <div
                      key={s}
                      className={`flex-1 py-4 px-4 rounded-lg font-bold text-center transition ${step >= s
                        ? 'bg-[#00B8AE] text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      Step {s}
                    </div>
                  ))}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00B8AE] font-medium"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00B8AE] font-medium"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00B8AE] font-medium"
                            placeholder="+977 9800000000"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="w-full bg-linear-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transition mt-8"
                        >
                          Continue to Address →
                        </button>
                      </div>
                    )}

                    {/* Step 2: Shipping Address */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00B8AE] font-medium"
                            placeholder="123 Main Street"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00B8AE] font-medium"
                              placeholder="Kathmandu"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code *</label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00B8AE] font-medium"
                              placeholder="44600"
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-lg hover:bg-gray-50 transition"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="flex-1 bg-linear-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transition"
                          >
                            Continue to Payment →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                        <div className="space-y-4">
                          <label className="block p-4 border-2 border-[#00B8AE] rounded-lg cursor-pointer bg-[#00B8AE]/5">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="esewa"
                              checked={formData.paymentMethod === "esewa"}
                              onChange={handleInputChange}
                              className="mr-3"
                            />
                            <span className="font-bold text-gray-900">eSewa</span>
                            <p className="text-sm text-gray-600 mt-1">Pay securely with eSewa</p>
                          </label>

                          <label className="block p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#00B8AE]">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="khalti"
                              checked={formData.paymentMethod === "khalti"}
                              onChange={handleInputChange}
                              className="mr-3"
                            />
                            <span className="font-bold text-gray-900">Khalti</span>
                            <p className="text-sm text-gray-600 mt-1">Pay with Khalti digital wallet</p>
                          </label>

                          <label className="block p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#00B8AE]">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cod"
                              checked={formData.paymentMethod === "cod"}
                              onChange={handleInputChange}
                              className="mr-3"
                            />
                            <span className="font-bold text-gray-900">Cash on Delivery</span>
                            <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
                          </label>
                        </div>

                        <div className="flex gap-4 mt-8">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-lg hover:bg-gray-50 transition"
                          >
                            ← Back
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-linear-to-r from-[#00B8AE] to-teal-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                          >
                            {loading ? "Processing..." : "Place Order 🎉"}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200 max-h-64 overflow-y-auto">
                    {cart.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700 truncate flex-1">{item.title}</span>
                        <span className="text-gray-900 font-semibold ml-2">NPR {item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-bold">NPR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (13%)</span>
                      <span className="font-bold">NPR {tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {shipping === 0 ? 'FREE ✓' : `NPR ${shipping}`}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center p-5 bg-linear-to-r from-[#00B8AE]/10 to-teal-50 rounded-xl">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-[#00B8AE]">NPR {total.toLocaleString()}</span>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-8 pt-8 border-t-2 border-gray-200 space-y-4 text-center text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🔒</span>
                      <span className="font-medium text-gray-700">Secure Checkout</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">✓</span>
                      <span className="font-medium text-gray-700">30-Day Returns</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🚚</span>
                      <span className="font-medium text-gray-700">Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


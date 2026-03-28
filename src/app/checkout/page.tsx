"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/src/Services/api";
import API from "@/src/Services/api";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "esewa",
  });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await getCart();
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

  const subtotal = cart.reduce((a: any, b: any) => a + b.price * b.quantity, 0);
  const tax = Math.round(subtotal * 0.13);
  const shipping = subtotal > 2000 ? 0 : 100;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    try {
      setLoading(true);

      const orderRes = await API.post("/api/orders", {
        items: cart,
        total,
        shippingAddress: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
      });

      const orderId = orderRes.data?.order?._id;
      if (token) {
        try {
          await API.delete("/api/users/cart/clear");
        } catch (err) {
          console.error("Failed to clear online cart", err);
        }
      }
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event('cartUpdated'));

      if (formData.paymentMethod === "esewa") {
        const esewaRes = await API.post("/api/esewa/initiate", { orderId });
        const { paymentUrl, params } = esewaRes.data;

        const form = document.createElement("form");
        form.method = "POST";
        form.action = paymentUrl;

        Object.entries(params).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Order placed successfully!");
        window.location.href = "/my-orders";
      }
    } catch (error: any) {
      const msg = error?.response?.data?.msg || "Error placing order. Please try again.";
      alert(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-[#00B8AE] via-teal-500 to-cyan-500 text-white relative overflow-hidden py-12 px-6 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-5xl font-bold mb-2">Checkout</h1>
          <p className="text-teal-100 text-lg">Complete your purchase securely</p>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mx-auto text-gray-300 mb-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 text-lg">Add items to your cart to checkout</p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white px-10 py-4 rounded-lg font-bold hover:shadow-lg transition text-lg"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#00B8AE] outline-none transition-all font-medium" placeholder="E.g. Sabin Thapa" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#00B8AE] outline-none transition-all font-medium" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#00B8AE] outline-none transition-all font-medium" placeholder="98XXXXXXXX" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Shipping Address</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Street Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#00B8AE] outline-none transition-all font-medium" placeholder="House No, Street Name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#00B8AE] outline-none transition-all font-medium" placeholder="Kathmandu" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Postal Code</label>
                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#00B8AE] outline-none transition-all font-medium" placeholder="44600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Payment Method</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className={`relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'esewa' ? 'border-[#6DC12B] bg-green-50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}>
                        <input type="radio" name="paymentMethod" value="esewa" checked={formData.paymentMethod === 'esewa'} onChange={handleInputChange} className="absolute opacity-0" />
                        <span className="font-black text-xl text-gray-900">eSewa</span>
                        <span className="text-sm text-gray-500 mt-1">Instant Payment Redirect</span>
                        {formData.paymentMethod === 'esewa' && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-[#6DC12B] rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                        )}
                      </label>
                      <label className={`relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod' ? 'border-[#00B8AE] bg-teal-50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}>
                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="absolute opacity-0" />
                        <span className="font-black text-xl text-gray-900 text-nowrap">Cash On Delivery</span>
                        <span className="text-sm text-gray-500 mt-1">Pay at your doorstep</span>
                        {formData.paymentMethod === 'cod' && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-[#00B8AE] rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                        )}
                      </label>
                    </div>

                    {formData.paymentMethod === 'esewa' && (
                      <div className="mt-6 p-4 bg-green-100/50 rounded-xl border border-green-200 text-sm text-green-800 leading-relaxed">
                        Securely pay via eSewa. You will be redirected to complete the payment.
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-4 sticky top-24">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 overflow-hidden">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 uppercase tracking-wider text-center">Summary</h2>
                  <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center group">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800 group-hover:text-[#00B8AE] transition-colors line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.quantity} × NPR {item.price}</p>
                        </div>
                        <p className="text-sm font-black text-gray-900 ml-4 italic">NPR {item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 border-t border-gray-100 pt-6">
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-bold">NPR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span>Tax (13%)</span>
                      <span className="text-gray-900 font-bold">NPR {tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 font-medium pb-2">
                       <span>Shipping</span>
                       <span className={`font-bold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                        {shipping === 0 ? "FREE" : `NPR ${shipping}`}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-black text-[#00B8AE]">NPR {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={loading || cart.length === 0}
                    className="w-full mt-8 py-5 bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(0,184,174,0.3)] hover:shadow-[0_15px_40px_rgba(0,184,174,0.5)] transform hover:-translate-y-1 transition-all text-xl disabled:opacity-50"
                  >
                    {loading ? "PROCESSING..." : "PLACE ORDER"}
                  </button>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">🔒 SECURE</span>
                    <span className="flex items-center gap-1">💳 ESEWA</span>
                    <span className="flex items-center gap-1">🚚 FAST DELIVERY</span>
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

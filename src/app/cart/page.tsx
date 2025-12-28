"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);
    const initialQties: any = {};
    cartData.forEach((item: any, index: number) => {
      initialQties[index] = item.qty || 1;
    });
    setQuantities(initialQties);
    setLoading(false);
  }, []);

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) {
      removeItem(index);
      return;
    }
    setQuantities({ ...quantities, [index]: newQty });
    const updatedCart = [...cart];
    updatedCart[index].qty = newQty;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    setQuantities(Object.fromEntries(
      Object.entries(quantities).filter(([key]) => parseInt(key) !== index)
    ));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = cart.reduce((sum: number, item: any) => sum + (item.price * (quantities[cart.indexOf(item)] || 1)), 0);
  const tax = Math.round(subtotal * 0.13); // 13% tax
  const shipping = subtotal > 2000 ? 0 : 100;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛒 Shopping Cart</h1>
          <p className="text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        {cart.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping and add some amazing sports gear to your cart!</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item: any, i: number) => (
                <div key={i} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
                  <div className="p-6 flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.images?.[0] || "/placeholder.jpg"}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>

                      {/* Customization Info */}
                      {item.customization && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">📝 Customization:</span> {item.customization.name} #{item.customization.number}
                          </p>
                        </div>
                      )}

                      {/* Price */}
                      <p className="text-xl font-bold text-green-600 mb-4">
                        NPR {item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(i, (quantities[i] || 1) - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 font-semibold text-gray-900">
                            {quantities[i] || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(i, (quantities[i] || 1) + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(i)}
                          className="ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Button */}
              <Link
                href="/products"
                className="inline-block text-blue-600 font-semibold hover:text-blue-700 mt-6"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (13%)</span>
                    <span className="font-semibold">NPR {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">FREE ✓</span>
                    ) : (
                      <span className="font-semibold">NPR {shipping}</span>
                    )}
                  </div>
                </div>

                {/* Free Shipping Message */}
                {shipping === 0 && (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">✓ Free shipping!</p>
                  </div>
                )}

                {shipping > 0 && subtotal < 2000 && (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      Add NPR {(2000 - subtotal).toLocaleString()} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">NPR {total.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 mb-3"
                >
                  🚀 Proceed to Checkout
                </Link>

                {/* Continue Shopping Button */}
                <button
                  onClick={() => router.push("/products")}
                  className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-600 space-y-2">
                  <p>🔒 Secure checkout</p>
                  <p>✓ Money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/src/Services/axiosinstance";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "https://placehold.co/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const base = process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:5001';
    return `${base}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

      if (token) {
        // Authenticated
        const response = await axiosInstance.get("/api/users/cart");
        setCartItems(response.data.cartItems);
        setTotalPrice(response.data.totalPrice);
      } else {
        // Guest - Load from LocalStorage
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        // Calculate subtotal for each item and total price
        const enrichedCart = localCart.map((item: any) => ({
          ...item,
          productId: item.productId, // Ensure compatibility
          subtotal: item.price * item.quantity
        }));

        const total = enrichedCart.reduce((sum: number, item: any) => sum + item.subtotal, 0);

        setCartItems(enrichedCart);
        setTotalPrice(total);
      }
    } catch (error: any) {
      console.error("Cart fetch error", error);
      setErrorMsg("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number, size?: string, customization?: any) => {
    if (quantity < 1) {
      handleRemoveItem(productId, size, customization);
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
      try {
        setErrorMsg("");
        await axiosInstance.put("/api/users/cart/update", { productId, quantity, size, customization });
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
        setSuccessMsg("Quantity updated!");
        setTimeout(() => setSuccessMsg(""), 2000);
      } catch (error: any) {
        setErrorMsg("Failed to update quantity");
      }
    } else {
      // Guest Mode
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const item = cart.find((i: any) =>
        i.productId === productId &&
        i.size === size &&
        (i.customization?.name === customization?.name && i.customization?.number === customization?.number)
      );
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
        setSuccessMsg("Quantity updated!");
        setTimeout(() => setSuccessMsg(""), 2000);
      }
    }
  };

  const handleRemoveItem = async (productId: string, size?: string, customization?: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
      try {
        setErrorMsg("");
        await axiosInstance.post("/api/users/cart/remove", { productId, size, customization });
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
        setSuccessMsg("Item removed from cart!");
        setTimeout(() => setSuccessMsg(""), 2000);
      } catch (error: any) {
        setErrorMsg("Failed to remove item");
      }
    } else {
      // Guest Mode
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      // Filter out item with matching ID AND Size AND Customization
      cart = cart.filter((i: any) => !(
        i.productId === productId &&
        i.size === size &&
        (i.customization?.name === customization?.name && i.customization?.number === customization?.number)
      ));
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
      setSuccessMsg("Item removed from cart!");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
      try {
        setErrorMsg("");
        await axiosInstance.delete("/api/users/cart/clear");
        setCartItems([]);
        setTotalPrice(0);
        window.dispatchEvent(new Event('cartUpdated'));
        setSuccessMsg("Cart cleared!");
        setTimeout(() => setSuccessMsg(""), 2000);
      } catch (error: any) {
        setErrorMsg("Failed to clear cart");
      }
    } else {
      // Guest Mode
      localStorage.removeItem("cart");
      setCartItems([]);
      setTotalPrice(0);
      window.dispatchEvent(new Event('cartUpdated'));
      setSuccessMsg("Cart cleared!");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#00B8AE] to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-xl font-black text-gray-900">
                    Your Cart ({cartItems.length} items)
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors bg-red-50 px-3 py-1.5 rounded-lg"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
                    <div key={item.cartItemId || `${item.productId}-${item.size}-${JSON.stringify(item.customization)}-${index}`} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-28 h-28 object-cover rounded-2xl shadow-sm"
                      />

                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                        {item.size && (
                          <p className="text-gray-500 text-sm mb-2 font-medium">Size: <span className="font-bold text-gray-800">{item.size}</span></p>
                        )}
                        {item.customization && (item.customization.name || item.customization.number) && (
                          <div className="text-sm font-medium text-teal-700 bg-teal-50 inline-block px-3 py-1.5 rounded-lg border border-teal-100 mb-2">
                            {item.customization.name && <span className="mr-2">{item.customization.name}</span>}
                            {item.customization.number && <span>#{item.customization.number}</span>}
                          </div>
                        )}
                        <p className="text-[#00B8AE] font-black text-lg">NPR {item.price}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                        <div className="flex items-center gap-1 bg-white border-2 border-gray-100 rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.size)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00B8AE] hover:bg-teal-50 rounded-lg transition-colors font-bold"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            readOnly
                            className="w-10 text-center text-gray-900 font-bold focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.size)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00B8AE] hover:bg-teal-50 rounded-lg transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right flex flex-col items-end">
                          <p className="font-black text-gray-900 text-lg">NPR {item.subtotal}</p>
                          <button
                            onClick={() => handleRemoveItem(item.productId, item.size, item.customization)}
                            className="text-sm text-red-500 hover:text-red-600 font-semibold mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-100">
                  <div className="flex justify-between text-base font-medium text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">NPR {totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-600">
                    <span>Shipping</span>
                    <span className="text-[#00B8AE] font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-600">
                    <span>Tax</span>
                    <span className="text-gray-400 italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-xl">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="text-3xl font-black text-[#00B8AE]">NPR {totalPrice}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 bg-gradient-to-r from-[#00B8AE] to-teal-500 hover:shadow-lg text-white font-black rounded-xl transition-all mb-4 text-lg"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="block w-full py-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-[#00B8AE] hover:text-[#00B8AE] font-bold rounded-xl transition-all text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

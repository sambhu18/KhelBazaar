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
      setSuccessMsg("Cart cleared!");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">
                    Items in Cart ({cartItems.length})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <div key={item.cartItemId || `${item.productId}-${item.size}-${JSON.stringify(item.customization)}-${index}`} className="p-6 flex gap-4">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        {item.size && (
                          <p className="text-gray-500 text-sm mt-1">Size: <span className="font-medium">{item.size}</span></p>
                        )}
                        {item.customization && (item.customization.name || item.customization.number) && (
                          <div className="text-sm text-gray-500 mt-1 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-200">
                            {item.customization.name && <span className="mr-2 font-bold">{item.customization.name}</span>}
                            {item.customization.number && <span>#{item.customization.number}</span>}
                          </div>
                        )}
                        <p className="text-purple-600 font-semibold mt-2">{item.price}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.size)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(item.productId, parseInt(e.target.value), item.size)
                          }
                          className="w-12 text-center border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.size)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{item.subtotal}</p>
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.size, item.customization)}
                          className="text-xs text-red-600 hover:text-red-800 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-purple-600">{totalPrice}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="block w-full px-6 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg transition-colors text-center"
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

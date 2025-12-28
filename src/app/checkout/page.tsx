"use client";

import { useEffect, useState } from "react";
import API from "@/src/Services/api";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const total = cart.reduce((a: any, b: any) => a + b.price, 0);

  const pay = async () => {
    const token = localStorage.getItem("token");
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await API.post("/orders", {
      items: cart,
      address,
      total,
    });

    alert("Order placed! Redirecting to payment...");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <textarea
        className="border p-3 w-full"
        placeholder="Shipping Address"
        onChange={(e) => setAddress(e.target.value)}
      />

      <p className="text-xl font-bold mt-4">Total: NPR {total}</p>

      <button
        onClick={pay}
        className="mt-4 px-6 py-3 bg-blue-700 text-white rounded"
      >
        Pay with eSewa/Khalti
      </button>
    </div>
  );
}

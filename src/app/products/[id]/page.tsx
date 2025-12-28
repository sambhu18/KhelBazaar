"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import API from "@/src/Services/api";

function ProductDetailsContent({ params }: { params: any }) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [custom, setCustom] = useState({ name: "", number: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.msg || "Failed to load product");
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-10 text-lg">Loading product...</p>;
  if (error) return <p className="p-10 text-red-600">Error: {error}</p>;
  if (!product) return <p className="p-10 text-red-600">Product not found</p>;

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      ...product,
      customization: custom,
      qty: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  };

  return (
    <div className="p-10">
      <div className="flex gap-10">
        <img src={product.images?.[0]} className="w-96 h-96 object-cover" />

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="mt-2">{product.description}</p>

          <p className="text-green-700 font-bold mt-4">
            NPR {product.price}
          </p>

          {product.category === "jersey" && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Customize Jersey</h3>

              <input
                placeholder="Name"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                  setCustom({ ...custom, name: e.target.value })
                }
              />

              <input
                placeholder="Number"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                  setCustom({ ...custom, number: e.target.value })
                }
              />

              <p className="text-sm text-gray-600 mb-4">
                *3D preview will appear here in final implementation
              </p>
            </div>
          )}

          <button
            onClick={addToCart}
            className="px-6 py-3 bg-blue-600 text-white rounded"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails({ params }: { params: any }) {
  return (
    <Suspense fallback={<p className="p-10 text-lg">Loading...</p>}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

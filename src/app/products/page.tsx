"use client";

import API from "@/src/Services/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getImageUrl } from "@/src/Services/imgUtils";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    
    const search = searchParams.get("search");
    if (search !== null) setSearchTerm(search);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/api/products");
        const productData = response.data.products || response.data || [];
        setProducts(productData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["all", ...new Set((products || []).map((p: any) => p.category || "sports"))];

  let filteredProducts = (products || []).filter((p: any) => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "all" || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
      return matchSearch && matchCategory;
  });

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts].reverse();
  }

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newUrl = cat === "all" ? "/products" : `/products?category=${cat}`;
    router.replace(newUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="pt-[90px] px-6 mb-12">
        <section className="relative h-[25vh] min-h-[250px] flex items-center overflow-hidden bg-black rounded-[40px] shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-[10000ms]"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2073&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
          <div className="relative max-w-7xl mx-auto px-12 z-20 w-full">
            <h1 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight uppercase">
              THE <span className="text-gradient text-glow">SHOP</span>
            </h1>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
            <input
                type="text"
                placeholder="Search premium gear..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="grow w-full md:w-auto px-5 py-3 border-2 border-gray-100 rounded-lg focus:border-[#00B8AE] outline-none font-medium"
            />
            <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? "bg-white text-[#00B8AE] shadow-md" : "text-gray-400"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-100 rounded-lg outline-none font-bold text-xs"
            >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price Low-High</option>
                <option value="price-high">Price High-Low</option>
            </select>
        </div>

        {loading ? (
             <div className="text-center py-24 text-gray-400 font-bold uppercase tracking-widest animate-pulse">Scanning the Arena...</div>
        ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-300 font-bold italic">No gear matches your discipline.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-20">
            {filteredProducts.map((p: any) => (
              <div key={p._id} className="group bg-white rounded-[40px] border border-gray-100 p-5 shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-4">
                <Link href={`/products/${p._id}`} className="block">
                  <div className="relative overflow-hidden bg-gray-50 aspect-square rounded-[32px] mb-6">
                    <img
                      src={getImageUrl(p.images?.[0])}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                    />
                  </div>
                  <p className="text-[#00B8AE] text-[10px] font-black uppercase tracking-[0.2em] mb-2">{p.category || 'Sports'}</p>
                  <h3 className="font-bold text-gray-950 text-xl mb-4 group-hover:text-[#00B8AE] transition line-clamp-2">{p.title}</h3>
                  <div className="flex items-center justify-between">
                     <p className="text-2xl font-black text-gray-950">NPR {p.price}</p>
                     <button
                        onClick={async (e) => {
                          e.preventDefault(); e.stopPropagation();
                          if (p.sizes?.length > 0) { router.push(`/products/${p._id}`); return; }
                          const { addToCart } = await import("@/src/Services/cartUtils");
                          const result = await addToCart(p);
                          if (result.requiresLogin) {
                            router.push("/auth/Login");
                          }
                        }}
                        className="w-12 h-12 rounded-full bg-gray-950 text-white flex items-center justify-center font-bold text-lg hover:bg-[#00B8AE] transition-all active:scale-90"
                      >+</button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center uppercase font-black tracking-widest text-gray-300">Loading Elite Gears...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

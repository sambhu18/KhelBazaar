"use client";

import { useState, useEffect } from "react";

export default function Toast() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error">("success");

  useEffect(() => {
    const handleToast = (e: any) => {
      setMessage(e.detail.message);
      setType(e.detail.type || "success");
      setShow(true);
      
      setTimeout(() => {
        setShow(false);
      }, 3000);
    };

    window.addEventListener("show-toast" as any, handleToast);
    return () => window.removeEventListener("show-toast" as any, handleToast);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
      <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-xl border-2 transition-all duration-500 ${
        type === "success" 
          ? "bg-[#00B8AE]/90 border-teal-400/50 text-white" 
          : "bg-rose-500/90 border-rose-400/50 text-white"
      }`}>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">
          {type === "success" ? "✓" : "!"}
        </div>
        <p className="font-black uppercase tracking-widest text-sm italic">{message}</p>
      </div>
    </div>
  );
}

export const showToast = (message: string, type: "success" | "error" = "success") => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: { message, type } }));
  }
};

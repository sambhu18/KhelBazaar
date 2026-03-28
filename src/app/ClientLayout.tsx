"use client";

import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Toast from "../component/Toast";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh]">
        {children}
      </main>
      <Footer />
      <Toast />
    </>
  );
}

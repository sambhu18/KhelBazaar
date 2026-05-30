"use client";

import { usePathname } from "next/navigation";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Toast from "../component/Toast";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Don't show navbar and footer for admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main className={isAdminPage ? "" : "min-h-[80vh]"}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
      <Toast />
    </>
  );
}

"use client";

import Footer from "@/src/component/Footer";
import Navbar from "@/src/component/Navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {/* ✅ Page Content */}
        {children}
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}
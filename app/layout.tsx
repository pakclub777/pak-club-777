"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/Authcontext";
import BottomNav from "./components/BottomNav";
import { supabase } from "@/lib/supabaseClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user_logged_in");
    localStorage.removeItem("sb-session");
    window.location.href = "/login";
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0f17] text-white">
        <AuthProvider>
          {/* Top Header Bar with Logout Button */}
          <header className="bg-[#141c2b] border-b border-gray-800 p-3 flex justify-between items-center max-w-lg mx-auto w-full sticky top-0 z-50">
            <span className="text-amber-400 font-black text-sm tracking-wider">
              👑 PAK CLUB 777
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              🚪 Logout
            </button>
          </header>

          <div className="flex-1 pb-16">{children}</div>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
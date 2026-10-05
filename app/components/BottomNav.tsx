"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Promo", href: "/promo", icon: "🎁" },
    { name: "Invite", href: "/invite", icon: "👥" },
    { name: "Support", href: "/support", icon: "🎧" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#141c2b] border-t border-amber-500/20 py-2 px-4 z-50 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-all ${
                isActive ? "text-amber-400 scale-105" : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
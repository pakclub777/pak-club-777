"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function PromoPage() {
  const [activeTab, setActiveTab] = useState("EVENT");

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-4 pb-24 max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/" className="text-xl text-gray-400 hover:text-white">
          ←
        </Link>
        <h1 className="text-xl font-bold text-amber-400">Promotions & Rewards</h1>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 bg-[#141c2b] p-1.5 rounded-xl border border-gray-800 mb-5 text-xs font-bold">
        {["EVENT", "UNCLAIMED", "VIP"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === tab
                ? "bg-amber-500 text-black shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "EVENT" && (
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-4 border border-amber-500/40 relative overflow-hidden">
            <span className="bg-black/40 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">LIMITED TIME</span>
            <h2 className="text-xl font-black text-white mt-2">INVITE 5 FRIENDS & GET 5,000 RS</h2>
            <p className="text-xs text-white/90 mt-1">Har friend ke join karne par instant bonus haasil karein.</p>
          </div>

          <div className="bg-[#141c2b] rounded-2xl p-4 border border-gray-800">
            <div className="text-2xl mb-1">🎰</div>
            <h3 className="font-bold text-sm text-amber-400">Daily Deposit Bonus</h3>
            <p className="text-xs text-gray-400 mt-1">Har roz pehli deposit par extra 10% cash bonus paayein.</p>
          </div>
        </div>
      )}

      {activeTab === "UNCLAIMED" && (
        <div className="bg-[#141c2b] rounded-2xl p-5 border border-gray-800 text-center">
          <div className="text-4xl mb-2">🎁</div>
          <h3 className="font-bold text-amber-400 text-base">Mystery Chest Reward</h3>
          <p className="text-xs text-gray-400 mt-1">Rs. 700 Bonus Available</p>
          <button className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase shadow-lg">
            Claim Reward
          </button>
        </div>
      )}

      {activeTab === "VIP" && (
        <div className="bg-[#141c2b] rounded-2xl p-4 border border-gray-800 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-amber-400">VIP Level Status</h3>
              <p className="text-[11px] text-gray-400">Current Level: VIP 1</p>
            </div>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
              VIP 1
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Weekly VIP Claim:</span>
              <span className="font-bold text-green-400">Rs. 500</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Monthly Cashback:</span>
              <span className="font-bold text-green-400">5%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
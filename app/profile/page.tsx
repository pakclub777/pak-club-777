"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/Authcontext";

export default function ProfilePage() {
  const { balance, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-4 pb-24 max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-amber-400">My Profile</h1>
        <Link href="/support" className="text-sm bg-[#141c2b] px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300">
          🎧 Help
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-[#141c2b] border border-amber-500/30 rounded-2xl p-4 mb-4 flex items-center gap-4 shadow-lg">
        <div className="w-14 h-14 bg-amber-500/20 rounded-full border-2 border-amber-500 flex items-center justify-center text-2xl">
          👤
        </div>
        <div>
          <h2 className="font-extrabold text-sm text-white">Pak Club Player</h2>
          <p className="text-[11px] text-gray-400 font-mono">ID: {user?.id ? user.id.slice(0, 8) : "7771597"}</p>
          <div className="mt-1 text-xs font-black text-green-400">
            PKR {balance ? balance.toLocaleString() : "0.00"}
          </div>
        </div>
      </div>

      {/* Quick Actions (Deposit / Withdraw) */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link href="/deposit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-center py-3 rounded-xl uppercase text-xs shadow-md">
          Deposit
        </Link>
        <Link href="/withdraw" className="bg-[#182234] border border-amber-500/40 text-amber-400 font-extrabold text-center py-3 rounded-xl uppercase text-xs">
          Withdraw
        </Link>
      </div>

      {/* VIP Progress */}
      <div className="bg-[#141c2b] p-4 rounded-2xl border border-gray-800 mb-5">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-bold text-amber-400">VIP 1 Level</span>
          <span className="text-[10px] text-gray-400">0% Progress</span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full w-[15%]"></div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-[#141c2b] rounded-2xl border border-gray-800 divide-y divide-gray-800/60 text-xs font-semibold">
        <Link href="/records" className="flex justify-between p-4 hover:bg-gray-800/30 transition-all">
          <span>📜 Transaction Records</span>
          <span className="text-gray-500">→</span>
        </Link>
        <Link href="/withdraw" className="flex justify-between p-4 hover:bg-gray-800/30 transition-all">
          <span>💳 Withdrawal Accounts</span>
          <span className="text-gray-500">→</span>
        </Link>
        <Link href="/invite" className="flex justify-between p-4 hover:bg-gray-800/30 transition-all">
          <span>👥 Invite Friends & Earn</span>
          <span className="text-gray-500">→</span>
        </Link>
        <Link href="/support" className="flex justify-between p-4 hover:bg-gray-800/30 transition-all">
          <span>🔒 Security & Center</span>
          <span className="text-gray-500">→</span>
        </Link>
      </div>
    </div>
  );
}
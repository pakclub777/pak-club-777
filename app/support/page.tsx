"use client";
import React from "react";
import Link from "next/link";

export default function SupportPage() {
  const whatsappChannelLink = "https://whatsapp.com/channel/0029VbDtcX0DZ4LUCm22Gt0Z";

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-xl text-gray-400 hover:text-white">
          ←
        </Link>
        <h1 className="text-xl font-bold text-amber-400">Customer Support</h1>
      </div>

      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-4 mb-6 shadow-lg">
        <div className="text-3xl mb-1">🎧</div>
        <h2 className="text-lg font-black text-black">24/7 Live Support</h2>
        <p className="text-xs text-black/80 font-medium mt-1">
          Kisi bhi maslay (Deposit, Withdraw, Game) ke hal ke liye humse rabta karein.
        </p>
      </div>

      {/* Support Options */}
      <div className="flex flex-col gap-3">
        {/* WhatsApp Official Channel */}
        <a
          href={whatsappChannelLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#141c2b] border border-green-500/40 hover:border-green-400 p-4 rounded-xl flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📢</span>
            <div>
              <h3 className="font-bold text-sm text-green-400">Pak Club 777 Channel</h3>
              <p className="text-[11px] text-gray-400">Official WhatsApp Updates & Support</p>
            </div>
          </div>
          <span className="bg-green-500 text-black font-extrabold px-3 py-1 rounded-lg text-xs">
            Follow →
          </span>
        </a>

        {/* Telegram Channel */}
        <a
          href="https://t.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#141c2b] border border-gray-800 hover:border-amber-500/50 p-4 rounded-xl flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            <div>
              <h3 className="font-bold text-sm">Telegram Channel</h3>
              <p className="text-[11px] text-gray-400">Official Telegram Channel</p>
            </div>
          </div>
          <span className="text-amber-400 font-bold text-sm">Join →</span>
        </a>

        {/* Live Chat */}
        <div className="bg-[#141c2b] border border-gray-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-bold text-sm">Instant Live Chat</h3>
              <p className="text-[11px] text-gray-400">Response time: 1-2 mins</p>
            </div>
          </div>
          <button className="bg-amber-500 text-black font-extrabold px-3 py-1.5 rounded-lg text-xs">
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
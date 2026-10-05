"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

const MULTIPLIERS = [100, 15, 3, 1.5, 0.3, 1.5, 3, 15, 100];

export default function PlinkoGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [betAmount, setBetAmount] = useState<number>(50);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [winHistory, setWinHistory] = useState<number[]>([1.5, 0.3, 3, 15]);
  const [isDropping, setIsDropping] = useState<boolean>(false);

  // Live Stats Feed Simulation
  const [liveWins, setLiveWins] = useState([
    { phone: "0301***45", amount: "750 PKR", mult: "15x" },
    { phone: "0321***12", amount: "150 PKR", mult: "3x" },
    { phone: "0345***88", amount: "5000 PKR", mult: "100x" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const phones = ["0300", "0312", "0333", "0341", "0322"];
      const mults = [1.5, 3, 15, 100];
      const selectedMult = mults[Math.floor(Math.random() * mults.length)];
      const randomPhone = `${phones[Math.floor(Math.random() * phones.length)]}***${Math.floor(
        10 + Math.random() * 90
      )}`;
      const winAmt = Math.floor(50 * selectedMult);

      setLiveWins((prev) => [
        { phone: randomPhone, amount: `${winAmt} PKR`, mult: `${selectedMult}x` },
        ...prev.slice(0, 2),
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const dropBall = async () => {
    // Low Balance Check
    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }

    if (isDropping) return;

    // 1. Balance Deduct Karein (Database Sync)
    const success = await updateBalance(-betAmount);
    if (!success) return;

    setIsDropping(true);
    setLastWin(null);

    // Calculate Random Slot Drop
    setTimeout(async () => {
      const randomIndex = Math.floor(Math.random() * MULTIPLIERS.length);
      const mult = MULTIPLIERS[randomIndex];
      const winAmt = Math.floor(betAmount * mult);

      // 2. Winnings Add Karein (Database Sync)
      if (winAmt > 0) {
        await updateBalance(winAmt);
      }

      setLastWin(winAmt);
      setWinHistory((prev) => [mult, ...prev.slice(0, 5)]);
      setIsDropping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-4 max-w-md mx-auto flex flex-col justify-between select-none">
      {/* Top Bar */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Link href="/" className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg font-bold">
            ← Back
          </Link>
          <span className="text-amber-400 font-extrabold text-sm">🟣 PLINKO CLUB</span>

          {/* Dynamic Balance Display & Deposit Button */}
          <div className="flex items-center gap-1.5">
            <div className="bg-[#182030] border border-gray-800 rounded-full px-3 py-1 flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-200">
                PKR {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block ${
                  balance > 0 ? "bg-emerald-500" : "bg-red-500"
                }`}
              ></span>
            </div>

            <Link
              href="/deposit"
              className="bg-amber-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full hover:bg-amber-400 transition-all"
            >
              + Deposit
            </Link>
          </div>
        </div>

        {/* Multiplier History Ticker */}
        <div className="flex gap-1.5 overflow-x-auto mb-3 no-scrollbar">
          {winHistory.map((h, i) => (
            <span
              key={i}
              className={`text-[10px] font-extrabold px-2 py-1 rounded-md border ${
                h >= 10
                  ? "bg-red-950/80 border-red-500 text-red-400"
                  : h >= 1.5
                  ? "bg-amber-950/80 border-amber-500 text-amber-400"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              }`}
            >
              {h}x
            </span>
          ))}
        </div>

        {/* Plinko Pyramids & Game Board Area */}
        <div className="bg-[#141c2b] border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-between relative min-h-[280px] shadow-2xl overflow-hidden">
          {/* Animated Dropping Ball */}
          {isDropping && (
            <div className="absolute top-4 w-5 h-5 bg-purple-500 rounded-full animate-bounce shadow-[0_0_15px_#a855f7] z-20"></div>
          )}

          {/* Pegs Grid Visual Simulation */}
          <div className="w-full flex flex-col items-center gap-3 my-auto">
            <div className="flex gap-4">
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
            </div>
            <div className="flex gap-4">
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
            </div>
            <div className="flex gap-4">
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
            </div>
            <div className="flex gap-4">
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
            </div>
            <div className="flex gap-4">
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
              <span className="w-2 h-2 bg-amber-400/60 rounded-full"></span>
            </div>
          </div>

          {/* Bottom Slots Multipliers */}
          <div className="grid grid-cols-9 gap-1 w-full mt-2">
            {MULTIPLIERS.map((m, idx) => (
              <div
                key={idx}
                className={`text-[9px] font-black py-1.5 rounded text-center ${
                  m >= 100
                    ? "bg-red-600 text-white"
                    : m >= 15
                    ? "bg-orange-500 text-black"
                    : m >= 3
                    ? "bg-amber-400 text-black"
                    : "bg-purple-900 text-purple-200"
                }`}
              >
                {m}x
              </div>
            ))}
          </div>
        </div>

        {/* Live Wins Ticker */}
        <div className="mt-3 bg-[#141c2b] border border-amber-500/20 rounded-xl p-2">
          <p className="text-[10px] text-gray-400 font-bold mb-1">LIVE COMMUNITY WINS</p>
          <div className="flex flex-col gap-1">
            {liveWins.map((w, i) => (
              <div key={i} className="flex justify-between text-[11px] bg-[#0b0f17] px-2 py-1 rounded">
                <span className="text-gray-300">{w.phone}</span>
                <span className="text-purple-400 font-bold">{w.mult}</span>
                <span className="text-green-400 font-bold">+{w.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls & Drop Button */}
      <div className="bg-[#141c2b] border border-gray-800 p-4 rounded-2xl gap-3 flex flex-col mt-3">
        <div className="flex justify-between items-center bg-[#0b0f17] p-2 rounded-xl border border-gray-800">
          <button
            onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
            className="w-8 h-8 bg-gray-800 rounded-lg font-black text-amber-400 active:scale-95"
          >
            -
          </button>
          <span className="font-extrabold text-sm text-white">PKR {betAmount}</span>
          <button
            onClick={() => setBetAmount(betAmount + 10)}
            className="w-8 h-8 bg-gray-800 rounded-lg font-black text-amber-400 active:scale-95"
          >
            +
          </button>
        </div>

        {lastWin !== null && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 font-extrabold text-center py-2 rounded-xl text-xs animate-pulse">
            YOU WON PKR {lastWin}! 🎉
          </div>
        )}

        <button
          onClick={dropBall}
          disabled={isDropping}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 font-black text-white py-3.5 rounded-xl uppercase text-sm shadow-xl active:scale-95 disabled:opacity-50 transition-all"
        >
          {isDropping ? "BALL DROPPING..." : `DROP BALL (PKR ${betAmount})`}
        </button>
      </div>
    </div>
  );
}
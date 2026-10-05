"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/Authcontext"; // Path apni directory structure ke mutabiq check kar lein

export default function WheelGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [betAmount, setBetAmount] = useState<number>(10);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const spinWheel = async () => {
    // Balance Validation
    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }

    if (spinning) return;

    // 1. Balance Deduct Karein (Database Sync)
    const success = await updateBalance(-betAmount);
    if (!success) return;

    setSpinning(true);
    setWinMessage(null);

    const randomDegree = Math.floor(1440 + Math.random() * 360);
    setRotation((prev) => prev + randomDegree);

    setTimeout(async () => {
      setSpinning(false);

      // Multipliers (0x, 1.2x, 1.5x, 2x, 5x)
      const multipliers = [0, 1.2, 1.5, 2, 5];
      const selectedMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      const winAmount = Math.floor(betAmount * selectedMultiplier);

      if (winAmount > 0) {
        // 2. Winnings Add Karein (Database Sync)
        await updateBalance(winAmount);
        setWinMessage(`🎉 WIN! PKR ${winAmount} (${selectedMultiplier}x)`);
      } else {
        setWinMessage("❌ Better luck next time!");
      }
    }, 3500);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-2.5 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">☰</Link>
          <span className="font-black text-sm tracking-wide text-white">
            Z666 <span className="text-[10px] text-amber-400 font-normal block -mt-1">- WHEEL -</span>
          </span>
        </div>

        {/* Dynamic Balance Display & Deposit Link */}
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

      {/* Wheel Area */}
      <div className="relative h-52 bg-[#141a26] rounded-2xl border border-gray-800/80 flex flex-col items-center justify-center overflow-hidden my-auto gap-2">
        <div className="absolute top-2 z-20 text-red-500 text-lg font-bold">▼</div>
        <div
          className="w-36 h-36 rounded-full border-4 border-amber-400 flex items-center justify-center transition-all duration-[3500ms] ease-out bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <span className="font-black text-sm text-white">SPIN</span>
        </div>

        {/* Win / Loss Result Message */}
        {winMessage && (
          <div
            className={`text-[11px] font-extrabold px-3 py-1 rounded-lg border ${
              winMessage.includes("WIN")
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-400 animate-bounce"
                : "bg-red-950/80 border-red-500 text-red-400"
            }`}
          >
            {winMessage}
          </div>
        )}
      </div>

      {/* Bet Control Panel */}
      <div className="bg-[#141a26] border border-gray-800/80 p-2.5 rounded-2xl">
        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-6 flex flex-col gap-1.5">
            <div className="bg-[#0b0e14] border border-gray-800 rounded-lg px-2 py-1 flex justify-between items-center">
              <span className="text-xs font-bold text-white">{betAmount.toFixed(2)}</span>
              <div className="flex gap-1 text-gray-400">
                <button
                  disabled={spinning}
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  className="w-5 h-5 bg-gray-800/80 rounded flex items-center justify-center text-xs font-bold"
                >
                  -
                </button>
                <button
                  disabled={spinning}
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="w-5 h-5 bg-gray-800/80 rounded flex items-center justify-center text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  disabled={spinning}
                  onClick={() => setBetAmount(amt)}
                  className="bg-[#0b0e14] border border-gray-800/80 text-[9px] text-gray-300 py-0.5 rounded font-bold"
                >
                  {amt} PKR
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-6 h-full flex items-stretch">
            <button
              onClick={spinWheel}
              disabled={spinning}
              className="w-full bg-emerald-500 hover:bg-emerald-600 font-black text-black text-sm rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-h-[60px]"
            >
              {spinning ? "..." : "SPIN"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Tabs */}
      <div className="flex justify-center gap-6 text-xs text-gray-400 font-bold py-1 border-t border-gray-800/40">
        <button className="hover:text-white">All Bets</button>
        <button className="hover:text-white">My Bets</button>
      </div>
    </div>
  );
}
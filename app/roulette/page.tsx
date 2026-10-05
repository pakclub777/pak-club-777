"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

export default function RouletteGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedColor, setSelectedColor] = useState<"red" | "black" | "green">("red");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningColor, setWinningColor] = useState<"red" | "black" | "green" | null>(null);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const handleSpin = async () => {
    // Low Balance Check
    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }

    if (isSpinning) return;

    // 1. Balance Deduct Karein (Database Sync)
    const success = await updateBalance(-betAmount);
    if (!success) return;

    setIsSpinning(true);
    setWinningColor(null);
    setWinMessage(null);

    // Spin Calculation Simulation (Random Result)
    setTimeout(async () => {
      const rand = Math.random() * 100;
      let resultColor: "red" | "black" | "green";

      if (rand < 5) {
        resultColor = "green"; // 5% chance (14x multiplier)
      } else if (rand < 52) {
        resultColor = "red"; // 47% chance (2x multiplier)
      } else {
        resultColor = "black"; // 48% chance (2x multiplier)
      }

      setWinningColor(resultColor);
      setIsSpinning(false);

      // Profit Check & Database Balance Update
      if (resultColor === selectedColor) {
        const multiplier = resultColor === "green" ? 14 : 2;
        const winAmount = betAmount * multiplier;
        
        // 2. Winnings Add Karein (Database Sync)
        await updateBalance(winAmount);
        setWinMessage(`🎉 Mubarak ho! Aapne PKR ${winAmount} jeet liye! (${resultColor.toUpperCase()})`);
      } else {
        setWinMessage(`❌ Oh! Result ${resultColor.toUpperCase()} aaya. Agli baar try karein!`);
      }
    }, 2000);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-2.5 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">☰</Link>
          <span className="font-black text-sm tracking-wide text-white">
            Z666 <span className="text-[10px] text-red-400 font-normal block -mt-1">- ROULETTE -</span>
          </span>
        </div>

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

      {/* Animated Wheel Area */}
      <div className="bg-[#141a26] rounded-2xl border border-gray-800/80 p-4 my-auto flex flex-col items-center justify-center relative overflow-hidden min-h-[240px]">
        <div
          className={`w-40 h-40 rounded-full border-8 border-amber-500/80 flex items-center justify-center text-xl font-black transition-all duration-[2000ms] shadow-[0_0_20px_rgba(245,158,11,0.2)] ${
            isSpinning ? "rotate-[1440deg] scale-105" : ""
          } ${
            winningColor === "red"
              ? "bg-red-600 border-red-400"
              : winningColor === "black"
              ? "bg-gray-900 border-gray-600 text-white"
              : winningColor === "green"
              ? "bg-emerald-600 border-emerald-400"
              : "bg-[#0b0e14]"
          }`}
        >
          {isSpinning ? "🌀 SPINNING..." : winningColor ? winningColor.toUpperCase() : "SPIN ME"}
        </div>

        {/* Win Status Message */}
        {winMessage && (
          <div
            className={`mt-4 text-xs font-bold text-center px-3 py-1.5 rounded-lg border ${
              winMessage.includes("Mubarak")
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-400"
                : "bg-red-950/80 border-red-500 text-red-400"
            }`}
          >
            {winMessage}
          </div>
        )}
      </div>

      {/* Betting Control Box */}
      <div className="bg-[#141a26] border border-gray-800/80 p-3 rounded-2xl flex flex-col gap-3">
        {/* Color Choice */}
        <div>
          <span className="text-[10px] font-bold text-gray-400 block mb-1">CHOOSE COLOR:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              disabled={isSpinning}
              onClick={() => setSelectedColor("red")}
              className={`py-2 rounded-xl font-black text-xs border transition-all ${
                selectedColor === "red"
                  ? "bg-red-600 border-white text-white shadow-lg scale-105"
                  : "bg-[#0b0e14] border-gray-800 text-red-400"
              }`}
            >
              RED (2x)
            </button>
            <button
              disabled={isSpinning}
              onClick={() => setSelectedColor("green")}
              className={`py-2 rounded-xl font-black text-xs border transition-all ${
                selectedColor === "green"
                  ? "bg-emerald-600 border-white text-white shadow-lg scale-105"
                  : "bg-[#0b0e14] border-gray-800 text-emerald-400"
              }`}
            >
              GREEN (14x)
            </button>
            <button
              disabled={isSpinning}
              onClick={() => setSelectedColor("black")}
              className={`py-2 rounded-xl font-black text-xs border transition-all ${
                selectedColor === "black"
                  ? "bg-gray-800 border-white text-white shadow-lg scale-105"
                  : "bg-[#0b0e14] border-gray-800 text-gray-300"
              }`}
            >
              BLACK (2x)
            </button>
          </div>
        </div>

        {/* Bet Amount Choice */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400">BET AMOUNT:</span>
          <div className="flex gap-1.5">
            {[10, 50, 100, 500].map((amt) => (
              <button
                key={amt}
                disabled={isSpinning}
                onClick={() => setBetAmount(amt)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  betAmount === amt
                    ? "bg-amber-500 text-black"
                    : "bg-[#0b0e14] text-gray-300 border border-gray-800"
                }`}
              >
                {amt} PKR
              </button>
            ))}
          </div>
        </div>

        {/* Start Spin Action Button */}
        <button
          disabled={isSpinning}
          onClick={handleSpin}
          className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-red-500 text-black font-black py-3 rounded-xl uppercase text-xs shadow-xl active:scale-95 disabled:opacity-50 transition-all"
        >
          {isSpinning ? "SPINNING..." : `PLACE BET & SPIN (PKR ${betAmount})`}
        </button>
      </div>
    </div>
  );
}
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

export default function ColorPrediction() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedColor, setSelectedColor] = useState<"Red" | "Green" | "Violet" | null>(null);
  const [resultColor, setResultColor] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(["Red", "Green", "Red", "Violet", "Green"]);

  const handleStartBet = async () => {
    if (!selectedColor) {
      alert("Pehle apna color select karein!");
      return;
    }

    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }

    // 1. Balance Deduct Karein (Bet Loss/Deduct)
    const success = await updateBalance(-betAmount);
    if (!success) return;

    setIsPlaying(true);
    setResultColor(null);

    // Color Pick Simulation
    setTimeout(async () => {
      const colors: ("Red" | "Green" | "Violet")[] = ["Red", "Green", "Red", "Green", "Violet"];
      const winColor = colors[Math.floor(Math.random() * colors.length)];
      
      setResultColor(winColor);
      setHistory((prev) => [winColor, ...prev.slice(0, 4)]);

      // 2. Win Check & Payout Calculation
      if (selectedColor === winColor) {
        const multiplier = selectedColor === "Violet" ? 4.5 : 2;
        const winVal = parseFloat((betAmount * multiplier).toFixed(2));
        await updateBalance(winVal);
      }

      setIsPlaying(false);
    }, 1500);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-3 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">☰</Link>
          <span className="font-black text-sm tracking-wide text-white flex items-center gap-1">
            🎨 COLOR PREDICTION
          </span>
        </div>

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

      {/* 2. Live Result History */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {history.map((col, i) => (
          <span
            key={i}
            className={`text-[10px] font-bold px-3 py-0.5 rounded-full border ${
              col === "Red"
                ? "bg-red-950/80 text-red-400 border-red-600/30"
                : col === "Green"
                ? "bg-green-950/80 text-green-400 border-green-600/30"
                : "bg-purple-950/80 text-purple-400 border-purple-600/30"
            }`}
          >
            {col}
          </span>
        ))}
      </div>

      {/* 3. Arena Display */}
      <div className="relative h-40 bg-[#141a26] rounded-2xl border border-gray-800 flex flex-col justify-center items-center my-auto overflow-hidden shadow-2xl p-4">
        {isPlaying ? (
          <div className="text-center animate-pulse">
            <span className="text-3xl mb-1 block">🎲</span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Selecting Color...
            </span>
          </div>
        ) : resultColor ? (
          <div className="text-center">
            <span className="text-xs font-bold text-gray-400 block uppercase">Result</span>
            <span
              className={`text-3xl font-black ${
                resultColor === "Red"
                  ? "text-red-500"
                  : resultColor === "Green"
                  ? "text-green-500"
                  : "text-purple-400"
              }`}
            >
              {resultColor.toUpperCase()}
            </span>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-3xl mb-1 block">🎯</span>
            <span className="text-xs font-bold text-gray-400">Pick a color & place your bet</span>
          </div>
        )}
      </div>

      {/* 4. Color Selection Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          disabled={isPlaying}
          onClick={() => setSelectedColor("Red")}
          className={`py-3 rounded-xl text-xs font-black transition-all ${
            selectedColor === "Red"
              ? "bg-red-600 text-white ring-2 ring-red-400 scale-105"
              : "bg-red-950/60 border border-red-500/40 text-red-400"
          }`}
        >
          RED (2x)
        </button>

        <button
          disabled={isPlaying}
          onClick={() => setSelectedColor("Violet")}
          className={`py-3 rounded-xl text-xs font-black transition-all ${
            selectedColor === "Violet"
              ? "bg-purple-600 text-white ring-2 ring-purple-400 scale-105"
              : "bg-purple-950/60 border border-purple-500/40 text-purple-400"
          }`}
        >
          VIOLET (4.5x)
        </button>

        <button
          disabled={isPlaying}
          onClick={() => setSelectedColor("Green")}
          className={`py-3 rounded-xl text-xs font-black transition-all ${
            selectedColor === "Green"
              ? "bg-green-600 text-white ring-2 ring-green-400 scale-105"
              : "bg-green-950/60 border border-green-500/40 text-green-400"
          }`}
        >
          GREEN (2x)
        </button>
      </div>

      {/* 5. Bet Amount Selector */}
      <div className="bg-[#141a26] border border-gray-800 p-2.5 rounded-2xl flex justify-between items-center mt-2">
        <span className="text-xs font-bold text-gray-300">BET AMOUNT:</span>
        <div className="flex gap-1.5">
          {[10, 50, 100, 500].map((amt) => (
            <button
              key={amt}
              disabled={isPlaying}
              onClick={() => setBetAmount(amt)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                betAmount === amt
                  ? "bg-amber-500 text-black shadow-md"
                  : "bg-[#0b0e14] text-gray-300 border border-gray-800"
              }`}
            >
              {amt} PKR
            </button>
          ))}
        </div>
      </div>

      {/* 6. Place Bet Action Button */}
      <button
        disabled={isPlaying}
        onClick={handleStartBet}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-black py-3.5 rounded-xl uppercase text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50 mt-2"
      >
        {isPlaying ? "Game Running..." : `Place Bet (PKR ${betAmount})`}
      </button>

      {/* 7. Footer Info */}
      <div className="text-center text-[10px] text-gray-500 font-medium py-1">
        Pak Club 777 Fair Play Color Game
      </div>
    </div>
  );
}
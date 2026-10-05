"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

export default function DragonTigerGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedSide, setSelectedSide] = useState<"dragon" | "tiger" | "tie" | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(["D", "T", "D", "D", "T", "T"]);

  const handleStartBet = async () => {
    if (!selectedSide) {
      alert("Pehle Dragon, Tie, ya Tiger select karein!");
      return;
    }

    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }

    // 1. Bet Lagate Waqt Database se Balance Deduct Karein
    const success = await updateBalance(-betAmount);
    if (!success) return;

    setIsPlaying(true);
    setResult(null);

    // Game Shuffle Simulation
    setTimeout(async () => {
      const outcomes = ["dragon", "tiger", "tie"];
      const winSide = outcomes[Math.floor(Math.random() * outcomes.length)] as "dragon" | "tiger" | "tie";
      
      setResult(winSide.toUpperCase());
      setHistory((h) => [winSide[0].toUpperCase(), ...h.slice(0, 5)]);

      // 2. Win Hone Par Multiplier Ke Sath Database Balance Add Karein
      if (selectedSide === winSide) {
        const multiplier = selectedSide === "tie" ? 8 : 2;
        const winVal = betAmount * multiplier;
        await updateBalance(winVal); // Database me winning amount add karein
      }

      setIsPlaying(false);
    }, 1500);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-2.5 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">☰</Link>
          <span className="font-black text-sm tracking-wide text-white">
            Z666 <span className="text-[10px] text-gray-400 font-normal block -mt-1">- DRAGON TIGER -</span>
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

      {/* History */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
        {history.map((h, i) => (
          <span
            key={i}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              h === "D"
                ? "bg-red-950 text-red-400 border border-red-600/30"
                : h === "T"
                ? "bg-amber-950 text-amber-400 border border-amber-600/30"
                : "bg-emerald-950 text-emerald-400 border border-emerald-600/30"
            }`}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Arena Display */}
      <div className="relative h-40 bg-[#141a26] rounded-2xl border border-gray-800/80 flex justify-around items-center my-auto px-4">
        <div className="flex flex-col items-center">
          <span className="text-3xl">🐉</span>
          <span className="text-xs font-black text-red-500 mt-1">DRAGON</span>
        </div>

        <div className="text-center font-black text-amber-400 text-xl">
          {isPlaying ? (
            <span className="animate-pulse text-xs text-amber-400">SHUFFLING...</span>
          ) : result ? (
            result
          ) : (
            "VS"
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl">🐅</span>
          <span className="text-xs font-black text-amber-500 mt-1">TIGER</span>
        </div>
      </div>

      {/* Bet Side Selection Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          disabled={isPlaying}
          onClick={() => setSelectedSide("dragon")}
          className={`py-2 rounded-xl text-xs font-black transition-all ${
            selectedSide === "dragon"
              ? "bg-red-600 text-white ring-2 ring-red-400 scale-105"
              : "bg-red-950/60 border border-red-500/40 text-red-400"
          }`}
        >
          DRAGON (2x)
        </button>

        <button
          disabled={isPlaying}
          onClick={() => setSelectedSide("tie")}
          className={`py-2 rounded-xl text-xs font-black transition-all ${
            selectedSide === "tie"
              ? "bg-emerald-600 text-white ring-2 ring-emerald-400 scale-105"
              : "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400"
          }`}
        >
          TIE (8x)
        </button>

        <button
          disabled={isPlaying}
          onClick={() => setSelectedSide("tiger")}
          className={`py-2 rounded-xl text-xs font-black transition-all ${
            selectedSide === "tiger"
              ? "bg-amber-600 text-white ring-2 ring-amber-400 scale-105"
              : "bg-amber-950/60 border border-amber-500/40 text-amber-400"
          }`}
        >
          TIGER (2x)
        </button>
      </div>

      {/* Bet Amount Selector */}
      <div className="bg-[#141a26] border border-gray-800/80 p-2 rounded-2xl flex justify-between items-center mt-1">
        <span className="text-xs font-bold text-gray-300">BET AMOUNT:</span>
        <div className="flex gap-1.5">
          {[10, 50, 100, 500].map((amt) => (
            <button
              key={amt}
              disabled={isPlaying}
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

      {/* Place Bet Action Button */}
      <button
        disabled={isPlaying}
        onClick={handleStartBet}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-black py-3 rounded-xl uppercase text-xs shadow-lg active:scale-95 transition-all disabled:opacity-50 mt-1"
      >
        {isPlaying ? "Game Running..." : `Place Bet (PKR ${betAmount})`}
      </button>

      {/* Footer Tabs */}
      <div className="flex justify-center gap-6 text-xs text-gray-400 font-bold py-1 border-t border-gray-800/40 mt-1">
        <button className="hover:text-white">All Bets</button>
        <button className="hover:text-white">My Bets</button>
      </div>
    </div>
  );
}
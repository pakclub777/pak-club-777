"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/Authcontext"; // Path apni directory structure ke mutabiq check kar lein

const ANIMALS = [
  { id: "lion", name: "LION", icon: "🦁", multiplier: 12 },
  { id: "panda", name: "PANDA", icon: "🐼", multiplier: 8 },
  { id: "monkey", name: "MONKEY", icon: "🐒", multiplier: 6 },
  { id: "rabbit", name: "RABBIT", icon: "🐰", multiplier: 6 },
  { id: "eagle", name: "EAGLE", icon: "🦅", multiplier: 12 },
  { id: "peacock", name: "PEACOCK", icon: "🦚", multiplier: 8 },
  { id: "pigeon", name: "PIGEON", icon: "🕊️", multiplier: 6 },
  { id: "swallow", name: "SWALLOW", icon: "🐦", multiplier: 6 },
];

export default function ZooRoulette() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(50);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [winningAnimal, setWinningAnimal] = useState<{ id: string; name: string; icon: string; multiplier: number } | null>(null);
  const [history, setHistory] = useState<string[]>(["🦁 12x", "🐼 8x", "🦅 12x", "🐰 6x"]);
  const [countdown, setCountdown] = useState<number>(8);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!spinning) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        startSpin();
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, spinning]);

  const startSpin = async () => {
    // Low Balance Check
    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      setCountdown(8);
      return;
    }

    if (!selectedAnimal) {
      alert("Pehle kisi ek Animal par Bet lagaein!");
      setCountdown(8);
      return;
    }

    if (spinning) return;

    // 1. Balance Deduct Karein (Database Sync)
    const success = await updateBalance(-betAmount);
    if (!success) {
      setCountdown(8);
      return;
    }

    setSpinning(true);
    setWinningAnimal(null);

    let currentIndex = 0;
    let spins = 0;
    const totalSpins = 24 + Math.floor(Math.random() * 8);

    const interval = setInterval(async () => {
      setActiveHighlight(currentIndex);
      currentIndex = (currentIndex + 1) % ANIMALS.length;
      spins++;

      if (spins >= totalSpins) {
        clearInterval(interval);
        const winnerIndex = (currentIndex - 1 + ANIMALS.length) % ANIMALS.length;
        const winner = ANIMALS[winnerIndex];

        setActiveHighlight(winnerIndex);
        setWinningAnimal(winner);
        setHistory((prev) => [`${winner.icon} ${winner.multiplier}x`, ...prev.slice(0, 4)]);

        // 2. Win Logic & Database Balance Update
        if (selectedAnimal === winner.id) {
          const winAmt = betAmount * winner.multiplier;
          await updateBalance(winAmt);
        }

        setTimeout(() => {
          setSpinning(false);
          setCountdown(8);
          setSelectedAnimal(null);
        }, 2500);
      }
    }, 100);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0b0f17] text-white p-3 max-w-md mx-auto flex flex-col justify-start gap-2 font-sans overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <Link href="/" className="text-[11px] bg-[#141c2b] border border-gray-800 px-3 py-1 rounded-lg font-bold">
          ← Back
        </Link>
        <span className="text-amber-400 font-extrabold text-xs">🦁 ZOO ROULETTE</span>

        {/* Dynamic Balance Display & Deposit Link */}
        <div className="flex items-center gap-1.5">
          <div className="bg-[#182030] border border-gray-800 rounded-full px-2.5 py-1 flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-200">
              PKR {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                balance > 0 ? "bg-emerald-500" : "bg-red-500"
              }`}
            ></span>
          </div>

          <Link
            href="/deposit"
            className="bg-amber-500 text-black text-[9px] font-black px-2 py-1 rounded-full hover:bg-amber-400 transition-all"
          >
            + Deposit
          </Link>
        </div>
      </div>

      {/* History Ticker */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {history.map((h, i) => (
          <span key={i} className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-[#141c2b] border border-amber-500/30 text-amber-300 whitespace-nowrap">
            {h}
          </span>
        ))}
      </div>

      {/* Status Bar */}
      <div className="text-center">
        {spinning ? (
          <p className="text-xs font-black text-amber-400 animate-pulse">SPINNING WHEEL...</p>
        ) : (
          <p className="text-[11px] text-gray-400 font-bold">
            NEXT ROUND IN: <span className="text-amber-400 text-xs font-black">{countdown}s</span>
          </p>
        )}
      </div>

      {/* Animals Grid Board */}
      <div className="grid grid-cols-4 gap-1.5 bg-[#141c2b] p-2 rounded-xl border border-gray-800 shadow-xl">
        {ANIMALS.map((animal, idx) => {
          const isHighlighted = activeHighlight === idx;
          const isSelected = selectedAnimal === animal.id;

          return (
            <div
              key={animal.id}
              onClick={() => !spinning && setSelectedAnimal(animal.id)}
              className={`p-1.5 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border relative ${
                isHighlighted
                  ? "bg-amber-500 text-black border-amber-300 scale-105 shadow-[0_0_12px_#f59e0b] z-10"
                  : isSelected
                  ? "bg-indigo-900 border-indigo-400"
                  : "bg-[#0b0e14] border-gray-800 hover:border-amber-500/40"
              }`}
            >
              <span className="text-xl select-none">{animal.icon}</span>
              <span className="text-[8px] font-black tracking-tight mt-0.5">{animal.name}</span>
              <span className="text-[7px] text-amber-400 font-extrabold">{animal.multiplier}x</span>
              {isSelected && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[7px] font-black px-1 rounded-full">
                  BET
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Winner Announcement */}
      {winningAnimal && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-center py-1 px-2 rounded-lg text-[11px] animate-bounce">
          🏆 {winningAnimal.name} ({winningAnimal.multiplier}x) WON!
        </div>
      )}

      {/* Bet Controls */}
      <div className="bg-[#141c2b] border border-gray-800 p-2.5 rounded-xl flex flex-col gap-2 mt-auto">
        <div className="flex justify-between items-center bg-[#0b0e14] px-3 py-1.5 rounded-lg border border-gray-800">
          <button
            disabled={spinning}
            onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
            className="text-base font-black text-amber-400 px-2"
          >
            -
          </button>
          <span className="font-extrabold text-xs text-white">BET: PKR {betAmount}</span>
          <button
            disabled={spinning}
            onClick={() => setBetAmount(betAmount + 10)}
            className="text-base font-black text-amber-400 px-2"
          >
            +
          </button>
        </div>

        <button
          onClick={startSpin}
          disabled={spinning}
          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 font-black text-black py-2.5 rounded-lg uppercase text-xs shadow-md active:scale-95 disabled:opacity-50 transition-all"
        >
          {spinning ? "SPINNING..." : "SPIN NOW"}
        </button>
      </div>
    </div>
  );
}
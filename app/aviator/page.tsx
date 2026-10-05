"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

export default function AviatorGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [betAmount, setBetAmount] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasCashedOut, setHasCashedOut] = useState<boolean>(false);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [history, setHistory] = useState<string[]>(["1.45x", "2.10x", "1.12x", "5.40x", "1.05x"]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const crashPointRef = useRef<number>(1.0);

  const startGame = async () => {
    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }

    // 1. Balance Deduct Karein (Loss/Bet)
    const success = await updateBalance(-betAmount);
    if (!success) return;

    // Reset States
    setMultiplier(1.0);
    setIsPlaying(true);
    setHasCashedOut(false);
    setIsCrashed(false);
    setWinAmount(0);

    // Random Crash Point Calculate (1.05x se 10.00x)
    const randomCrash = parseFloat((Math.random() * 8 + 1.05).toFixed(2));
    crashPointRef.current = randomCrash;

    // Rocket Speed Loop
    let currentMultiplier = 1.0;
    intervalRef.current = setInterval(() => {
      currentMultiplier += 0.03;

      if (currentMultiplier >= crashPointRef.current) {
        // Rocket Flew Away (Crashed)
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsCrashed(true);
        setIsPlaying(false);
        setHistory((prev) => [`${crashPointRef.current.toFixed(2)}x`, ...prev.slice(0, 4)]);
      } else {
        setMultiplier(parseFloat(currentMultiplier.toFixed(2)));
      }
    }, 100);
  };

  const handleCashOut = async () => {
    if (!isPlaying || hasCashedOut || isCrashed) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const wonVal = parseFloat((betAmount * multiplier).toFixed(2));
    setWinAmount(wonVal);
    setHasCashedOut(true);
    setIsPlaying(false);

    // 2. Winnings Balance Mein Add Karein
    await updateBalance(wonVal);
    setHistory((prev) => [`${multiplier.toFixed(2)}x`, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-3 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">☰</Link>
          <span className="font-black text-sm tracking-wide text-red-500 flex items-center gap-1">
            🚀 AVIATOR
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
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              parseFloat(h) > 2.0
                ? "bg-purple-950/80 text-purple-400 border-purple-600/30"
                : "bg-blue-950/80 text-blue-400 border-blue-600/30"
            }`}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Arena Display / Flight Track */}
      <div className="relative h-48 bg-[#141a26] rounded-2xl border border-gray-800 flex flex-col justify-center items-center my-auto overflow-hidden shadow-2xl">
        {isCrashed ? (
          <div className="text-center animate-bounce">
            <span className="text-2xl font-black text-red-500 block">FLEW AWAY!</span>
            <span className="text-4xl font-black text-red-600">{multiplier.toFixed(2)}x</span>
          </div>
        ) : hasCashedOut ? (
          <div className="text-center">
            <span className="text-xs font-bold text-green-400 block uppercase">Cashed Out</span>
            <span className="text-4xl font-black text-green-400">PKR {winAmount.toFixed(2)}</span>
            <span className="text-xs font-bold text-gray-400 block mt-1">@ {multiplier.toFixed(2)}x</span>
          </div>
        ) : (
          <div className="text-center">
            <div className={`text-5xl mb-2 ${isPlaying ? "animate-pulse scale-110" : ""}`}>🚀</div>
            <span className="text-5xl font-black text-amber-400 drop-shadow-md">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        )}
      </div>

      {/* Bet Amount Selector */}
      <div className="bg-[#141a26] border border-gray-800 p-2.5 rounded-2xl flex justify-between items-center">
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

      {/* Action Button (BET NOW / CASH OUT) */}
      {isPlaying ? (
        <button
          onClick={handleCashOut}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 rounded-xl uppercase text-sm shadow-xl active:scale-95 transition-all mt-2"
        >
          CASH OUT (PKR {(betAmount * multiplier).toFixed(2)})
        </button>
      ) : (
        <button
          onClick={startGame}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-black py-3.5 rounded-xl uppercase text-sm shadow-xl active:scale-95 transition-all mt-2"
        >
          START BET (PKR {betAmount})
        </button>
      )}

      {/* Footer info */}
      <div className="text-center text-[10px] text-gray-500 font-medium mt-1">
        Pak Club 777 Fair Play Provably Fair Crash Game
      </div>
    </div>
  );
}
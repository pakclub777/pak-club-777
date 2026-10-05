"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

export default function SevenUpDown() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [betAmount, setBetAmount] = useState<number>(50);
  const [selectedBet, setSelectedBet] = useState<"down" | "seven" | "up" | null>(null);
  const [diceSum, setDiceSum] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const rollDice = async () => {
    if (!selectedBet) {
      setMessage("⚠️ Pehle 7 Down, Exact 7, ya 7 Up select karein!");
      return;
    }
    if (balance < betAmount) {
      setMessage("❌ Insufficient Balance! Pehle deposit karein.");
      return;
    }

    setMessage("");
    setIsPlaying(true);

    // 1. Balance Deduct Karein (Database Sync)
    const success = await updateBalance(-betAmount);
    if (!success) {
      setIsPlaying(false);
      return;
    }

    setTimeout(async () => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      setDiceSum(sum);

      let winningCategory: "down" | "seven" | "up" = "down";
      if (sum < 7) winningCategory = "down";
      else if (sum === 7) winningCategory = "seven";
      else winningCategory = "up";

      if (selectedBet === winningCategory) {
        const winMultiplier = winningCategory === "seven" ? 5 : 2;
        const winAmount = betAmount * winMultiplier;

        // 2. Winnings Add Karein (Database Sync)
        await updateBalance(winAmount);
        setMessage(`🎉 WON PKR ${winAmount}! Dice Total was ${sum}`);
      } else {
        setMessage(`❌ Dice Total was ${sum}. Better luck next time!`);
      }
      setIsPlaying(false);
    }, 1200);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-2.5 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. Top Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">
            ☰
          </Link>
          <span className="font-black text-sm tracking-wide text-white">
            Z666 <span className="text-[10px] text-rose-500 font-normal block -mt-1">- 7 UP 7 DOWN -</span>
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

      {/* 2. Main Dice Display Board */}
      <div className="bg-[#141a26] border border-gray-800/80 rounded-2xl p-4 my-auto flex flex-col items-center justify-center relative min-h-[200px] shadow-2xl">
        <div
          className={`w-28 h-28 bg-gradient-to-br from-rose-500 to-rose-700 text-white text-5xl font-black flex items-center justify-center rounded-3xl shadow-xl border-4 border-rose-400/50 transition-transform ${
            isPlaying ? "animate-bounce scale-105" : ""
          }`}
        >
          {isPlaying ? "🎲" : diceSum || "?"}
        </div>

        {message && (
          <p
            className={`mt-4 text-xs font-extrabold text-center px-3 py-1.5 rounded-xl border ${
              message.includes("WON")
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-400"
                : message.includes("⚠️")
                ? "bg-amber-950/80 border-amber-500 text-amber-400"
                : "bg-rose-950/80 border-rose-500 text-rose-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* 3. Betting Choices & Options */}
      <div className="bg-[#141a26] border border-gray-800/80 p-3 rounded-2xl flex flex-col gap-3">
        <div>
          <span className="text-[10px] font-bold text-gray-400 block mb-1.5 uppercase">
            Select Prediction:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              disabled={isPlaying}
              onClick={() => setSelectedBet("down")}
              className={`py-3 rounded-xl flex flex-col items-center justify-center border transition-all ${
                selectedBet === "down"
                  ? "bg-rose-600 border-white text-white shadow-lg scale-105"
                  : "bg-[#0b0e14] border-gray-800 text-rose-400"
              }`}
            >
              <span className="text-xs font-black">7 DOWN</span>
              <span className="text-[9px] opacity-80">(2-6) • 2x</span>
            </button>

            <button
              disabled={isPlaying}
              onClick={() => setSelectedBet("seven")}
              className={`py-3 rounded-xl flex flex-col items-center justify-center border transition-all ${
                selectedBet === "seven"
                  ? "bg-amber-500 border-white text-black shadow-lg scale-105"
                  : "bg-[#0b0e14] border-gray-800 text-amber-400"
              }`}
            >
              <span className="text-xs font-black">LUCKY 7</span>
              <span className="text-[9px] opacity-80">(7) • 5x</span>
            </button>

            <button
              disabled={isPlaying}
              onClick={() => setSelectedBet("up")}
              className={`py-3 rounded-xl flex flex-col items-center justify-center border transition-all ${
                selectedBet === "up"
                  ? "bg-sky-500 border-white text-black shadow-lg scale-105"
                  : "bg-[#0b0e14] border-gray-800 text-sky-400"
              }`}
            >
              <span className="text-xs font-black">7 UP</span>
              <span className="text-[9px] opacity-80">(8-12) • 2x</span>
            </button>
          </div>
        </div>

        {/* Bet Amount Selector */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400">BET AMOUNT:</span>
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

        {/* Action Button */}
        <button
          disabled={isPlaying}
          onClick={rollDice}
          className="w-full bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 hover:from-rose-500 hover:to-rose-500 text-black font-black py-3.5 rounded-xl uppercase text-xs shadow-xl active:scale-95 disabled:opacity-50 transition-all"
        >
          {isPlaying ? "Rolling Dice..." : `ROLL DICE (PKR ${betAmount})`}
        </button>
      </div>
    </div>
  );
}
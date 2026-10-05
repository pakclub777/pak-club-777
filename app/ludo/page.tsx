"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

export default function LudoGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Live Balance
  const [betAmount, setBetAmount] = useState<number>(10);
  const [dice, setDice] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([6, 3, 5, 1, 6, 4]);

  const rollDice = async () => {
    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }

    // 1. Balance Deduct Karein
    const success = await updateBalance(-betAmount);
    if (!success) return;

    setIsRolling(true);
    setResultMsg(null);

    // Rolling Animation Simulation
    setTimeout(async () => {
      const rolledValue = Math.floor(Math.random() * 6) + 1;
      setDice(rolledValue);
      setHistory((prev) => [rolledValue, ...prev.slice(0, 5)]);

      // 2. Win / Loss Logic & Payout Calculation
      if (rolledValue === 6) {
        const winVal = parseFloat((betAmount * 3).toFixed(2));
        await updateBalance(winVal);
        setResultMsg(`JACKPOT! 6 Rolled (3x Win: PKR ${winVal})`);
      } else if (rolledValue === 4 || rolledValue === 5) {
        const winVal = parseFloat((betAmount * 1.5).toFixed(2));
        await updateBalance(winVal);
        setResultMsg(`WIN! Rolled ${rolledValue} (1.5x Win: PKR ${winVal})`);
      } else {
        setResultMsg(`Bad Luck! Rolled ${rolledValue}`);
      }

      setIsRolling(false);
    }, 1200);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-3 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">☰</Link>
          <span className="font-black text-sm tracking-wide text-amber-400 flex items-center gap-1">
            🎲 LUDO BETTING
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

      {/* 2. Live Dice History */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {history.map((val, i) => (
          <span
            key={i}
            className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full border ${
              val === 6
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-gray-800 text-gray-300 border-gray-700"
            }`}
          >
            🎲 {val}
          </span>
        ))}
      </div>

      {/* 3. Arena Display & Dice Box */}
      <div className="relative h-48 bg-[#141a26] rounded-2xl border border-gray-800 flex flex-col justify-center items-center my-auto overflow-hidden shadow-2xl p-4">
        <div
          className={`w-28 h-28 bg-gradient-to-br from-amber-400 to-amber-600 text-black text-6xl font-black flex items-center justify-center rounded-3xl shadow-xl border-4 border-amber-300 transition-transform ${
            isRolling ? "animate-spin scale-110" : ""
          }`}
        >
          {isRolling ? "🎲" : dice ? dice : "?"}
        </div>

        {resultMsg && !isRolling && (
          <span
            className={`mt-3 text-xs font-black tracking-wide uppercase ${
              resultMsg.includes("JACKPOT") || resultMsg.includes("WIN")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {resultMsg}
          </span>
        )}
      </div>

      {/* 4. Paytable Multiplier Banner */}
      <div className="bg-[#141a26] border border-gray-800 p-2 rounded-xl flex justify-around text-[10px] font-extrabold text-gray-300 text-center">
        <div><span className="text-amber-400 block">🎲 6</span> 3.0x Win</div>
        <div><span className="text-emerald-400 block">🎲 4 or 5</span> 1.5x Win</div>
        <div><span className="text-red-400 block">🎲 1, 2, 3</span> Loss</div>
      </div>

      {/* 5. Bet Amount Selector */}
      <div className="bg-[#141a26] border border-gray-800 p-2.5 rounded-2xl flex justify-between items-center mt-2">
        <span className="text-xs font-bold text-gray-300">BET AMOUNT:</span>
        <div className="flex gap-1.5">
          {[10, 50, 100, 500].map((amt) => (
            <button
              key={amt}
              disabled={isRolling}
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

      {/* 6. Roll Action Button */}
      <button
        disabled={isRolling}
        onClick={rollDice}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 rounded-xl uppercase text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50 mt-2"
      >
        {isRolling ? "Rolling Dice..." : `Roll Dice (PKR ${betAmount})`}
      </button>

      {/* 7. Footer Info */}
      <div className="text-center text-[10px] text-gray-500 font-medium py-1">
        Pak Club 777 Provably Fair Ludo Betting
      </div>
    </div>
  );
}
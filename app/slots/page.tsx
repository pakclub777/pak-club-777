"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/context/Authcontext";

export default function SlotGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [betAmount, setBetAmount] = useState<number>(10);
  const [reels, setReels] = useState<string[]>(["🎰", "🎰", "🎰"]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const spin = async () => {
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
    setWinMessage(null);

    const items = ["7️⃣", "🍒", "🍋", "👑", "💎"];

    // Spin animation simulation
    setTimeout(async () => {
      const r1 = items[Math.floor(Math.random() * items.length)];
      const r2 = items[Math.floor(Math.random() * items.length)];
      const r3 = items[Math.floor(Math.random() * items.length)];

      setReels([r1, r2, r3]);
      setIsSpinning(false);

      // Winning Logic & Database Balance Update
      if (r1 === r2 && r2 === r3) {
        // 3 Match Multiplier (5x)
        const winAmount = betAmount * 5;
        await updateBalance(winAmount);
        setWinMessage(`🎉 BIG WIN! Aapne PKR ${winAmount} jeet liye! (5x)`);
      } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // 2 Match Multiplier (1.5x)
        const winAmount = Math.floor(betAmount * 1.5);
        await updateBalance(winAmount);
        setWinMessage(`✨ MINI WIN! Aapne PKR ${winAmount} jeet liye! (1.5x)`);
      } else {
        setWinMessage("❌ Better luck next time!");
      }
    }, 1000);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-2.5 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">☰</Link>
          <span className="font-black text-sm tracking-wide text-white">
            Z666 <span className="text-[10px] text-amber-400 font-normal block -mt-1">- 777 SLOTS -</span>
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

      {/* Slots Display Container */}
      <div className="bg-[#141a26] p-6 rounded-2xl border border-amber-500/30 my-auto flex flex-col items-center gap-4">
        <div className="flex justify-center gap-3">
          {reels.map((item, idx) => (
            <div
              key={idx}
              className={`text-5xl bg-[#0b0e14] p-4 rounded-xl border border-gray-700 transition-all ${
                isSpinning ? "animate-pulse scale-95" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Result Message */}
        {winMessage && (
          <p
            className={`text-center font-extrabold text-xs px-3 py-1.5 rounded-lg border ${
              winMessage.includes("WIN")
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-400 animate-bounce"
                : "bg-red-950/80 border-red-500 text-red-400"
            }`}
          >
            {winMessage}
          </p>
        )}
      </div>

      {/* Betting Control Box */}
      <div className="bg-[#141a26] border border-gray-800/80 p-3 rounded-2xl flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-300">BET AMOUNT:</span>
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

        {/* Action Button */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3.5 rounded-xl uppercase text-xs shadow-lg active:scale-95 disabled:opacity-50 transition-all"
        >
          {isSpinning ? "SPINNING..." : `SPIN NOW (PKR ${betAmount})`}
        </button>
      </div>

      {/* Footer Tabs */}
      <div className="flex justify-center gap-6 text-xs text-gray-400 font-bold py-1 border-t border-gray-800/40">
        <button className="hover:text-white">All Bets</button>
        <button className="hover:text-white">My Bets</button>
      </div>
    </div>
  );
}
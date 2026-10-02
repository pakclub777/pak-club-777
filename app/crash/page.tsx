"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CrashGame() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(true);
  const [betAmount, setBetAmount] = useState(100);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [userBalance, setUserBalance] = useState(1000);

  // Auto-Simulation Bets List (Z666/7999 Style)
  const [liveBets, setLiveBets] = useState([
    { user: "0301***44", bet: "500 PKR", cashed: "1.85x", win: "925 PKR" },
    { user: "0345***12", bet: "1000 PKR", cashed: "2.40x", win: "2400 PKR" },
    { user: "0312***89", bet: "200 PKR", cashed: "In Game", win: "-" },
    { user: "0333***01", bet: "2000 PKR", cashed: "1.30x", win: "2600 PKR" },
  ]);

  // Rocket Flying Animation Logic
  useEffect(() => {
    if (!isFlying) return;
    const interval = setInterval(() => {
      setMultiplier((prev) => {
        const crashPoint = 3.80; // Rocket crash limit
        if (prev >= crashPoint) {
          setIsFlying(false);
          setHasBet(false);
          setCashedOut(false);
          setTimeout(() => {
            setMultiplier(1.00);
            setIsFlying(true);
          }, 3500); // 3.5s Wait for next round
          return 1.00;
        }
        return parseFloat((prev + 0.06).toFixed(2));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isFlying]);

  const handlePlaceBet = () => {
    if (userBalance >= betAmount && isFlying && !hasBet) {
      setUserBalance((prev) => prev - betAmount);
      setHasBet(true);
      setCashedOut(false);
    }
  };

  const handleCashout = () => {
    if (hasBet && !cashedOut && isFlying) {
      const winAmount = Math.floor(betAmount * multiplier);
      setUserBalance((prev) => prev + winAmount);
      setCashedOut(true);
      setHasBet(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col justify-between p-3 max-w-md mx-auto font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-[#141c2b] p-3 rounded-2xl border border-gray-800">
        <Link href="/" className="text-amber-400 font-extrabold text-sm flex items-center gap-1">
          ← Back
        </Link>
        <span className="font-black text-amber-400 tracking-wider">PAK CLUB AVIATOR</span>
        <div className="bg-[#1c283a] px-3 py-1 rounded-xl text-xs text-green-400 font-bold border border-green-500/30">
          PKR {userBalance.toLocaleString()}
        </div>
      </div>

      {/* Game Screen Canvas */}
      <div className="my-3 bg-gradient-to-b from-[#141c2b] to-[#0d131c] h-64 rounded-2xl border border-amber-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-3 left-3 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold">
          {isFlying ? "🚀 ROCKET FLYING" : "💥 CRASHED"}
        </div>

        <h1 className={`text-6xl font-black ${isFlying ? "text-amber-400" : "text-red-500"} drop-shadow-lg`}>
          {isFlying ? `${multiplier.toFixed(2)}x` : "CRASHED"}
        </h1>

        <p className="text-xs text-gray-400 mt-2 font-medium">
          {isFlying ? "Cash out before rocket crashes!" : "Waiting for next round..."}
        </p>
      </div>

      {/* Betting Panel */}
      <div className="bg-[#141c2b] p-4 rounded-2xl border border-gray-800 flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Bet Amount (PKR)</span>
          <div className="flex gap-2">
            {[100, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => setBetAmount(amt)}
                className="bg-[#1c283a] hover:bg-amber-500 hover:text-black text-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-500/20"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {hasBet && !cashedOut ? (
          <button
            onClick={handleCashout}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-black py-3.5 rounded-xl text-sm uppercase shadow-lg animate-bounce"
          >
            CASH OUT (PKR {Math.floor(betAmount * multiplier)})
          </button>
        ) : (
          <button
            onClick={handlePlaceBet}
            disabled={!isFlying || hasBet}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-black py-3.5 rounded-xl text-sm uppercase shadow-lg disabled:opacity-50"
          >
            BET (PKR {betAmount})
          </button>
        )}
      </div>

      {/* Live Bets Ticker List */}
      <div className="mt-3 bg-[#141c2b] p-3 rounded-2xl border border-gray-800">
        <h3 className="text-[11px] font-extrabold text-amber-400 mb-2 tracking-wider uppercase">
          🔥 Live Player Bets
        </h3>
        <div className="flex flex-col gap-1.5 text-[11px]">
          {liveBets.map((b, i) => (
            <div key={i} className="flex justify-between items-center bg-[#0d131c] px-3 py-1.5 rounded-lg border border-gray-800/50">
              <span className="text-gray-300">{b.user}</span>
              <span className="text-amber-400 font-bold">{b.bet}</span>
              <span className="text-green-400 font-bold">{b.cashed}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
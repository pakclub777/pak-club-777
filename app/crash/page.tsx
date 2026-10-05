"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

export default function CrashGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Real-time Balance
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [gameState, setGameState] = useState<"waiting" | "running" | "crashed">("waiting");
  const [countdown, setCountdown] = useState<number>(5);
  const [history, setHistory] = useState<string[]>(["5.30x", "2.90x", "2.22x", "6.60x", "2.36x", "4.05x"]);
  
  // Bet Panel 1 State
  const [bet1, setBet1] = useState<number>(10);
  const [hasBet1, setHasBet1] = useState<boolean>(false);
  const [cashedOut1, setCashedOut1] = useState<boolean>(false);
  const [win1, setWin1] = useState<number>(0);

  // Bet Panel 2 State
  const [bet2, setBet2] = useState<number>(10);
  const [hasBet2, setHasBet2] = useState<boolean>(false);
  const [cashedOut2, setCashedOut2] = useState<boolean>(false);
  const [win2, setWin2] = useState<number>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameState === "waiting") {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setGameState("running");
        setMultiplier(1.0);
        setCashedOut1(false);
        setCashedOut2(false);
      }
    } else if (gameState === "running") {
      const crashPoint = (Math.random() * 8 + 1.1).toFixed(2);
      const interval = setInterval(() => {
        setMultiplier((prev) => {
          const next = parseFloat((prev + 0.05).toFixed(2));
          if (next >= parseFloat(crashPoint)) {
            clearInterval(interval);
            setGameState("crashed");
            setHistory((h) => [`${crashPoint}x`, ...h.slice(0, 5)]);
            setTimeout(() => {
              setGameState("waiting");
              setCountdown(5);
              setHasBet1(false);
              setHasBet2(false);
            }, 2500);
            return parseFloat(crashPoint);
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  // Bet 1 Logic
  const handlePlaceBet1 = async () => {
    if (balance < bet1) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }
    const success = await updateBalance(-bet1);
    if (success) {
      setHasBet1(true);
    }
  };

  const handleCashOut1 = async () => {
    if (hasBet1 && gameState === "running" && !cashedOut1) {
      const wonVal = Math.floor(bet1 * multiplier);
      setCashedOut1(true);
      setWin1(wonVal);
      await updateBalance(wonVal);
    }
  };

  // Bet 2 Logic
  const handlePlaceBet2 = async () => {
    if (balance < bet2) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }
    const success = await updateBalance(-bet2);
    if (success) {
      setHasBet2(true);
    }
  };

  const handleCashOut2 = async () => {
    if (hasBet2 && gameState === "running" && !cashedOut2) {
      const wonVal = Math.floor(bet2 * multiplier);
      setCashedOut2(true);
      setWin2(wonVal);
      await updateBalance(wonVal);
    }
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-2.5 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* 1. Header Bar */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 hover:text-white text-base">
            ☰
          </Link>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 text-lg">👑</span>
            <span className="font-black text-sm tracking-wide text-white">
              Z666 <span className="text-[10px] text-gray-400 font-normal block -mt-1">- CASINO -</span>
            </span>
          </div>
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

      {/* 2. History Pills */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
        {history.map((h, i) => (
          <span key={i} className="bg-[#241342] text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            {h}
          </span>
        ))}
      </div>

      {/* 3. Game Screen Area */}
      <div className="relative h-40 bg-radial from-[#221626] to-[#0a0c12] rounded-2xl border border-gray-800/80 flex flex-col items-center justify-center overflow-hidden my-1 shadow-inner">
        {gameState === "waiting" && (
          <div className="text-center flex flex-col items-center">
            <span className="text-red-500 text-2xl animate-pulse mb-1">🚁</span>
            <p className="text-[11px] font-black text-gray-200 tracking-wider uppercase">WAITING FOR NEXT ROUND</p>
            <div className="w-48 bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-red-600 h-full transition-all duration-1000 ease-linear" 
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === "running" && (
          <div className="text-center z-10">
            <span className="text-4xl font-black text-white tracking-tight drop-shadow-md">{multiplier.toFixed(2)}x</span>
            <p className="text-[11px] text-emerald-400 mt-1 font-bold flex items-center justify-center gap-1">
              🚀 Flying High...
            </p>
          </div>
        )}

        {gameState === "crashed" && (
          <div className="text-center z-10">
            <span className="text-2xl font-black text-red-500 tracking-wide">FLEW AWAY!</span>
            <p className="text-sm font-bold text-gray-300 mt-0.5">{multiplier.toFixed(2)}x</p>
          </div>
        )}
      </div>

      {/* 4. Bet Controls Container */}
      <div className="flex flex-col gap-2">
        
        {/* PANEL 1 */}
        <div className="bg-[#141a26] border border-gray-800/80 p-2 rounded-2xl">
          <div className="flex justify-center gap-4 text-[11px] text-gray-400 font-bold mb-1.5">
            <span className="text-white border-b-2 border-amber-500 pb-0.5">Bet</span>
            <span>Auto</span>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-6 flex flex-col gap-1.5">
              <div className="bg-[#0b0e14] border border-gray-800 rounded-lg px-2 py-1 flex justify-between items-center">
                <span className="text-xs font-bold text-white">{bet1.toFixed(2)}</span>
                <div className="flex gap-1 text-gray-400">
                  <button onClick={() => setBet1(Math.max(10, bet1 - 10))} className="w-5 h-5 bg-gray-800/80 rounded flex items-center justify-center text-xs font-bold active:scale-95">-</button>
                  <button onClick={() => setBet1(bet1 + 10)} className="w-5 h-5 bg-gray-800/80 rounded flex items-center justify-center text-xs font-bold active:scale-95">+</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {[100, 200, 500, 1000].map((amt) => (
                  <button key={amt} onClick={() => setBet1(amt)} className="bg-[#0b0e14] border border-gray-800/80 text-[9px] text-gray-300 py-0.5 rounded font-bold hover:border-amber-500/50">
                    {amt} PKR
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-6 h-full flex items-stretch">
              {!hasBet1 ? (
                <button
                  disabled={gameState === "crashed"}
                  onClick={handlePlaceBet1}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 font-black text-black text-sm rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-h-[64px]"
                >
                  BET
                </button>
              ) : cashedOut1 ? (
                <div className="w-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 font-bold p-1 rounded-xl text-center text-[10px] flex items-center justify-center">
                  Cashed Out: PKR {win1}
                </div>
              ) : (
                <button
                  onClick={handleCashOut1}
                  disabled={gameState !== "running"}
                  className="w-full bg-amber-500 hover:bg-amber-600 font-black text-black text-xs rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-h-[64px]"
                >
                  CASH OUT ({Math.floor(bet1 * multiplier)})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PANEL 2 */}
        <div className="bg-[#141a26] border border-gray-800/80 p-2 rounded-2xl relative">
          <button className="absolute top-1.5 right-2 text-gray-500 text-xs">⊖</button>
          
          <div className="flex justify-center gap-4 text-[11px] text-gray-400 font-bold mb-1.5">
            <span className="text-white border-b-2 border-amber-500 pb-0.5">Bet</span>
            <span>Auto</span>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-6 flex flex-col gap-1.5">
              <div className="bg-[#0b0e14] border border-gray-800 rounded-lg px-2 py-1 flex justify-between items-center">
                <span className="text-xs font-bold text-white">{bet2.toFixed(2)}</span>
                <div className="flex gap-1 text-gray-400">
                  <button onClick={() => setBet2(Math.max(10, bet2 - 10))} className="w-5 h-5 bg-gray-800/80 rounded flex items-center justify-center text-xs font-bold active:scale-95">-</button>
                  <button onClick={() => setBet2(bet2 + 10)} className="w-5 h-5 bg-gray-800/80 rounded flex items-center justify-center text-xs font-bold active:scale-95">+</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {[100, 200, 500, 1000].map((amt) => (
                  <button key={amt} onClick={() => setBet2(amt)} className="bg-[#0b0e14] border border-gray-800/80 text-[9px] text-gray-300 py-0.5 rounded font-bold hover:border-amber-500/50">
                    {amt} PKR
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-6 h-full flex items-stretch">
              {!hasBet2 ? (
                <button
                  disabled={gameState === "crashed"}
                  onClick={handlePlaceBet2}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 font-black text-black text-sm rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-h-[64px]"
                >
                  BET
                </button>
              ) : cashedOut2 ? (
                <div className="w-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 font-bold p-1 rounded-xl text-center text-[10px] flex items-center justify-center">
                  Cashed Out: PKR {win2}
                </div>
              ) : (
                <button
                  onClick={handleCashOut2}
                  disabled={gameState !== "running"}
                  className="w-full bg-amber-500 hover:bg-amber-600 font-black text-black text-xs rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-h-[64px]"
                >
                  CASH OUT ({Math.floor(bet2 * multiplier)})
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Bottom Tabs */}
      <div className="flex justify-center gap-6 text-xs text-gray-400 font-bold pt-1 pb-0.5 border-t border-gray-800/40">
        <button className="hover:text-white">All Bets</button>
        <button className="hover:text-white">My Bets</button>
      </div>

    </div>
  );
}
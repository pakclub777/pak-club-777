"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

// Fake Live Users Data for All Bets Feed
const INITIAL_LIVE_BETS = [
  { id: "1", user: "5***0", bet: 88.23, mult: 1.91, win: 168.52, cashed: true },
  { id: "2", user: "5***0", bet: 88.23, mult: 2.16, win: 190.58, cashed: true },
  { id: "3", user: "8***3", bet: 47.64, mult: 1.67, win: 79.56, cashed: true },
  { id: "4", user: "3***7", bet: 45.87, mult: 0, win: 0, cashed: false },
  { id: "5", user: "3***4", bet: 44.59, mult: 0, win: 0, cashed: false },
  { id: "6", user: "3***4", bet: 44.59, mult: 0, win: 0, cashed: false },
  { id: "7", user: "3***7", bet: 45.87, mult: 0, win: 0, cashed: false },
  { id: "8", user: "3***4", bet: 44.59, mult: 0, win: 0, cashed: false },
];

export default function AviatorGame() {
  const { balance, updateBalance } = useAuth();

  // Continuous Game Loop States
  const [gameState, setGameState] = useState<"WAITING" | "FLYING" | "CRASHED">("WAITING");
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [countdown, setCountdown] = useState<number>(5);
  const [history, setHistory] = useState<string[]>(["1.02x", "1.62x", "1.47x", "1.49x", "1.22x", "1.54x", "1.00x", "1.18x", "2.17x", "3.06x", "1.83x"]);
  const [activeTab, setActiveTab] = useState<"ALL" | "MY" | "TOP">("ALL");

  // Panel 1 States
  const [bet1Amount, setBet1Amount] = useState<number>(2.0);
  const [bet1Placed, setBet1Placed] = useState<boolean>(false);
  const [bet1Cashed, setBet1Cashed] = useState<boolean>(false);
  const [bet1Win, setBet1Win] = useState<number>(0);

  // Panel 2 States
  const [bet2Amount, setBet2Amount] = useState<number>(5.0);
  const [bet2Placed, setBet2Placed] = useState<boolean>(false);
  const [bet2Cashed, setBet2Cashed] = useState<boolean>(false);
  const [bet2Win, setBet2Win] = useState<number>(0);

  // References
  const crashPointRef = useRef<number>(2.0);
  const multiplierRef = useRef<number>(1.00);
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start Infinite 24/7 Game Loop
  useEffect(() => {
    runGameLoop();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, []);

  const runGameLoop = () => {
    // Phase 1: Waiting / Countdown
    setGameState("WAITING");
    setMultiplier(1.0);
    multiplierRef.current = 1.0;
    setBet1Cashed(false);
    setBet2Cashed(false);
    
    let timer = 5;
    setCountdown(timer);

    const countInterval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(countInterval);
        startFlyingPhase();
      }
    }, 1000);
  };

  const startFlyingPhase = () => {
    setGameState("FLYING");

    // Random Crash Point (1.05x to 15.00x)
    const randomCrash = parseFloat((Math.random() * 8 + 1.05).toFixed(2));
    crashPointRef.current = randomCrash;

    intervalRef.current = setInterval(() => {
      multiplierRef.current = parseFloat((multiplierRef.current + 0.02).toFixed(2));
      setMultiplier(multiplierRef.current);

      if (multiplierRef.current >= crashPointRef.current) {
        // Plane Flew Away
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        setGameState("CRASHED");
        const crashVal = `${crashPointRef.current.toFixed(2)}x`;
        setHistory((prev) => [crashVal, ...prev.slice(0, 10)]);

        // Reset placed bets if not cashed out
        setBet1Placed(false);
        setBet2Placed(false);

        // Wait 3 Seconds and Start Next Round
        loopTimeoutRef.current = setTimeout(() => {
          runGameLoop();
        }, 3000);
      }
    }, 80);
  };

  // Place Bet 1
  const handlePlaceBet1 = async () => {
    if (bet1Placed) return;
    if (balance < bet1Amount) {
      alert("Aapka balance kam hai!");
      return;
    }
    const ok = await updateBalance(-bet1Amount);
    if (ok) setBet1Placed(true);
  };

  // Cashout Bet 1
  const handleCashoutBet1 = async () => {
    if (!bet1Placed || bet1Cashed || gameState !== "FLYING") return;
    const win = parseFloat((bet1Amount * multiplierRef.current).toFixed(2));
    setBet1Win(win);
    setBet1Cashed(true);
    setBet1Placed(false);
    await updateBalance(win);
  };

  // Place Bet 2
  const handlePlaceBet2 = async () => {
    if (bet2Placed) return;
    if (balance < bet2Amount) {
      alert("Aapka balance kam hai!");
      return;
    }
    const ok = await updateBalance(-bet2Amount);
    if (ok) setBet2Placed(true);
  };

  // Cashout Bet 2
  const handleCashoutBet2 = async () => {
    if (!bet2Placed || bet2Cashed || gameState !== "FLYING") return;
    const win = parseFloat((bet2Amount * multiplierRef.current).toFixed(2));
    setBet2Win(win);
    setBet2Cashed(true);
    setBet2Placed(false);
    await updateBalance(win);
  };

  // Calculate curve height for Canvas
  const progressPercent = Math.min(((multiplier - 1.0) / 4.0) * 100, 85);

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#000000] text-white p-2 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex justify-between items-center py-1 px-1">
        <div className="flex items-center gap-2">
          <span className="font-black text-lg text-red-600 italic tracking-tighter">
            Aviator
          </span>
          <button className="bg-[#e67e22] text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>❓</span> How to play?
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-mono font-bold text-xs">
            {balance.toFixed(2)} <span className="text-[10px] text-gray-400">USD</span>
          </span>
          <button className="text-gray-400 text-lg">☰</button>
        </div>
      </div>

      {/* 2. Top Multiplier History Bar */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-1 text-[10px] font-bold">
        {history.map((h, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded-full whitespace-nowrap border ${
              parseFloat(h) > 2.0
                ? "bg-[#9b59b6]/20 text-[#a55eea] border-[#8e44ad]"
                : "bg-[#2bcbba]/20 text-[#2bcbba] border-[#0fb9b1]"
            }`}
          >
            {h}
          </span>
        ))}
      </div>

      {/* 3. Main Game Display Arena (Sunburst Background with Red Plane) */}
      <div className="relative h-48 w-full bg-[#0d070b] rounded-xl border border-gray-800 overflow-hidden flex flex-col justify-between p-3">
        
        {/* Radial Red Sunburst Background Layer */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 0% 100%, #e74c3c 0%, #2c0307 50%, #000000 100%)"
          }}
        />

        {/* Center Canvas Multiplier Text */}
        <div className="relative z-10 my-auto text-center">
          {gameState === "WAITING" && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                NEXT ROUND IN
              </span>
              <span className="text-3xl font-black text-amber-400">{countdown}s</span>
            </div>
          )}

          {gameState === "FLYING" && (
            <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
              {multiplier.toFixed(2)}x
            </span>
          )}

          {gameState === "CRASHED" && (
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-red-500 uppercase tracking-widest">
                FLEW AWAY!
              </span>
              <span className="text-4xl font-black text-red-600">
                {multiplier.toFixed(2)}x
              </span>
            </div>
          )}
        </div>

        {/* Animated Flying Red Curve & Plane */}
        {gameState === "FLYING" && (
          <div className="absolute bottom-0 left-0 right-0 top-0 pointer-events-none">
            {/* Red Fill Curve */}
            <svg className="w-full h-full">
              <path
                d={`M 0 190 Q ${progressPercent * 2} ${190 - progressPercent * 1.5}, ${progressPercent * 3.5} ${190 - progressPercent * 1.6} L ${progressPercent * 3.5} 190 Z`}
                fill="#b01323"
                opacity="0.85"
              />
            </svg>

            {/* Red Propeller Airplane Icon */}
            <div
              className="absolute transition-all duration-75 flex items-center"
              style={{
                left: `${Math.min(progressPercent * 3.2, 80)}%`,
                bottom: `${Math.min(progressPercent * 1.4, 75)}%`,
              }}
            >
              <span className="text-2xl transform -rotate-12 select-none">🛩️</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Dual Betting Control Panels */}
      <div className="grid grid-cols-1 gap-2 my-1">
        
        {/* Panel 1 */}
        <div className="bg-[#1b1c20] p-2 rounded-xl border border-gray-800 flex flex-col gap-1.5">
          <div className="flex justify-center text-[10px] gap-4 font-bold text-gray-400">
            <span className="text-white border-b border-amber-400">Bet</span>
            <span>Auto</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1 w-1/2">
              <div className="flex items-center bg-[#0d0e12] border border-gray-800 rounded-lg p-1 justify-between">
                <button onClick={() => setBet1Amount(Math.max(1, bet1Amount - 1))} className="text-gray-400 font-bold px-1.5">-</button>
                <span className="text-xs font-black text-white">{bet1Amount.toFixed(2)}</span>
                <button onClick={() => setBet1Amount(bet1Amount + 1)} className="text-gray-400 font-bold px-1.5">+</button>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-gray-300">
                {[1.00, 2.00, 5.00, 10.00].map((v) => (
                  <button key={v} onClick={() => setBet1Amount(v)} className="bg-[#24262b] rounded py-0.5 hover:bg-gray-700">
                    {v.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            {/* Green Action Button */}
            {bet1Placed && gameState === "FLYING" ? (
              <button
                onClick={handleCashoutBet1}
                className="w-1/2 bg-[#e67e22] hover:bg-[#d35400] text-black font-black py-3 rounded-xl uppercase text-xs shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center"
              >
                <span>CASH OUT</span>
                <span className="text-[10px]">{(bet1Amount * multiplier).toFixed(2)} USD</span>
              </button>
            ) : (
              <button
                onClick={handlePlaceBet1}
                disabled={bet1Placed && gameState === "WAITING"}
                className={`w-1/2 ${
                  bet1Placed ? "bg-amber-600 text-black" : "bg-[#27ae60] hover:bg-[#219653]"
                } text-white font-black py-3 rounded-xl uppercase text-xs shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center`}
              >
                <span>{bet1Placed ? "WAITING" : "BET"}</span>
                <span className="text-[10px]">{bet1Amount.toFixed(2)} USD</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel 2 */}
        <div className="bg-[#1b1c20] p-2 rounded-xl border border-gray-800 flex flex-col gap-1.5">
          <div className="flex justify-center text-[10px] gap-4 font-bold text-gray-400">
            <span className="text-white border-b border-amber-400">Bet</span>
            <span>Auto</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1 w-1/2">
              <div className="flex items-center bg-[#0d0e12] border border-gray-800 rounded-lg p-1 justify-between">
                <button onClick={() => setBet2Amount(Math.max(1, bet2Amount - 1))} className="text-gray-400 font-bold px-1.5">-</button>
                <span className="text-xs font-black text-white">{bet2Amount.toFixed(2)}</span>
                <button onClick={() => setBet2Amount(bet2Amount + 1)} className="text-gray-400 font-bold px-1.5">+</button>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-gray-300">
                {[1.00, 2.00, 5.00, 10.00].map((v) => (
                  <button key={v} onClick={() => setBet2Amount(v)} className="bg-[#24262b] rounded py-0.5 hover:bg-gray-700">
                    {v.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            {/* Green Action Button */}
            {bet2Placed && gameState === "FLYING" ? (
              <button
                onClick={handleCashoutBet2}
                className="w-1/2 bg-[#e67e22] hover:bg-[#d35400] text-black font-black py-3 rounded-xl uppercase text-xs shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center"
              >
                <span>CASH OUT</span>
                <span className="text-[10px]">{(bet2Amount * multiplier).toFixed(2)} USD</span>
              </button>
            ) : (
              <button
                onClick={handlePlaceBet2}
                disabled={bet2Placed && gameState === "WAITING"}
                className={`w-1/2 ${
                  bet2Placed ? "bg-amber-600 text-black" : "bg-[#27ae60] hover:bg-[#219653]"
                } text-white font-black py-3 rounded-xl uppercase text-xs shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center`}
              >
                <span>{bet2Placed ? "WAITING" : "BET"}</span>
                <span className="text-[10px]">{bet2Amount.toFixed(2)} USD</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 5. Bottom Live Feed & Bets Table */}
      <div className="bg-[#121316] rounded-t-xl border-t border-gray-800 p-2 flex flex-col h-36 overflow-hidden">
        {/* Table Tabs */}
        <div className="flex justify-between items-center text-[10px] font-bold pb-1 border-b border-gray-800">
          <div className="flex gap-3 text-gray-400">
            <button onClick={() => setActiveTab("ALL")} className={activeTab === "ALL" ? "text-white border-b border-amber-400" : ""}>All Bets 990</button>
            <button onClick={() => setActiveTab("MY")} className={activeTab === "MY" ? "text-white border-b border-amber-400" : ""}>My Bets</button>
            <button onClick={() => setActiveTab("TOP")} className={activeTab === "TOP" ? "text-white border-b border-amber-400" : ""}>Top</button>
          </div>
          <span className="text-gray-500 text-[9px]">📜 Previous hand</span>
        </div>

        {/* Live List Rows */}
        <div className="overflow-y-auto space-y-1 mt-1 text-[10px] font-mono">
          {INITIAL_LIVE_BETS.map((item) => (
            <div
              key={item.id}
              className={`flex justify-between items-center px-2 py-1 rounded ${
                item.cashed ? "bg-[#1e3a29]/80 text-white" : "bg-[#18191d] text-gray-400"
              }`}
            >
              <span className="flex items-center gap-1">
                <span>👤</span> {item.user}
              </span>
              <span>{item.bet.toFixed(2)}</span>
              {item.cashed ? (
                <span className="bg-[#10ac84] text-black font-bold px-1 rounded text-[9px]">
                  {item.mult.toFixed(2)}x
                </span>
              ) : (
                <span>-</span>
              )}
              <span className="font-bold text-white">
                {item.cashed ? item.win.toFixed(2) : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
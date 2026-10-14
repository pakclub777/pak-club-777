"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

// Live Bets Feed mirroring reference picture exactly
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

  const [gameState, setGameState] = useState<"WAITING" | "FLYING" | "CRASHED">("WAITING");
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [countdown, setCountdown] = useState<number>(5);
  const [history, setHistory] = useState<string[]>(["1.02x", "1.62x", "1.47x", "1.49x", "1.22x", "1.54x", "1.00x", "1.18x", "2.17x", "3.06x", "1.83x"]);
  const [activeTab, setActiveTab] = useState<"ALL" | "MY" | "TOP">("ALL");

  // Panel 1
  const [bet1Amount, setBet1Amount] = useState<number>(2.0);
  const [bet1Placed, setBet1Placed] = useState<boolean>(false);
  const [bet1Cashed, setBet1Cashed] = useState<boolean>(false);

  // Panel 2
  const [bet2Amount, setBet2Amount] = useState<number>(5.0);
  const [bet2Placed, setBet2Placed] = useState<boolean>(false);
  const [bet2Cashed, setBet2Cashed] = useState<boolean>(false);

  const crashPointRef = useRef<number>(2.0);
  const multiplierRef = useRef<number>(1.00);
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    runGameLoop();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, []);

  const runGameLoop = () => {
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
    const randomCrash = parseFloat((Math.random() * 8 + 1.05).toFixed(2));
    crashPointRef.current = randomCrash;

    intervalRef.current = setInterval(() => {
      multiplierRef.current = parseFloat((multiplierRef.current + 0.02).toFixed(2));
      setMultiplier(multiplierRef.current);

      if (multiplierRef.current >= crashPointRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        setGameState("CRASHED");
        const crashVal = `${crashPointRef.current.toFixed(2)}x`;
        setHistory((prev) => [crashVal, ...prev.slice(0, 10)]);

        setBet1Placed(false);
        setBet2Placed(false);

        loopTimeoutRef.current = setTimeout(() => {
          runGameLoop();
        }, 3000);
      }
    }, 80);
  };

  const handlePlaceBet1 = async () => {
    if (bet1Placed) return;
    if (balance < bet1Amount) {
      alert("Aapka balance kam hai!");
      return;
    }
    const ok = await updateBalance(-bet1Amount);
    if (ok) setBet1Placed(true);
  };

  const handleCashoutBet1 = async () => {
    if (!bet1Placed || bet1Cashed || gameState !== "FLYING") return;
    const win = parseFloat((bet1Amount * multiplierRef.current).toFixed(2));
    setBet1Cashed(true);
    setBet1Placed(false);
    await updateBalance(win);
  };

  const handlePlaceBet2 = async () => {
    if (bet2Placed) return;
    if (balance < bet2Amount) {
      alert("Aapka balance kam hai!");
      return;
    }
    const ok = await updateBalance(-bet2Amount);
    if (ok) setBet2Placed(true);
  };

  const handleCashoutBet2 = async () => {
    if (!bet2Placed || bet2Cashed || gameState !== "FLYING") return;
    const win = parseFloat((bet2Amount * multiplierRef.current).toFixed(2));
    setBet2Cashed(true);
    setBet2Placed(false);
    await updateBalance(win);
  };

  const progressPercent = Math.min(((multiplier - 1.0) / 4.0) * 100, 85);

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-2 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Top Header */}
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
          <Link href="/" className="text-gray-400 text-lg">☰</Link>
        </div>
      </div>

      {/* Top History Bar */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-1 text-[10px] font-bold">
        {history.map((h, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded-full whitespace-nowrap border ${
              parseFloat(h) > 2.0
                ? "bg-purple-950/80 text-purple-400 border-purple-800"
                : "bg-blue-950/80 text-blue-400 border-blue-800"
            }`}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Main Game Screen with Red Sunburst, Red Curve & Plane */}
      <div 
        className="relative h-48 w-full rounded-xl border border-gray-800 overflow-hidden flex flex-col justify-between p-3 shadow-inner"
        style={{
          background: "radial-gradient(circle at 0% 100%, #8b0000 0%, #1f0508 50%, #080a0f 100%)"
        }}
      >
        <div className="relative z-10 my-auto text-center">
          {gameState === "WAITING" && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                WAITING FOR NEXT ROUND
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

        {gameState === "FLYING" && (
          <div className="absolute bottom-0 left-0 right-0 top-0 pointer-events-none">
            <svg className="w-full h-full">
              <path
                d={`M 0 190 Q ${progressPercent * 2} ${190 - progressPercent * 1.5}, ${progressPercent * 3.5} ${190 - progressPercent * 1.6} L ${progressPercent * 3.5} 190 Z`}
                fill="#d63031"
                opacity="0.85"
              />
            </svg>

            <div
              className="absolute transition-all duration-75 flex items-center z-20"
              style={{
                left: `${Math.min(progressPercent * 3.2, 80)}%`,
                bottom: `${Math.min(progressPercent * 1.4, 75)}%`,
              }}
            >
              <span className="text-2xl transform -rotate-12 select-none drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]">🛩️</span>
            </div>
          </div>
        )}
      </div>

      {/* Dual Betting Controls */}
      <div className="grid grid-cols-1 gap-2 my-1">
        {/* Panel 1 */}
        <div className="bg-[#141824] p-2 rounded-xl border border-gray-800 flex flex-col gap-1.5">
          <div className="flex justify-center text-[10px] gap-4 font-bold text-gray-400">
            <span className="text-white border-b border-amber-400">Bet</span>
            <span>Auto</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1 w-1/2">
              <div className="flex items-center bg-[#0a0d14] border border-gray-800 rounded-lg p-1 justify-between">
                <button onClick={() => setBet1Amount(Math.max(1, bet1Amount - 1))} className="text-gray-400 font-bold px-1.5">-</button>
                <span className="text-xs font-black text-white">{bet1Amount.toFixed(2)}</span>
                <button onClick={() => setBet1Amount(bet1Amount + 1)} className="text-gray-400 font-bold px-1.5">+</button>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-gray-300">
                {[1.00, 2.00, 5.00, 10.00].map((v) => (
                  <button key={v} onClick={() => setBet1Amount(v)} className="bg-[#1d2333] rounded py-0.5 hover:bg-gray-700">
                    {v.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

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
        <div className="bg-[#141824] p-2 rounded-xl border border-gray-800 flex flex-col gap-1.5">
          <div className="flex justify-center text-[10px] gap-4 font-bold text-gray-400">
            <span className="text-white border-b border-amber-400">Bet</span>
            <span>Auto</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1 w-1/2">
              <div className="flex items-center bg-[#0a0d14] border border-gray-800 rounded-lg p-1 justify-between">
                <button onClick={() => setBet2Amount(Math.max(1, bet2Amount - 1))} className="text-gray-400 font-bold px-1.5">-</button>
                <span className="text-xs font-black text-white">{bet2Amount.toFixed(2)}</span>
                <button onClick={() => setBet2Amount(bet2Amount + 1)} className="text-gray-400 font-bold px-1.5">+</button>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-gray-300">
                {[1.00, 2.00, 5.00, 10.00].map((v) => (
                  <button key={v} onClick={() => setBet2Amount(v)} className="bg-[#1d2333] rounded py-0.5 hover:bg-gray-700">
                    {v.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

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

      {/* Live Wins Feed Table */}
      <div className="bg-[#10131c] rounded-t-xl border-t border-gray-800 p-2 flex flex-col h-36 overflow-hidden">
        <div className="flex justify-between items-center text-[10px] font-bold pb-1 border-b border-gray-800">
          <div className="flex gap-3 text-gray-400">
            <button onClick={() => setActiveTab("ALL")} className={activeTab === "ALL" ? "text-white border-b border-amber-400" : ""}>All Bets 990</button>
            <button onClick={() => setActiveTab("MY")} className={activeTab === "MY" ? "text-white border-b border-amber-400" : ""}>My Bets</button>
            <button onClick={() => setActiveTab("TOP")} className={activeTab === "TOP" ? "text-white border-b border-amber-400" : ""}>Top</button>
          </div>
          <span className="text-gray-500 text-[9px]">📜 Previous hand</span>
        </div>

        <div className="overflow-y-auto space-y-1 mt-1 text-[10px] font-mono">
          {INITIAL_LIVE_BETS.map((item) => (
            <div
              key={item.id}
              className={`flex justify-between items-center px-2 py-1 rounded ${
                item.cashed ? "bg-[#1b3827] text-white" : "bg-[#151922] text-gray-400"
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
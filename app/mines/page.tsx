"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

const GRID_SIZE = 25;

export default function MinesGame() {
  const { balance, updateBalance } = useAuth(); // Global Supabase Auth & Live Balance
  const [betAmount, setBetAmount] = useState<number>(10);
  const [minesCount, setMinesCount] = useState<number>(3);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [grid, setGrid] = useState<Array<"hidden" | "gem" | "mine">>(Array(GRID_SIZE).fill("hidden"));
  const [mineLocations, setMineLocations] = useState<number[]>([]);
  const [gemsFound, setGemsFound] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const startGame = async () => {
    // Balance Validation
    if (balance < betAmount) {
      alert("Aapka balance kam hai! Khelne ke liye pehle deposit karein.");
      return;
    }

    // 1. Balance Deduct Karein (Database Sync)
    const success = await updateBalance(-betAmount);
    if (!success) return;

    const mines: number[] = [];
    while (mines.length < minesCount) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      if (!mines.includes(r)) mines.push(r);
    }
    setMineLocations(mines);
    setGrid(Array(GRID_SIZE).fill("hidden"));
    setGemsFound(0);
    setGameStarted(true);
    setGameOver(false);
  };

  const revealTile = async (index: number) => {
    if (!gameStarted || grid[index] !== "hidden" || gameOver) return;

    if (mineLocations.includes(index)) {
      const newGrid = [...grid];
      mineLocations.forEach((m) => (newGrid[m] = "mine"));
      setGrid(newGrid);
      setGameOver(true);
    } else {
      const newGrid = [...grid];
      newGrid[index] = "gem";
      setGrid(newGrid);
      const newGemsCount = gemsFound + 1;
      setGemsFound(newGemsCount);

      // Check if all gems discovered
      if (newGemsCount === GRID_SIZE - minesCount) {
        const winMult = 1 + newGemsCount * (0.15 + minesCount * 0.05);
        const totalWin = Math.floor(betAmount * winMult);
        await updateBalance(totalWin);
        setGameStarted(false);
        alert(`Jackpot! Aapne saaray gems dhoond liye: PKR ${totalWin}`);
      }
    }
  };

  const multiplier = (1 + gemsFound * (0.15 + minesCount * 0.05)).toFixed(2);
  const currentWin = Math.floor(betAmount * parseFloat(multiplier));

  const handleCashout = async () => {
    if (!gameStarted || gameOver || gemsFound === 0) return;

    // 2. Winnings Add Karein (Database Sync)
    await updateBalance(currentWin);
    setGameStarted(false);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-2.5 max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 text-base">☰</Link>
          <span className="font-black text-sm tracking-wide text-white">
            Z666 <span className="text-[10px] text-gray-400 font-normal block -mt-1">- MINES -</span>
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

      {/* Grid Container */}
      <div className="bg-[#141a26] p-2 rounded-2xl border border-gray-800/80 my-auto">
        <div className="grid grid-cols-5 gap-1.5">
          {grid.map((tile, idx) => (
            <button
              key={idx}
              onClick={() => revealTile(idx)}
              className={`h-10 rounded-xl flex items-center justify-center text-base font-bold transition-all border ${
                tile === "hidden"
                  ? "bg-[#0b0e14] border-gray-800 active:scale-95"
                  : tile === "gem"
                  ? "bg-emerald-600/30 border-emerald-500 shadow-[0_0_8px_#10b981]"
                  : "bg-red-600/30 border-red-500 shadow-[0_0_8px_#ef4444]"
              }`}
            >
              {tile === "hidden" ? "" : tile === "gem" ? "💎" : "💣"}
            </button>
          ))}
        </div>
      </div>

      {/* Mines Count & Betting Settings */}
      <div className="bg-[#141a26] border border-gray-800/80 p-2 rounded-xl flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-gray-300">MINES:</span>
        <div className="flex gap-1">
          {[1, 3, 5, 10].map((count) => (
            <button
              key={count}
              disabled={gameStarted}
              onClick={() => setMinesCount(count)}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                minesCount === count
                  ? "bg-red-600 text-white"
                  : "bg-[#0b0e14] text-gray-400 border border-gray-800"
              }`}
            >
              💣 {count}
            </button>
          ))}
        </div>
      </div>

      {/* Betting Control Box */}
      <div className="bg-[#141a26] border border-gray-800/80 p-2.5 rounded-2xl">
        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-6 flex flex-col gap-1.5">
            <div className="bg-[#0b0e14] border border-gray-800 rounded-lg px-2 py-1 flex justify-between items-center">
              <span className="text-xs font-bold text-white">{betAmount.toFixed(2)}</span>
              <div className="flex gap-1 text-gray-400">
                <button
                  disabled={gameStarted}
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  className="w-5 h-5 bg-gray-800/80 rounded flex items-center justify-center text-xs font-bold active:scale-95"
                >
                  -
                </button>
                <button
                  disabled={gameStarted}
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="w-5 h-5 bg-gray-800/80 rounded flex items-center justify-center text-xs font-bold active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  disabled={gameStarted}
                  onClick={() => setBetAmount(amt)}
                  className="bg-[#0b0e14] border border-gray-800/80 text-[9px] text-gray-300 py-0.5 rounded font-bold hover:border-amber-500/50"
                >
                  {amt} PKR
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-6 h-full flex items-stretch">
            {!gameStarted || gameOver ? (
              <button
                onClick={startGame}
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-black text-black text-sm rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center min-h-[60px]"
              >
                BET
              </button>
            ) : (
              <button
                onClick={handleCashout}
                disabled={gemsFound === 0}
                className="w-full bg-amber-500 hover:bg-amber-600 font-black text-black text-xs rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-h-[60px]"
              >
                CASHOUT ({currentWin})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Tabs */}
      <div className="flex justify-center gap-6 text-xs text-gray-400 font-bold py-1 border-t border-gray-800/40">
        <button className="hover:text-white">All Bets</button>
        <button className="hover:text-white">My Bets</button>
      </div>
    </div>
  );
}
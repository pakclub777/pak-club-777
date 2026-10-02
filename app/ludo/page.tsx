"use client";
import React, { useState } from "react";

export default function LudoGame() {
  const [dice, setDice] = useState<number | null>(null);

  const rollDice = () => {
    setDice(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">🎲 Ludo Betting</h1>
      <div className="w-32 h-32 bg-yellow-500 text-black text-6xl font-bold flex items-center justify-center rounded-2xl mb-6">
        {dice ? dice : "?"}
      </div>
      <button 
        onClick={rollDice}
        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-lg text-lg"
      >
        Roll Dice
      </button>
    </div>
  );
}
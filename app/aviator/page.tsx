"use client";
import React, { useState } from "react";

export default function AviatorGame() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-3xl font-bold text-red-500 mb-4">🚀 Aviator Game</h1>
      <div className="w-80 h-48 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 mb-6">
        <span className="text-5xl font-extrabold text-green-400">{multiplier.toFixed(2)}x</span>
      </div>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 font-bold rounded-lg text-lg transition"
      >
        {isPlaying ? "CASH OUT" : "BET NOW"}
      </button>
    </div>
  );
}
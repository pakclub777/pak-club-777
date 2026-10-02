"use client";
import React from "react";

export default function RouletteGame() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-3xl font-bold text-red-400 mb-4">🎡 Wheel Spin / Roulette</h1>
      <div className="w-48 h-48 rounded-full border-8 border-red-500 flex items-center justify-center text-2xl font-bold mb-6">
        SPIN
      </div>
      <button className="px-6 py-3 bg-red-600 hover:bg-red-700 font-bold rounded-lg text-lg">
        Start Spin
      </button>
    </div>
  );
}
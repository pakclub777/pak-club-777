"use client";
import React, { useState } from "react";

export default function ColorPrediction() {
  const [selectedColor, setSelectedColor] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">🎨 Color Prediction</h1>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setSelectedColor('Red')} className="px-6 py-4 bg-red-600 font-bold rounded-lg text-lg">Red</button>
        <button onClick={() => setSelectedColor('Green')} className="px-6 py-4 bg-green-600 font-bold rounded-lg text-lg">Green</button>
        <button onClick={() => setSelectedColor('Violet')} className="px-6 py-4 bg-purple-600 font-bold rounded-lg text-lg">Violet</button>
      </div>
      {selectedColor && <p className="text-xl">You picked: <span className="font-bold">{selectedColor}</span></p>}
    </div>
  );
}
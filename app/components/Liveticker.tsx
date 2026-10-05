"use client";
import React, { useEffect, useState } from "react";

const initialWinners = [
  { phone: "+92 300 ***1234", game: "Aviator", win: "Rs. 15,400" },
  { phone: "+92 312 ***5678", game: "Mines", win: "Rs. 8,200" },
  { phone: "+92 345 ***9012", game: "Dragon vs Tiger", win: "Rs. 32,100" },
  { phone: "+92 333 ***4321", game: "Slots 777", win: "Rs. 5,000" },
];

export default function LiveTicker() {
  const [winners, setWinners] = useState(initialWinners);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPhone = `+92 3${Math.floor(10 + Math.random() * 80)} ***${Math.floor(1000 + Math.random() * 9000)}`;
      const randomWin = `Rs. ${(Math.floor(Math.random() * 500) * 100 + 500).toLocaleString()}`;
      const games = ["Aviator", "Mines", "Plinko", "Dragon vs Tiger", "777 Slots"];
      const randomGame = games[Math.floor(Math.random() * games.length)];

      setWinners((prev) => [
        { phone: randomPhone, game: randomGame, win: randomWin },
        ...prev.slice(0, 5),
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#101726] border-y border-amber-500/20 py-2 overflow-hidden my-3">
      <div className="flex gap-4 animate-pulse px-3 overflow-x-auto whitespace-nowrap scrollbar-none">
        {winners.map((item, idx) => (
          <div key={idx} className="bg-[#182234] border border-gray-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-white shrink-0">
            <span className="text-amber-400 font-mono font-bold">{item.phone}</span>
            <span className="text-gray-400">won in {item.game}:</span>
            <span className="text-green-400 font-bold">{item.win}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
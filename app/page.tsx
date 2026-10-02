"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Casino Games List
const GAMES = [
  { id: "aviator", name: "AVIATOR", category: "Hot", image: "🚀", route: "/crash", isHot: true },
  { id: "rocket", name: "ROCKET CRASH", category: "Hot", image: "🔥", route: "/crash", isHot: true },
  { id: "dragon", name: "DRAGON VS TIGER", category: "Cards", image: "🐉", route: "/dragon-tiger", isHot: true },
  { id: "mines", name: "MINES", category: "Hot", image: "💣", route: "/mines", isHot: false },
  { id: "slots", name: "777 SLOTS", category: "Slot", image: "🎰", route: "/slots", isHot: false },
  { id: "plinko", name: "PLINKO", category: "Hot", image: "🟣", route: "/plinko", isHot: false },
  { id: "roulette", name: "LUCKY ROULETTE", category: "Live", image: "🎡", route: "/roulette", isHot: false },
  { id: "zoo", name: "ZOO ROULETTE", category: "Cards", image: "🦁", route: "/zoo", isHot: false },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Hot");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Live Wins Ticker (Casino 7999 Style Auto-updates)
  const [tickerWin, setTickerWin] = useState({ phone: "0309***21", amount: "25,400", game: "Plinko" });

  useEffect(() => {
    const interval = setInterval(() => {
      const phones = ["0301", "0345", "0312", "0333", "0321", "0300", "0311"];
      const games = ["Aviator", "Mines", "Plinko", "777 Slots", "Dragon vs Tiger"];
      const randomPhone = `${phones[Math.floor(Math.random() * phones.length)]}***${Math.floor(10 + Math.random() * 90)}`;
      const randomAmount = (Math.floor(Math.random() * 800) + 100) * 100;
      const randomGame = games[Math.floor(Math.random() * games.length)];
      
      setTickerWin({ phone: randomPhone, amount: randomAmount.toLocaleString(), game: randomGame });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleGameClick = (route: string) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      window.location.href = route;
    }
  };

  const filteredGames = selectedCategory === "Hot" 
    ? GAMES 
    : GAMES.filter(g => g.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white pb-20 font-sans">
      {/* 1. TOP HEADER (BRANDING, BALANCE, DEPOSIT & WITHDRAW) */}
      <header className="sticky top-0 z-40 bg-[#121926] border-b border-yellow-500/20 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <div>
            <h1 className="font-extrabold text-amber-400 tracking-wider text-sm sm:text-base leading-none">PAK CLUB 777</h1>
            <span className="text-[9px] text-gray-400 tracking-widest uppercase">CASINO</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="bg-[#1a2332] px-2.5 py-1 rounded-lg text-[11px] font-bold text-green-400 border border-green-500/30 flex items-center gap-1">
            <span>PKR 0.00</span>
            <span className="bg-green-500 text-black px-1 rounded text-[9px] font-extrabold">+</span>
          </div>
          
          <button 
            onClick={() => setShowAuthModal(true)} 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-[11px] px-2.5 py-1 rounded-lg shadow-md uppercase"
          >
            Deposit
          </button>
          
          <button 
            onClick={() => setShowAuthModal(true)} 
            className="bg-[#1c283a] hover:bg-[#25354d] text-amber-400 border border-amber-500/40 font-bold text-[11px] px-2.5 py-1 rounded-lg uppercase"
          >
            Withdraw
          </button>
        </div>
      </header>

      {/* 2. PROMO BANNER */}
      <div className="p-3">
        <div className="bg-gradient-to-r from-amber-600 via-purple-800 to-indigo-950 rounded-2xl p-4 relative overflow-hidden shadow-xl border border-amber-500/30">
          <div className="relative z-10">
            <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              PAK CLUB AVIATOR
            </span>
            <h2 className="text-2xl font-black italic mt-1 text-white drop-shadow-md">WIN BIG! WIN FAST!</h2>
            <p className="text-[11px] text-gray-200 mt-0.5">Crash & Rocket Games with 100x Multipliers</p>
          </div>
          <div className="absolute -right-2 -bottom-4 text-7xl opacity-30 select-none">🚀</div>
        </div>
      </div>

      {/* 3. LIVE WINNING TICKER */}
      <div className="px-3 mb-3">
        <div className="bg-[#141c2b] border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-amber-400">🔊</span>
            <span className="text-gray-300 font-medium">{tickerWin.phone}</span>
            <span className="text-amber-400 font-bold">Won</span>
            <span className="text-green-400 font-extrabold">{tickerWin.amount} PKR</span>
          </div>
          <span className="bg-amber-500/20 text-amber-300 text-[9px] px-2 py-0.5 rounded-md font-semibold">
            {tickerWin.game}
          </span>
        </div>
      </div>

      {/* 4. CATEGORIES TABS */}
      <div className="px-3 mb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 text-xs font-semibold">
          {["Hot", "Cards", "Slot", "Live"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl whitespace-nowrap border transition-all text-[11px] ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-black font-extrabold shadow-md"
                  : "bg-[#141c2b] border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {cat === "Hot" ? "🔥 Hot" : cat === "Cards" ? "🃏 Cards" : cat === "Slot" ? "🎰 Slot" : "🎲 Live"}
            </button>
          ))}
        </div>
      </div>

      {/* 5. GAMES GRID */}
      <div className="px-3 grid grid-cols-3 gap-2.5">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.route)}
            className="bg-[#141c2b] border border-gray-800 hover:border-amber-500/50 rounded-2xl p-2.5 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform relative group overflow-hidden"
          >
            {game.isHot && (
              <span className="absolute top-1 right-1 bg-red-600 text-[8px] text-white px-1.5 py-0.2 rounded-full font-extrabold">
                HOT
              </span>
            )}
            <div className="text-4xl my-2 group-hover:scale-110 transition-transform select-none">{game.image}</div>
            <span className="text-[10px] font-bold tracking-tight text-gray-200 mt-0.5">{game.name}</span>
          </div>
        ))}
      </div>

      {/* 6. SIGN IN / SIGN UP POPUP MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c2b] border border-amber-500/40 rounded-2xl p-5 w-full max-w-xs text-center relative shadow-2xl">
            <button 
              onClick={() => setShowAuthModal(false)} 
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            <div className="text-4xl mb-2">🎰</div>
            <h3 className="text-lg font-extrabold text-amber-400 mb-1">Pak Club 777</h3>
            <p className="text-xs text-gray-300 mb-5">
              Khelne, Deposit ya Withdraw karne ke liye pehle Sign In / Register karein.
            </p>
            <div className="flex flex-col gap-2">
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold py-2.5 rounded-xl text-xs uppercase block shadow-lg"
              >
                Sign In / Register
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 7. BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f1521] border-t border-gray-800 px-2 py-2 flex justify-around text-[10px] text-gray-400">
        <button className="flex flex-col items-center text-amber-400 font-bold">
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <button onClick={() => setShowAuthModal(true)} className="flex flex-col items-center hover:text-white">
          <span className="text-base">💳</span>
          <span>Withdraw</span>
        </button>
        <button onClick={() => setShowAuthModal(true)} className="flex flex-col items-center hover:text-white">
          <span className="text-base">👨‍👩‍‍‍👧‍👦</span>
          <span>Invite</span>
        </button>
        <button onClick={() => setShowAuthModal(true)} className="flex flex-col items-center hover:text-white">
          <span className="text-base">👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
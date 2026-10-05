"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./context/Authcontext";
import LiveTicker from "./components/LiveTicker";

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
  const { balance, user } = useAuth(); // Global Real-time Balance Fetch
  const [selectedCategory, setSelectedCategory] = useState("Hot");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on page load & Context Update
  useEffect(() => {
    const checkLoginStatus = () => {
      const userFlag = localStorage.getItem("user_logged_in") === "true";
      const sessionData = localStorage.getItem("sb-session");
      if (user || userFlag || sessionData) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [user]);

  const handleGameClick = (route: string) => {
    const userFlag = localStorage.getItem("user_logged_in") === "true" || !!localStorage.getItem("sb-session") || !!user;

    if (!userFlag && !isLoggedIn) {
      setShowAuthModal(true);
    } else {
      window.location.href = route;
    }
  };

  const handleActionClick = (route: string) => {
    const userFlag = localStorage.getItem("user_logged_in") === "true" || !!localStorage.getItem("sb-session") || !!user;
    if (!userFlag && !isLoggedIn) {
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
      {/* 1. TOP HEADER (BRANDING, LIVE BALANCE, DEPOSIT & WITHDRAW) */}
      <header className="sticky top-0 z-40 bg-[#121926] border-b border-yellow-500/20 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <div>
            <h1 className="font-extrabold text-amber-400 tracking-wider text-sm sm:text-base leading-none">PAK CLUB 777</h1>
            <span className="text-[9px] text-gray-400 tracking-widest uppercase">CASINO</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dynamic Balance Display */}
          <div className="bg-[#1a2332] px-2.5 py-1 rounded-lg text-[11px] font-bold text-green-400 border border-green-500/30 flex items-center gap-1">
            <span>PKR {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <button onClick={() => handleActionClick("/deposit")} className="bg-green-500 text-black px-1 rounded text-[9px] font-extrabold">+</button>
          </div>
          
          <button 
            onClick={() => handleActionClick("/deposit")} 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-[11px] px-2.5 py-1 rounded-lg shadow-md uppercase"
          >
            Deposit
          </button>
          
          <button 
            onClick={() => handleActionClick("/withdraw")} 
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
      <div className="px-3">
        <LiveTicker />
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
    </div>
  );
}
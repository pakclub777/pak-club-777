"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GamePage() {
  const [balance, setBalance] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(100); // Default bet amount 100
  const [loading, setLoading] = useState<boolean>(false);

  // User ka current balance fetch karein jab page load ho
  const fetchBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();
      if (profile) setBalance(profile.balance || 0);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // 🎯 YAHAN PAR AYEGA AAPKA BET LOGIC FUNCTION
  const handlePlayGame = async (betAmount: number, isWin: boolean) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Log in karein!");
      setLoading(false);
      return;
    }

    // Current balance fetch karein
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    const currentBalance = profile?.balance || 0;

    if (currentBalance < betAmount) {
      alert("Insufficient Balance! Pehle deposit karein.");
      setLoading(false);
      return;
    }

    // Win par bet amount profit ke saath add, Lose par bet amount deduct
    let updatedBalance = currentBalance;
    if (isWin) {
      updatedBalance += Number(betAmount); // Profit add
    } else {
      updatedBalance -= Number(betAmount); // Bet deduct
    }

    // Database update
    const { error } = await supabase
      .from("profiles")
      .update({ balance: updatedBalance })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      alert("Error updating balance: " + error.message);
    } else {
      setBalance(updatedBalance); // Local state bhi update karein
      alert(
        isWin
          ? `🎉 You Won! New Balance: PKR ${updatedBalance}`
          : `❌ You Lost! New Balance: PKR ${updatedBalance}`
      );
    }
  };

  // Example Game Trigger (Random Win/Loss Simulation for testing)
  const playGameTrigger = (isUserWinner: boolean) => {
    handlePlayGame(betAmount, isUserWinner);
  };

  return (
    <div className="p-4 bg-[#0b0f17] min-h-screen text-white max-w-md mx-auto font-sans">
      <h1 className="text-base font-bold text-amber-400 mb-4">🎮 Play Game</h1>

      {/* Current Balance Display */}
      <div className="bg-[#141c2b] p-3 rounded-xl border border-amber-500/20 mb-4 flex justify-between items-center">
        <span className="text-xs text-gray-400">Your Balance:</span>
        <span className="text-sm font-black text-amber-400">PKR {balance}</span>
      </div>

      {/* Bet Input */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Bet Amount (PKR)</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-full bg-[#141c2b] border border-gray-800 rounded-lg p-2.5 text-xs text-white"
        />
      </div>

      {/* Bet Buttons */}
      <div className="flex gap-2">
        <button
          disabled={loading}
          onClick={() => playGameTrigger(true)} // Simulate Win
          className="w-1/2 bg-green-600 hover:bg-green-500 font-bold text-white py-3 rounded-lg text-xs"
        >
          {loading ? "Playing..." : "Test Win (+ PKR " + betAmount + ")"}
        </button>
        <button
          disabled={loading}
          onClick={() => playGameTrigger(false)} // Simulate Loss
          className="w-1/2 bg-red-600 hover:bg-red-500 font-bold text-white py-3 rounded-lg text-xs"
        >
          {loading ? "Playing..." : "Test Loss (- PKR " + betAmount + ")"}
        </button>
      </div>
    </div>
  );
}
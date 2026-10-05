"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function DepositPage() {
  const [amount, setAmount] = useState<number | "">(1000);
  const [trxId, setTrxId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"jazzcash" | "easypaisa">("jazzcash");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Real-time Balance Fetching
  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserBalance(profile.balance || 0);
      }
    }
  };

  const jazzcashAccounts = [
    { name: "Muhammad Abdullah", number: "03019292354", type: "JazzCash" },
    { name: "Adeba Arif", number: "03039252392", type: "JazzCash" },
  ];

  const easypaisaAccounts = [
    { name: "Muhammad Abdullah", number: "03019292354", type: "EasyPaisa" },
    { name: "Adeba Arif", number: "03039252392", type: "EasyPaisa" },
  ];

  const handleCopy = (num: string, idxKey: string) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(idxKey);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) < 1000) {
      alert("Kam se kam PKR 1000 deposit kar sakte hain!");
      return;
    }

    if (!trxId.trim()) {
      alert("Meharbani karke Transaction ID enter karein!");
      return;
    }

    setLoading(true);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Aap logged in nahi hain! Pehle login karein.");
      setLoading(false);
      return;
    }

    // Direct Insert into Supabase
    const { error } = await supabase.from("deposits").insert([
      {
        user_id: user.id,
        amount: Number(amount),
        trx_id: trxId.trim(),
        payment_method: paymentMethod,
        status: "pending",
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Deposit insert error:", error);
      alert("Deposit request send karne mein masla hua: " + error.message);
    } else {
      setIsSubmitted(true);
    }
  };

  const currentAccounts = paymentMethod === "jazzcash" ? jazzcashAccounts : easypaisaAccounts;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-4 w-full max-w-lg mx-auto flex flex-col gap-4 font-sans pb-10">
      {/* Top Bar Navigation */}
      <div className="flex justify-between items-center bg-[#141c2b] p-3 rounded-xl border border-gray-800 shadow-md">
        <Link href="/" className="text-xs bg-[#0b0f17] border border-gray-700 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-800 transition-colors">
          ← Back
        </Link>
        <span className="text-amber-400 font-black text-xs tracking-wider">👑 PAK CLUB 777</span>
        <span className="text-xs bg-green-950 text-green-400 border border-green-800 px-2.5 py-1 rounded font-extrabold">
          PKR {userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-amber-400">Deposit Funds</h1>
        <p className="text-xs text-gray-400 mt-0.5">Paisa bhej kar Transaction ID enter karein</p>
      </div>

      {isSubmitted ? (
        <div className="bg-[#141c2b] border border-amber-500/50 p-6 rounded-2xl text-center flex flex-col items-center gap-3 mt-2 shadow-lg">
          <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-3xl font-black">
            ⏳
          </div>
          <h2 className="text-lg font-black text-amber-400">Deposit Request Pending!</h2>
          <p className="text-xs text-gray-300">
            Aapki PKR <b className="text-amber-400">{amount}</b> ki deposit request Admin ko bhej di gayi hai.
          </p>
          <div className="bg-[#0b0f17] px-4 py-2.5 rounded-xl border border-gray-800 text-xs font-mono text-gray-300 w-full text-center">
            Trx ID: <span className="text-amber-400 font-bold">{trxId}</span>
          </div>
          <p className="text-[11px] text-gray-400">
            Admin check karke approval dega, uske baad balance aapke account mein show ho jayega.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setAmount(1000);
              setTrxId("");
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-3 rounded-xl text-xs mt-2 transition-all active:scale-95"
          >
            Nayi Request Send Karein
          </button>
        </div>
      ) : (
        <form onSubmit={handleDeposit} className="flex flex-col gap-4">
          {/* Payment Method Switcher */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("jazzcash")}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center font-bold text-xs transition-all ${
                paymentMethod === "jazzcash"
                  ? "bg-red-600/20 border-red-500 text-red-400 shadow-md"
                  : "bg-[#141c2b] border-gray-800 text-gray-400 hover:bg-gray-800"
              }`}
            >
              <span>JazzCash</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("easypaisa")}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center font-bold text-xs transition-all ${
                paymentMethod === "easypaisa"
                  ? "bg-green-600/20 border-green-500 text-green-400 shadow-md"
                  : "bg-[#141c2b] border-gray-800 text-gray-400 hover:bg-gray-800"
              }`}
            >
              <span>EasyPaisa</span>
            </button>
          </div>

          {/* Account Details Box with Copy Buttons */}
          <div className={`flex flex-col gap-2.5 bg-[#141c2b] border ${
            paymentMethod === "jazzcash" ? "border-red-500/30" : "border-green-500/30"
          } p-3.5 rounded-2xl shadow-md`}>
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
              In {paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"} Accounts Par Paisa Bhejein:
            </p>

            {currentAccounts.map((acc, index) => {
              const key = `${paymentMethod}-${index}`;
              const isCopied = copiedIndex === key;
              return (
                <div key={key} className="bg-[#0b0f17] border border-gray-800 p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-white">{acc.name}</p>
                      <span className={`text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                        paymentMethod === "jazzcash" ? "bg-red-500 text-white" : "bg-green-500 text-black"
                      }`}>
                        ⚡ {acc.type}
                      </span>
                    </div>
                    <p className="text-sm font-mono font-bold text-amber-400 mt-1">{acc.number}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(acc.number, key)}
                    className={`text-[11px] px-3 py-1.5 rounded-lg font-bold border transition-all active:scale-95 ${
                      isCopied
                        ? "bg-green-600 text-white border-green-500"
                        : "bg-[#141c2b] text-amber-400 border-amber-500/40 hover:bg-amber-500 hover:text-black"
                    }`}
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Amount Input */}
          <div className="bg-[#141c2b] border border-gray-800 p-3.5 rounded-2xl flex flex-col gap-2 shadow-md">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-300">Enter Amount (PKR)</label>
              <span className="text-[10px] text-amber-400 font-bold">Min: 1000 PKR</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="bg-[#0b0f17] border border-gray-800 rounded-xl p-3 text-amber-400 font-black text-lg focus:outline-none focus:border-amber-500"
              placeholder="Min 1000"
              min={1000}
              required
            />
            <div className="grid grid-cols-4 gap-2 mt-1">
              {[1000, 2000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className="bg-[#0b0f17] text-[11px] text-gray-300 border border-gray-800 py-2 rounded-lg font-bold hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID Input */}
          <div className="bg-[#141c2b] border border-gray-800 p-3.5 rounded-2xl flex flex-col gap-1.5 shadow-md">
            <label className="text-xs font-bold text-gray-300">Enter Trx ID / TID (Transaction ID)</label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              className="bg-[#0b0f17] border border-gray-800 rounded-xl p-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              placeholder="e.g. 84920492810"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 font-black text-black py-3.5 rounded-xl uppercase text-xs shadow-lg active:scale-95 transition-all mt-1 disabled:opacity-50"
          >
            {loading ? "Sending..." : `Submit Deposit Request (PKR ${amount || 0})`}
          </button>
        </form>
      )}
    </div>
  );
}
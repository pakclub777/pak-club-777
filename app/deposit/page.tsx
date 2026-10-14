"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function DepositPage() {
  const [amount, setAmount] = useState<number | "">(1000);
  const [trxId, setTrxId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"jazzcash" | "easypaisa">("jazzcash");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  // Image select karne ka handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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

    if (!screenshot) {
      alert("Meharbani karke payment ka screenshot attach karein!");
      return;
    }

    setLoading(true);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Aap logged in nahi hain! Pehle login karein.");
      setLoading(false);
      return;
    }

    // Profile se details fetch karein admin panel sync ke liye
    let currentUsername = user.email || "User";
    let userPhone = user.phone || "";

    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, full_name, phone_number, phone")
      .eq("id", user.id)
      .maybeSingle();

    if (profileData) {
      currentUsername = profileData.username || profileData.full_name || currentUsername;
      userPhone = profileData.phone_number || profileData.phone || userPhone;
    }

    // 1. Upload Screenshot to Supabase Storage Bucket ('screenshots')
    let screenshotPublicUrl = "";
    if (screenshot) {
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("screenshots")
        .upload(fileName, screenshot);

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        alert("Screenshot upload mein masla hua: " + uploadError.message);
        setLoading(false);
        return;
      }

      // Public URL generate karein Admin Panel view ke liye
      const { data: publicUrlData } = supabase.storage
        .from("screenshots")
        .getPublicUrl(fileName);

      screenshotPublicUrl = publicUrlData.publicUrl;
    }

    // 2. Direct Insert into Supabase Table
    const { error } = await supabase.from("deposits").insert([
      {
        user_id: user.id,
        username: currentUsername,
        phone_number: userPhone,
        amount: Number(amount),
        trx_id: trxId.trim(),
        payment_method: paymentMethod,
        screenshot_url: screenshotPublicUrl,
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
        <p className="text-xs text-gray-400 mt-0.5">Paisa bhej kar Transaction ID aur Screenshot attach karein</p>
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
              setScreenshot(null);
              setPreviewUrl(null);
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
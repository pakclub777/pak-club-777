"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ full_name: string; phone: string; balance: number } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, phone, balance")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-4 bg-[#0b0f17] min-h-screen text-white w-full max-w-lg mx-auto font-sans">
      <h1 className="text-xl font-bold text-amber-400 mb-5 flex items-center gap-2">
        <span>👤</span> My Profile
      </h1>

      <div className="bg-[#141c2b] p-5 rounded-2xl border border-gray-800 flex flex-col gap-4 shadow-lg w-full">
        <div className="border-b border-gray-800/80 pb-3">
          <p className="text-xs text-gray-400 mb-1">Full Name</p>
          <p className="text-base font-semibold text-white">
            {profile?.full_name || "Loading..."}
          </p>
        </div>

        <div className="border-b border-gray-800/80 pb-3">
          <p className="text-xs text-gray-400 mb-1">Phone Number</p>
          <p className="text-base font-semibold text-white">
            {profile?.phone || "Loading..."}
          </p>
        </div>

        <div className="bg-[#0b0f17] p-4 rounded-xl border border-amber-500/30 flex justify-between items-center mt-1">
          <div>
            <p className="text-xs text-gray-400">Current Balance</p>
            <p className="text-xl font-black text-amber-400 mt-0.5">
              PKR {profile?.balance !== undefined ? profile.balance.toLocaleString() : "0.00"}
            </p>
          </div>
          <span className="text-2xl">💰</span>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Link
            href="/deposit"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 rounded-xl text-center text-xs transition-colors"
          >
            💳 Deposit
          </Link>
          <Link
            href="/withdraw"
            className="bg-[#0b0f17] hover:bg-gray-900 text-white font-semibold border border-gray-700 py-2.5 rounded-xl text-center text-xs transition-colors"
          >
            💸 Withdraw
          </Link>
        </div>
      </div>
    </div>
  );
}
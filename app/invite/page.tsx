"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ReferredUser {
  id: string;
  full_name: string;
  phone: string;
  created_at?: string;
}

export default function InvitePage() {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<ReferredUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const whatsappChannelLink = "https://whatsapp.com/channel/0029VbDtcX0DZ4LUCm22Gt0Z";

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Referral Link Generate Karein
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        setReferralLink(`${origin}/register?ref=${user.id}`);

        // 2. Un Users Ko Fetch Karein Jinka referred_by Is User Ki ID Se Match Karta Ho
        const { data: referred, error } = await supabase
          .from("profiles")
          .select("id, full_name, phone, created_at")
          .eq("referred_by", user.id);

        if (!error && referred) {
          setInvitedUsers(referred);
        }
      }
      setLoadingUsers(false);
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 bg-[#0b0f17] min-h-screen text-white w-full max-w-lg mx-auto font-sans pb-24">
      <h1 className="text-xl font-bold text-amber-400 mb-5 flex items-center gap-2">
        <span>🎁</span> Friends Ko Invite Karein
      </h1>

      {/* Main Promo Card */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 rounded-2xl p-4 border border-amber-400/40 mb-5 shadow-xl">
        <span className="bg-black/40 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
          Referral Bonus
        </span>
        <h2 className="text-xl font-black text-black mt-2 leading-tight">
          INVITE 5 MEMBERS
        </h2>
        <p className="text-2xl font-black text-white drop-shadow-md">
          GET 5,000 RS BONUS
        </p>
      </div>

      {/* Referral Link Box */}
      <div className="bg-[#141c2b] p-5 rounded-2xl border border-amber-500/30 mb-5 shadow-lg">
        <p className="text-xs text-gray-300 mb-3">
          Apne dosto ko apne referral link se join karwayein aur rewards hasil karein!
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={referralLink || "Loading link..."}
            className="w-full bg-[#0b0f17] border border-gray-700 rounded-xl p-3 text-xs text-amber-400 font-mono focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="bg-amber-500 hover:bg-amber-600 font-bold text-black text-xs px-5 rounded-xl active:scale-95 transition-all flex-shrink-0"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* WhatsApp Channel & Share Buttons */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold pt-1">
          <a
            href={whatsappChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#128c7e]/20 border border-[#128c7e]/50 text-green-400 py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#128c7e]/30 transition-all"
          >
            🟢 WhatsApp Channel
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Join Pak Club 777 and get bonus rewards! " + referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500/20 border border-amber-500/40 text-amber-400 py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-amber-500/30 transition-all"
          >
            📲 Share Link
          </a>
        </div>
      </div>

      {/* Referred Users List */}
      <div className="bg-[#141c2b] p-5 rounded-2xl border border-gray-800 shadow-lg">
        <div className="flex justify-between items-center mb-4 border-b border-gray-800/80 pb-3">
          <h2 className="text-sm font-bold text-amber-400">👥 Joined Users</h2>
          <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold">
            Total: {invitedUsers.length}
          </span>
        </div>

        {loadingUsers ? (
          <p className="text-xs text-gray-400 text-center py-4">Loading members...</p>
        ) : invitedUsers.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            Abhi tak koi user aapke link se join nahi hua.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {invitedUsers.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-[#0b0f17] p-3 rounded-xl border border-gray-800 flex justify-between items-center"
              >
                <div>
                  <p className="text-xs font-bold text-white">
                    {item.full_name || "User"}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {item.phone ? `${item.phone.substring(0, 4)}****${item.phone.slice(-3)}` : "No Phone"}
                  </p>
                </div>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md font-semibold">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface PendingRequest {
  id: string;
  user_id: string;
  amount: number;
  trx_id: string;
  payment_method: string;
  status: string;
  created_at: string;
  user_name?: string;
  user_phone?: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  balance: number;
}

export default function AdminPanel() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Password Lock States
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const ADMIN_PASSWORD = "Pak_games@786";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setErrorMsg("");
      fetchAdminData();
    } else {
      setErrorMsg("Galat Password! Access Denied.");
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);

    // 1. Fetch Users
    const { data: usersData } = await supabase.from("profiles").select("*");
    const userMap: Record<string, UserProfile> = {};
    if (usersData) {
      setUsers(usersData);
      usersData.forEach((u) => {
        userMap[u.id] = u;
      });
    }

    // 2. Fetch Pending Deposits
    const { data: depositsData } = await supabase
      .from("deposits")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (depositsData) {
      const formatted = depositsData.map((d) => ({
        ...d,
        user_name: userMap[d.user_id]?.full_name || "Unknown User",
        user_phone: userMap[d.user_id]?.phone || "N/A",
      }));
      setRequests(formatted);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleApprove = async (req: PendingRequest) => {
    // Current Balance Fetch Karein
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", req.user_id)
      .single();

    const currentBalance = profile?.balance || 0;
    const newBalance = Number(currentBalance) + Number(req.amount);

    // Profile mein Balance Update Karein
    const { error: balanceErr } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", req.user_id);

    if (balanceErr) return alert("Balance error: " + balanceErr.message);

    // Request Status Approved Karein
    const { error: reqErr } = await supabase
      .from("deposits")
      .update({ status: "approved" })
      .eq("id", req.id);

    if (reqErr) return alert("Status error: " + reqErr.message);

    alert(`✅ PKR ${req.amount} successfully added to ${req.user_name}'s account!`);
    fetchAdminData();
  };

  // 🔒 Password Prompt Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-white flex items-center justify-center p-4 font-sans select-none">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-[#141c2b] border border-gray-800 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl text-center"
        >
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            🔒
          </div>
          <div>
            <h2 className="text-base font-black text-amber-400 uppercase tracking-wider">
              Admin Authorization
            </h2>
            <p className="text-[11px] text-gray-400 mt-1">
              Admin Panel access karne ke liye Secret Password enter karein.
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-950/60 border border-red-800/80 p-2.5 rounded-xl font-semibold">
              {errorMsg}
            </p>
          )}

          <input
            type="password"
            placeholder="Enter Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-[#0b0f17] border border-gray-800 rounded-xl p-3 text-xs text-center text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono tracking-widest"
            autoFocus
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl uppercase tracking-wider transition-all"
          >
            Unlock Control Panel
          </button>
        </form>
      </div>
    );
  }

  // 🔓 Unlocked Admin Panel
  return (
    <div className="p-4 bg-[#0b0f17] min-h-screen text-white max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm font-bold text-amber-400">⚙️ Admin Control Panel</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            className="text-xs bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-700"
          >
            🔄 {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs bg-red-950/60 border border-red-800 text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-900/60"
          >
            🔒 Lock
          </button>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-amber-400 mb-2">
          💳 Pending Deposits ({requests.length})
        </h2>
        {requests.length === 0 ? (
          <p className="text-xs text-gray-400 bg-[#141c2b] p-3 rounded-lg border border-gray-800">
            Koi pending deposit nahi hai.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((req) => (
              <div key={req.id} className="bg-[#141c2b] border border-amber-500/30 p-3 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-white">{req.user_name}</p>
                    <p className="text-[10px] text-gray-400">{req.user_phone}</p>
                  </div>
                  <span className="text-xs font-black text-amber-400">PKR {req.amount}</span>
                </div>
                <div className="text-[11px] font-mono text-gray-300">
                  <p>Method: <span className="text-amber-300 font-bold uppercase">{req.payment_method}</span></p>
                  <p>Trx ID: <span className="text-amber-400 font-bold">{req.trx_id}</span></p>
                </div>
                <button
                  onClick={() => handleApprove(req)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-xs mt-1"
                >
                  ✓ Approve PKR {req.amount}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registered Users */}
      <div>
        <h2 className="text-xs font-bold text-blue-400 mb-2">
          👥 Registered Users ({users.length})
        </h2>
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="bg-[#141c2b] border border-gray-800 p-2.5 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white">{u.full_name || "User"}</p>
                <p className="text-[11px] text-gray-400 font-mono">{u.phone}</p>
              </div>
              <span className="text-xs font-black text-green-400">PKR {u.balance || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
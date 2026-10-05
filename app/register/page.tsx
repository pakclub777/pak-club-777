"use client";
import React, { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferredBy(ref);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileErr } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          full_name: fullName,
          phone: phone,
          balance: 0,
          referred_by: referredBy,
        },
      ]);

      if (profileErr) {
        console.error("Profile Error:", profileErr);
      }

      alert("Account Successful Register Ho Gaya!");
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-[#0b0f17] min-h-screen text-white max-w-md mx-auto font-sans flex flex-col justify-center">
      <form onSubmit={handleRegister} className="bg-[#141c2b] p-6 rounded-2xl border border-gray-800 space-y-4">
        <h1 className="text-lg font-bold text-amber-400 text-center uppercase tracking-wider">
          PAK CLUB 777 Register
        </h1>

        {referredBy && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-center">
            <p className="text-[11px] text-amber-300 font-semibold">
              🎁 You were invited by a friend!
            </p>
          </div>
        )}

        {errorMsg && (
          <p className="text-xs text-red-400 bg-red-950/50 p-2.5 rounded-xl border border-red-800 text-center font-semibold">
            {errorMsg}
          </p>
        )}

        <div>
          <label className="text-[10px] text-gray-400 font-bold block mb-1">FULL NAME</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#0b0f17] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="Enter Full Name"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-400 font-bold block mb-1">PHONE NUMBER</label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#0b0f17] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="03XXXXXXXXX"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-400 font-bold block mb-1">EMAIL ADDRESS</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0b0f17] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="name@gmail.com"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-400 font-bold block mb-1">PASSWORD</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0b0f17] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl uppercase tracking-wider transition-all disabled:opacity-50 mt-2"
        >
          {loading ? "REGISTERING..." : "CREATE ACCOUNT"}
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs text-white">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
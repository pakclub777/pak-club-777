"use client";
import React, { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
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
      localStorage.setItem("pending_ref", ref);
    } else {
      const savedRef = localStorage.getItem("pending_ref");
      if (savedRef) {
        setReferredBy(savedRef);
      }
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const activeRef = referredBy || localStorage.getItem("pending_ref");

    // 1. Signup with user metadata (for Supabase backend triggers)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim(),
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // 2. Direct profiles table upsert (username aur full_name dono save honge)
      const { error: profileErr } = await supabase.from("profiles").upsert([
        {
          id: data.user.id,
          full_name: fullName.trim(),
          username: username.trim(),
          phone: phone.trim(),
          balance: 0,
          referred_by: activeRef || null,
        },
      ]);

      if (profileErr) {
        console.error("Profile Upsert Error:", profileErr);
      }

      // Permanent session flags set karein
      localStorage.setItem("user_logged_in", "true");
      if (data.session) {
        localStorage.setItem("sb-session", JSON.stringify(data.session));
      }
      localStorage.removeItem("pending_ref");

      alert("Account Successfully Created!");
      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-[#0b0f17] min-h-screen text-white max-w-md mx-auto font-sans flex flex-col justify-center">
      <form onSubmit={handleRegister} className="bg-[#141c2b] p-6 rounded-2xl border border-gray-800 space-y-4 shadow-xl">
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
          <label className="text-[10px] text-gray-400 font-bold block mb-1">USERNAME</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#0b0f17] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="Enter Unique Username"
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

        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-400 font-bold hover:underline">
              Login Here
            </Link>
          </p>
        </div>
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
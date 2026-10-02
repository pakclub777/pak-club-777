"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone: phone },
          },
        });
        if (error) throw error;
        alert("Account Successfully Created! Ab Login Karein.");
        setIsSignUp(false);
      } else {
        // Login Flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/"); // Direct Home Dashboard Par Bhejega
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#141c2b] border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
        {/* Branding */}
        <div className="text-center mb-6">
          <span className="text-4xl">👑</span>
          <h1 className="text-2xl font-black text-amber-400 mt-1">PAK CLUB 777</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isSignUp ? "Create a New Account" : "Sign In to Play & Earn"}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-xs p-2.5 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="flex flex-col gap-3 text-xs">
          {isSignUp && (
            <>
              <div>
                <label className="text-gray-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Zain"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0b0f17] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">Phone Number (Easypaisa/JazzCash)</label>
                <input
                  type="text"
                  required
                  placeholder="0311XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0b0f17] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-gray-400 mb-1 block">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0f17] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b0f17] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold py-3 rounded-xl uppercase tracking-wider mt-2 shadow-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : isSignUp ? "Register Now" : "Sign In"}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-5 text-center text-xs text-gray-400">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)} className="text-amber-400 font-bold underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button onClick={() => setIsSignUp(true)} className="text-amber-400 font-bold underline">
                Register
              </button>
            </p>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-[11px] text-gray-500 hover:text-gray-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
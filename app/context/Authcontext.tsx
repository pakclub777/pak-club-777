"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any;
  balance: number;
  fetchBalance: () => Promise<void>;
  updateBalance: (amountChange: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  balance: 0,
  fetchBalance: async () => {},
  updateBalance: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  // Database se balance fetch karne ka function
  const fetchBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (profile) {
        setBalance(profile.balance || 0);
      }
    }
  };

  useEffect(() => {
    fetchBalance();

    // Supabase Real-time Listener (Admin approval par instantly balance update karne ke liye)
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          if (user && payload.new.id === user.id) {
            setBalance(payload.new.balance);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Game Win/Loss par balance add/deduct karne ka logic
  const updateBalance = async (amountChange: number) => {
    if (!user) return false;
    const newBalance = balance + amountChange;

    if (newBalance < 0) {
      alert("Aapka balance kam hai!");
      return false;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", user.id);

    if (error) {
      console.error("Balance update error:", error);
      return false;
    }

    setBalance(newBalance);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, balance, fetchBalance, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
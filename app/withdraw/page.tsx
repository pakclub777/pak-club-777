'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WithdrawPage() {
  const [amount, setAmount] = useState<string>('5000');
  const [accountType, setAccountType] = useState<'Easypaisa' | 'JazzCash'>('Easypaisa');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (profile) {
      setBalance(Number(profile.balance) || 0);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // 1. Check Invited Members / Referrals Count from 'profiles' table
    const { count: referralCount, error: refError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', user.id);

    const totalInvites = referralCount || 0;

    // 2. Minimum 3 Members Requirement Check
    if (totalInvites < 3) {
      const errorMsg = `Withdrawal unlock karne ke liye pehle kam se kam 3 members ko invite karein. Aapke abhi total ${totalInvites}/3 members hain.`;
      alert(errorMsg);
      setMessage(errorMsg);
      setLoading(false);
      return;
    }

    const numAmount = Number(amount);

    if (numAmount < 5000) {
      setMessage('Minimum withdrawal limit Rs. 5,000 hai.');
      setLoading(false);
      return;
    }

    if (balance < numAmount) {
      setMessage('Aapke wallet mein itna balance nahi hai!');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('withdrawal_requests').insert([
      {
        user_id: user.id,
        amount: numAmount,
        account_type: accountType,
        account_number: accountNumber,
        account_title: accountTitle,
        status: 'pending',
      },
    ]);

    if (error) {
      setMessage('Withdrawal request bhejne mein error aaya. Dobara koshish karein.');
    } else {
      alert('Withdrawal Request Bhej Di Gayi Hai! Admin review ke baad paise bhej dega.');
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] bg-[#0c0f17] text-white p-3 max-w-md mx-auto flex flex-col justify-between overflow-y-auto select-none font-sans">
      <div>
        {/* Header Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <Link href="/" className="text-gray-400 text-sm font-bold flex items-center gap-1">
            ← Back
          </Link>
          <h1 className="font-black text-sm text-amber-400 uppercase tracking-wider">
            Withdraw Funds
          </h1>
          <button 
            onClick={() => router.push('/records')}
            className="text-[10px] bg-[#182030] border border-gray-800 px-2.5 py-1 rounded-full text-gray-300 font-bold"
          >
            History
          </button>
        </div>

        {/* Balance Card */}
        <div className="mt-3 bg-[#141a26] border border-gray-800/80 p-3 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Available Balance</p>
            <p className="text-lg font-black text-amber-400">Rs. {balance.toFixed(2)}</p>
          </div>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
        </div>

        {/* Error / Success Message */}
        {message && (
          <div className="mt-3 p-2.5 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-400 font-semibold text-center">
            {message}
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleWithdraw} className="mt-4 space-y-3">
          {/* Payment Method Selector */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">
              Select Withdrawal Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('Easypaisa')}
                className={`p-2.5 rounded-xl border flex items-center justify-center font-bold text-xs transition-all ${
                  accountType === 'Easypaisa'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                    : 'bg-[#141a26] border-gray-800 text-gray-400'
                }`}
              >
                EasyPaisa Payout
              </button>
              <button
                type="button"
                onClick={() => setAccountType('JazzCash')}
                className={`p-2.5 rounded-xl border flex items-center justify-center font-bold text-xs transition-all ${
                  accountType === 'JazzCash'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                    : 'bg-[#141a26] border-gray-800 text-gray-400'
                }`}
              >
                JazzCash Payout
              </button>
            </div>
          </div>

          {/* Account Title Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter Full Name"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-semibold"
            />
          </div>

          {/* Account Number Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
              Account / Mobile Number
            </label>
            <input
              type="text"
              required
              placeholder="03XXXXXXXXX"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-semibold"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
              Withdrawal Amount (Rs.)
            </label>
            <input
              type="number"
              required
              min="5000"
              placeholder="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-2.5 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[9px] text-gray-500 font-semibold mt-1">
              Minimum payout threshold is Rs. 5,000
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-black text-black text-xs rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'SUBMITTING...' : 'SUBMIT WITHDRAWAL'}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[9px] text-gray-600 font-bold py-2 border-t border-gray-800/40">
        SAFE & SECURE PAYOUTS
      </div>
    </div>
  );
}
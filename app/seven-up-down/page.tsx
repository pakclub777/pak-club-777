'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SevenUpDown() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [selectedBet, setSelectedBet] = useState<'down' | 'seven' | 'up' | null>(null);
  const [diceSum, setDiceSum] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUserId(user.id);
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
    if (profile) setBalance(Number(profile.balance || 0));
  };

  const rollDice = async () => {
    if (!selectedBet) { setMessage('⚠️ Pehle 7 Down, Exact 7, ya 7 Up select karein!'); return; }
    if (balance < betAmount) { setMessage('❌ Insufficient Balance!'); return; }

    setMessage('');
    setIsPlaying(true);

    const newBal = balance - betAmount;
    setBalance(newBal);
    await supabase.from('profiles').update({ balance: newBal }).eq('id', userId);

    setTimeout(async () => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      setDiceSum(sum);

      let winningCategory = '';
      if (sum < 7) winningCategory = 'down';
      else if (sum === 7) winningCategory = 'seven';
      else winningCategory = 'up';

      if (selectedBet === winningCategory) {
        const winMultiplier = winningCategory === 'seven' ? 5 : 2;
        const winAmount = betAmount * winMultiplier;
        const updatedBal = newBal + winAmount;
        setBalance(updatedBal);
        await supabase.from('profiles').update({ balance: updatedBal }).eq('id', userId);
        setMessage(`🎉 WON PKR ${winAmount}! Dice Total was ${sum}`);
      } else {
        setMessage(`❌ Dice Total was ${sum}. Better luck next time!`);
      }
      setIsPlaying(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '20px auto', padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px', textAlign: 'center' }}>
      <button onClick={() => router.push('/')} style={{ float: 'left', background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
        ← Dashboard
      </button>
      <div style={{ clear: 'both' }}></div>

      <h2 style={{ color: '#f43f5e', marginTop: '10px' }}>🎲 7 Up 7 Down</h2>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>Balance: PKR {balance.toFixed(2)}</p>

      <div style={{ width: '100px', height: '100px', background: '#fff', color: '#000', fontSize: '42px', fontWeight: 'bold', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px auto' }}>
        {diceSum || '?'}
      </div>

      {message && <p style={{ padding: '10px', background: '#334155', borderRadius: '8px', fontWeight: 'bold' }}>{message}</p>}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setSelectedBet('down')} style={{ flex: 1, padding: '12px', background: selectedBet === 'down' ? '#f43f5e' : '#1e293b', color: '#fff', border: '1px solid #f43f5e', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          7 Down (2-6)<br/>2x
        </button>
        <button onClick={() => setSelectedBet('seven')} style={{ flex: 1, padding: '12px', background: selectedBet === 'seven' ? '#f59e0b' : '#1e293b', color: '#fff', border: '1px solid #f59e0b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Lucky 7<br/>5x
        </button>
        <button onClick={() => setSelectedBet('up')} style={{ flex: 1, padding: '12px', background: selectedBet === 'up' ? '#38bdf8' : '#1e293b', color: '#fff', border: '1px solid #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          7 Up (8-12)<br/>2x
        </button>
      </div>

      <button onClick={rollDice} disabled={isPlaying} style={{ width: '100%', padding: '14px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
        {isPlaying ? 'Rolling...' : 'ROLL DICE'}
      </button>
    </div>
  );
}
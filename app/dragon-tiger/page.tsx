'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const CARDS = [
  { name: 'A', value: 1 }, { name: '2', value: 2 }, { name: '3', value: 3 },
  { name: '4', value: 4 }, { name: '5', value: 5 }, { name: '6', value: 6 },
  { name: '7', value: 7 }, { name: '8', value: 8 }, { name: '9', value: 9 },
  { name: '10', value: 10 }, { name: 'J', value: 11 }, { name: 'Q', value: 12 }, { name: 'K', value: 13 }
];

export default function DragonTigerGame() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [selectedSide, setSelectedSide] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  
  const [dragonCard, setDragonCard] = useState<any>(null);
  const [tigerCard, setTigerCard] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
    if (profile) setBalance(Number(profile.balance || 0));
  };

  const startGame = async () => {
    if (!selectedSide) {
      alert('Pehle Dragon, Tiger ya Tie select karein!');
      return;
    }
    if (balance < betAmount) {
      alert('Aapke paas kafi balance nahi hai!');
      return;
    }

    setIsPlaying(true);
    setResultMessage('');
    setDragonCard(null);
    setTigerCard(null);

    // Balance deduct karein
    const newBalAfterBet = balance - betAmount;
    setBalance(newBalAfterBet);
    await supabase.from('profiles').update({ balance: newBalAfterBet }).eq('id', userId);

    // Card Draw Animation Simulation
    setTimeout(async () => {
      const dCard = CARDS[Math.floor(Math.random() * CARDS.length)];
      const tCard = CARDS[Math.floor(Math.random() * CARDS.length)];

      setDragonCard(dCard);
      setTigerCard(tCard);

      let winner = '';
      if (dCard.value > tCard.value) winner = 'dragon';
      else if (tCard.value > dCard.value) winner = 'tiger';
      else winner = 'tie';

      let winAmount = 0;
      if (selectedSide === winner) {
        if (winner === 'tie') winAmount = betAmount * 9;
        else winAmount = betAmount * 2;

        const updatedBal = newBalAfterBet + winAmount;
        setBalance(updatedBal);
        await supabase.from('profiles').update({ balance: updatedBal }).eq('id', userId);
        setResultMessage(`🎉 Aap Jeet Gaye! PKR ${winAmount} add ho gaye.`);
      } else {
        setResultMessage(`❌ Aap Haar Gaye! Winner: ${winner.toUpperCase()}`);
      }

      setIsPlaying(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px', textAlign: 'center' }}>
      <button onClick={() => router.push('/')} style={{ float: 'left', background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
        ← Dashboard
      </button>
      <div style={{ clear: 'both' }}></div>

      <h2 style={{ color: '#f59e0b', marginTop: '10px' }}>🐉 Dragon VS Tiger 🐅</h2>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>Wallet Balance: PKR {balance.toFixed(2)}</p>

      {/* Arena Display */}
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 0', background: '#1e293b', padding: '20px', borderRadius: '10px' }}>
        {/* Dragon Side */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#ef4444' }}>DRAGON</h3>
          <div style={{ width: '80px', height: '110px', background: '#fff', color: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '10px auto' }}>
            {dragonCard ? dragonCard.name : '?'}
          </div>
        </div>

        <div style={{ alignSelf: 'center', fontSize: '20px', fontWeight: 'bold', color: '#94a3b8' }}>VS</div>

        {/* Tiger Side */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#38bdf8' }}>TIGER</h3>
          <div style={{ width: '80px', height: '110px', background: '#fff', color: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '10px auto' }}>
            {tigerCard ? tigerCard.name : '?'}
          </div>
        </div>
      </div>

      {resultMessage && (
        <p style={{ padding: '12px', background: '#334155', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          {resultMessage}
        </p>
      )}

      {/* Bet Selection */}
      <p style={{ marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Kisse Par Bet Lagani Hai?</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setSelectedSide('dragon')} 
          style={{ flex: 1, padding: '12px', background: selectedSide === 'dragon' ? '#ef4444' : '#1e293b', color: '#fff', border: '2px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Dragon (2x)
        </button>
        <button 
          onClick={() => setSelectedSide('tie')} 
          style={{ padding: '12px 18px', background: selectedSide === 'tie' ? '#10b981' : '#1e293b', color: '#fff', border: '2px solid #10b981', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Tie (9x)
        </button>
        <button 
          onClick={() => setSelectedSide('tiger')} 
          style={{ flex: 1, padding: '12px', background: selectedSide === 'tiger' ? '#38bdf8' : '#1e293b', color: '#fff', border: '2px solid #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Tiger (2x)
        </button>
      </div>

      {/* Amount Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>Bet Amount (PKR):</label>
        {[50, 100, 500, 1000].map((amt) => (
          <button 
            key={amt} 
            onClick={() => setBetAmount(amt)}
            style={{ margin: '0 4px', padding: '6px 12px', background: betAmount === amt ? '#f59e0b' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {amt}
          </button>
        ))}
      </div>

      <button 
        onClick={startGame} 
        disabled={isPlaying} 
        style={{ width: '100%', padding: '14px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
        {isPlaying ? 'Cards Shuffling...' : 'BET NOW'}
      </button>
    </div>
  );
}
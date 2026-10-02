'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function MinesGame() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [grid, setGrid] = useState<string[]>(Array(12).fill('hidden'));
  const [mines, setMines] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gemsFound, setGemsFound] = useState(0);
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

  const startGame = async () => {
    if (balance < betAmount) { setMessage('❌ Insufficient Balance!'); return; }
    
    // Random 3 mines places
    const mineIndexes: number[] = [];
    while (mineIndexes.length < 3) {
      const r = Math.floor(Math.random() * 12);
      if (!mineIndexes.includes(r)) mineIndexes.push(r);
    }

    setMines(mineIndexes);
    setGrid(Array(12).fill('hidden'));
    setGemsFound(0);
    setMessage('');
    setIsPlaying(true);

    const newBal = balance - betAmount;
    setBalance(newBal);
    await supabase.from('profiles').update({ balance: newBal }).eq('id', userId);
  };

  const revealTile = (index: number) => {
    if (!isPlaying || grid[index] !== 'hidden') return;

    if (mines.includes(index)) {
      const newGrid = [...grid];
      newGrid[index] = 'bomb';
      setGrid(newGrid);
      setIsPlaying(false);
      setMessage('💥 BOOM! Mine hit, bet lost!');
    } else {
      const newGrid = [...grid];
      newGrid[index] = 'gem';
      setGrid(newGrid);
      setGemsFound((prev) => prev + 1);
    }
  };

  const cashOut = async () => {
    if (gemsFound === 0) return;
    setIsPlaying(false);
    const winMultiplier = 1 + gemsFound * 0.4;
    const winAmount = +(betAmount * winMultiplier).toFixed(2);
    
    const updatedBal = balance + winAmount;
    setBalance(updatedBal);
    await supabase.from('profiles').update({ balance: updatedBal }).eq('id', userId);
    setMessage(`🎉 Cashout! Won PKR ${winAmount} (${winMultiplier.toFixed(1)}x)`);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '20px auto', padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px', textAlign: 'center' }}>
      <button onClick={() => router.push('/')} style={{ float: 'left', background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
        ← Dashboard
      </button>
      <div style={{ clear: 'both' }}></div>

      <h2 style={{ color: '#fb923c', marginTop: '10px' }}>💣 Mines Game</h2>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>Balance: PKR {balance.toFixed(2)}</p>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '20px 0' }}>
        {grid.map((tile, idx) => (
          <button 
            key={idx} 
            onClick={() => revealTile(idx)} 
            disabled={!isPlaying || tile !== 'hidden'}
            style={{ height: '70px', background: tile === 'gem' ? '#10b981' : tile === 'bomb' ? '#ef4444' : '#1e293b', border: '2px solid #334155', borderRadius: '8px', fontSize: '24px', cursor: isPlaying ? 'pointer' : 'default' }}
          >
            {tile === 'gem' ? '💎' : tile === 'bomb' ? '💣' : ''}
          </button>
        ))}
      </div>

      {message && <p style={{ padding: '10px', background: '#334155', borderRadius: '8px', fontWeight: 'bold' }}>{message}</p>}

      {!isPlaying ? (
        <div>
          <div style={{ marginBottom: '15px' }}>
            {[50, 100, 500].map((amt) => (
              <button key={amt} onClick={() => setBetAmount(amt)} style={{ margin: '0 4px', padding: '6px 12px', background: betAmount === amt ? '#fb923c' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {amt} PKR
              </button>
            ))}
          </div>
          <button onClick={startGame} style={{ width: '100%', padding: '14px', background: '#fb923c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            START MINES
          </button>
        </div>
      ) : (
        <button onClick={cashOut} disabled={gemsFound === 0} style={{ width: '100%', padding: '14px', background: gemsFound > 0 ? '#10b981' : '#64748b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
          CASHOUT (PKR {(betAmount * (1 + gemsFound * 0.4)).toFixed(2)})
        </button>
      )}
    </div>
  );
}
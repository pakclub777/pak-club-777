'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>Pak Club 777 Loading Ho Raha Hai...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px', minHeight: '90vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#f59e0b' }}>🎰 Pak Club 777</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>User: {profile?.full_name || 'Player'}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
          Logout
        </button>
      </div>

      {/* Wallet Balance Card */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', color: '#fff', padding: '20px', borderRadius: '12px', marginTop: '20px', textAlign: 'center', border: '1px solid #475569' }}>
        <p style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', color: '#cbd5e1' }}>Wallet Balance</p>
        <h1 style={{ margin: '10px 0', fontSize: '36px', color: '#10b981' }}>PKR {Number(profile?.balance || 0).toFixed(2)}</h1>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
          <button onClick={() => router.push('/deposit')} style={{ flex: 1, padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Deposit
          </button>
          <button onClick={() => router.push('/withdraw')} style={{ flex: 1, padding: '10px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            - Withdraw
          </button>
        </div>
      </div>

      {/* Hot Games Section */}
      <h3 style={{ marginTop: '25px', color: '#f1f5f9' }}>🔥 Hot Betting Games</h3>
      
      {/* Featured Big Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' }}>
        
        {/* Dragon VS Tiger */}
        <div 
          onClick={() => router.push('/dragon-tiger')} 
          style={{ background: 'linear-gradient(135deg, #7f1d1d, #0c4a6e)', border: '2px solid #f59e0b', padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center' }}
        >
          <h2 style={{ margin: '0 0 4px 0', color: '#fef08a' }}>🐉 Dragon VS Tiger 🐅</h2>
          <p style={{ fontSize: '12px', color: '#e2e8f0', margin: 0 }}>Classic Card Betting Game</p>
        </div>

        {/* Aviator Game */}
        <div 
          onClick={() => router.push('/aviator')} 
          style={{ background: 'linear-gradient(135deg, #881337, #4c1d95)', border: '2px solid #ec4899', padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center' }}
        >
          <h2 style={{ margin: '0 0 4px 0', color: '#f472b6' }}>🚀 Aviator</h2>
          <p style={{ fontSize: '12px', color: '#e2e8f0', margin: 0 }}>Fly High & Cashout Before Crash!</p>
        </div>

      </div>

      {/* Grid Games */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        
        {/* Ludo Betting */}
        <div 
          onClick={() => router.push('/ludo')} 
          style={{ background: '#1e293b', border: '1px solid #334155', padding: '15px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}
        >
          <h3 style={{ margin: '0 0 5px 0', color: '#38bdf8' }}>🎲 Ludo Betting</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Dice Roll & Win</p>
        </div>

        {/* Mines */}
        <div 
          onClick={() => router.push('/mines')} 
          style={{ background: '#1e293b', border: '1px solid #334155', padding: '15px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}
        >
          <h3 style={{ margin: '0 0 5px 0', color: '#fb923c' }}>💣 Mines</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Find Diamonds</p>
        </div>
        
        {/* Color Prediction */}
        <div 
          onClick={() => router.push('/color')} 
          style={{ background: '#1e293b', border: '1px solid #334155', padding: '15px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}
        >
          <h3 style={{ margin: '0 0 5px 0', color: '#4ade80' }}>🎨 Color Prediction</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Red vs Green</p>
        </div>

        {/* 7 Up 7 Down */}
        <div 
          onClick={() => router.push('/seven-up-down')} 
          style={{ background: '#1e293b', border: '1px solid #334155', padding: '15px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}
        >
          <h3 style={{ margin: '0 0 5px 0', color: '#f43f5e' }}>🎲 7 Up 7 Down</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>High vs Low Dice</p>
        </div>

        {/* Roulette / Wheel Spin */}
        <div 
          onClick={() => router.push('/roulette')} 
          style={{ background: '#1e293b', border: '1px solid #334155', padding: '15px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}
        >
          <h3 style={{ margin: '0 0 5px 0', color: '#a855f7' }}>🎡 Wheel Spin</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Lucky Spin</p>
        </div>

      </div>
    </div>
  );
}
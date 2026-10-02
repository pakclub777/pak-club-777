'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('JazzCash');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // Check balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (!profile || Number(profile.balance) < Number(amount)) {
      setMessage('Aapke wallet mein itna balance nahi hai!');
      setLoading(false);
      return;
    }

    if (Number(amount) < 300) {
      setMessage('Kam az kam 300 PKR ka withdrawal ho sakta hai.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('withdrawal_requests').insert([
      {
        user_id: user.id,
        amount: Number(amount),
        account_type: accountType,
        account_number: accountNumber,
        account_title: accountTitle,
        status: 'pending',
      },
    ]);

    if (error) {
      setMessage('Withdrawal request bhejne mein error aaya.');
    } else {
      alert('Withdrawal Request Bhej Di Gayi Hai! Admin review ke baad paise bhej dega.');
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '30px auto', padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px' }}>
      <button onClick={() => router.push('/')} style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px' }}>
        ← Back to Dashboard
      </button>

      <h2 style={{ color: '#f59e0b', textAlign: 'center', marginBottom: '20px' }}>💸 Withdraw Cash</h2>

      {message && <p style={{ background: '#742a2a', color: '#fc8181', padding: '10px', borderRadius: '6px', fontSize: '14px' }}>{message}</p>}

      <form onSubmit={handleWithdraw}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px' }}>Account Type:</label>
          <select value={accountType} onChange={(e) => setAccountType(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}>
            <option value="JazzCash">JazzCash</option>
            <option value="Easypaisa">Easypaisa</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px' }}>Amount (Min PKR 300):</label>
          <input type="number" required min="300" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="300" style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px' }}>Account Title (Name):</label>
          <input type="text" required value={accountTitle} onChange={(e) => setAccountTitle(e.target.value)} placeholder="e.g. Ali Raza" style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px' }}>Mobile Account Number:</label>
          <input type="text" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="03XXXXXXXXX" style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? 'Submitting...' : 'Request Withdrawal'}
        </button>
      </form>
    </div>
  );
}
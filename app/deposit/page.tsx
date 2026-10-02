'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('JazzCash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    if (Number(amount) < 300) {
      setMessage('Kam az kam 300 PKR ka deposit ho sakta hai.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('deposit_requests').insert([
      {
        user_id: user.id,
        amount: Number(amount),
        payment_method: paymentMethod,
        sender_number: senderNumber,
        trx_id: trxId,
        status: 'pending',
      },
    ]);

    if (error) {
      setMessage('Galti: TRX ID pehle se istemal ho chuki hai ya error hai.');
    } else {
      alert('Deposit Request Bhej Di Gayi Hai! Admin verification ke baad balance add ho jayega.');
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '30px auto', padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px' }}>
      <button onClick={() => router.push('/')} style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px' }}>
        ← Back to Dashboard
      </button>

      <h2 style={{ color: '#10b981', textAlign: 'center', marginBottom: '20px' }}>💳 Deposit Balance</h2>

      {/* Admin Payment Details Box */}
      <div style={{ background: '#1e293b', border: '1px solid #f59e0b', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#f59e0b', fontWeight: 'bold' }}>
          🔴 JazzCash Deposit Account
        </p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><b>Account Title:</b> Muhammad Abdullah</p>
        <p style={{ margin: '4px 0', fontSize: '18px', color: '#38bdf8', fontWeight: 'bold' }}><b>JazzCash Number:</b> 03019292354</p>
        
        <small style={{ color: '#94a3b8', display: 'block', marginTop: '10px' }}>
          * Is JazzCash number par paise bhej kar TRX ID neeche enter karein.
        </small>
      </div>

      {message && <p style={{ background: '#742a2a', color: '#fc8181', padding: '10px', borderRadius: '6px', fontSize: '14px' }}>{message}</p>}

      <form onSubmit={handleDeposit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px' }}>Payment Method:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}>
            <option value="JazzCash">JazzCash</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px' }}>Amount (Min PKR 300):</label>
          <input type="number" required min="300" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="300" style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px' }}>Aapka Sender Mobile Number:</label>
          <input type="text" required value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} placeholder="03XXXXXXXXX" style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px' }}>Transaction ID (TRX ID / TID):</label>
          <input type="text" required value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="e.g. 2139485038" style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? 'Submitting...' : 'Submit Deposit Request'}
        </button>
      </form>
    </div>
  );
}
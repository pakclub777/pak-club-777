'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPanel() {
  const [depositRequests, setDepositRequests] = useState<any[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);

    // Fetch Pending Deposits
    const { data: deposits } = await supabase
      .from('deposit_requests')
      .select('*, profiles(full_name, phone)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (deposits) setDepositRequests(deposits);

    // Fetch Pending Withdrawals
    const { data: withdrawals } = await supabase
      .from('withdrawal_requests')
      .select('*, profiles(full_name, phone)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (withdrawals) setWithdrawRequests(withdrawals);

    setLoading(false);
  };

  // Deposit Approve
  const handleApproveDeposit = async (requestId: string, userId: string, amount: number) => {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    const currentBalance = Number(userProfile?.balance || 0);
    const newBalance = currentBalance + Number(amount);

    await supabase.from('profiles').update({ balance: newBalance }).eq('id', userId);
    await supabase.from('deposit_requests').update({ status: 'approved' }).eq('id', requestId);

    alert('Deposit Approved! Balance Added.');
    fetchRequests();
  };

  // Withdraw Approve (Balance already deducted or to be marked done)
  const handleApproveWithdraw = async (requestId: string, userId: string, amount: number) => {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    const currentBalance = Number(userProfile?.balance || 0);

    if (currentBalance < amount) {
      alert('User ke paas itna balance nahi hai!');
      return;
    }

    // Deduct balance from user
    await supabase.from('profiles').update({ balance: currentBalance - Number(amount) }).eq('id', userId);
    await supabase.from('withdrawal_requests').update({ status: 'approved' }).eq('id', requestId);

    alert('Withdrawal Approved! Balance deducted from user.');
    fetchRequests();
  };

  if (loading) return <p style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>Admin Panel Loading...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px' }}>
      <h2 style={{ color: '#f59e0b', textAlign: 'center', marginBottom: '25px' }}>⚙️ Admin Control Panel</h2>

      {/* --- DEPOSIT SECTION --- */}
      <h3 style={{ color: '#10b981', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>💳 Pending Deposits</h3>
      {depositRequests.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Koi pending deposit nahi hai.</p>
      ) : (
        depositRequests.map((req) => (
          <div key={req.id} style={{ background: '#1e293b', border: '1px solid #334155', padding: '15px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '2px 0', fontWeight: 'bold', color: '#10b981', fontSize: '18px' }}>PKR {req.amount}</p>
              <p style={{ margin: '2px 0', fontSize: '13px' }}><b>User:</b> {req.profiles?.full_name || 'N/A'}</p>
              <p style={{ margin: '2px 0', fontSize: '13px' }}><b>Sender No:</b> {req.sender_number}</p>
              <p style={{ margin: '2px 0', fontSize: '13px' }}><b>Method:</b> {req.payment_method}</p>
              <p style={{ margin: '2px 0', fontSize: '13px', color: '#f59e0b' }}><b>TRX ID:</b> {req.trx_id}</p>
            </div>
            <button onClick={() => handleApproveDeposit(req.id, req.user_id, req.amount)} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Approve Deposit
            </button>
          </div>
        ))
      )}

      {/* --- WITHDRAWAL SECTION --- */}
      <h3 style={{ color: '#ef4444', borderBottom: '1px solid #334155', paddingBottom: '8px', marginTop: '30px' }}>💸 Pending Withdrawals</h3>
      {withdrawRequests.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Koi pending withdrawal nahi hai.</p>
      ) : (
        withdrawRequests.map((req) => (
          <div key={req.id} style={{ background: '#1e293b', border: '1px solid #334155', padding: '15px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '2px 0', fontWeight: 'bold', color: '#ef4444', fontSize: '18px' }}>PKR {req.amount}</p>
              <p style={{ margin: '2px 0', fontSize: '13px' }}><b>User Name:</b> {req.account_title}</p>
              <p style={{ margin: '2px 0', fontSize: '13px' }}><b>Account No:</b> {req.account_number}</p>
              <p style={{ margin: '2px 0', fontSize: '13px' }}><b>Type:</b> {req.account_type}</p>
            </div>
            <button onClick={() => handleApproveWithdraw(req.id, req.user_id, req.amount)} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Approve & Send
            </button>
          </div>
        ))
      )}
    </div>
  );
}
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        alert('Pak Club 777 Account Ban Gaya! Ab Login Karein.');
        setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '25px', background: '#1a202c', color: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
      <h2 style={{ textAlign: 'center', color: '#f6ad55', fontSize: '28px', marginBottom: '20px' }}>
        🎰 Pak Club 777
      </h2>
      <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isSignUp ? 'Naya Account Banayein' : 'Account Login Karein'}
      </h4>

      {error && <p style={{ color: '#fc8181', background: '#742a2a', padding: '8px', borderRadius: '4px', fontSize: '14px' }}>{error}</p>}

      <form onSubmit={handleAuth}>
        {isSignUp && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px' }}>Full Name:</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: 'none', background: '#2d3748', color: '#fff' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px' }}>Phone Number (Easypaisa/JazzCash):</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: 'none', background: '#2d3748', color: '#fff' }} />
            </div>
          </>
        )}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px' }}>Email Address:</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: 'none', background: '#2d3748', color: '#fff' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px' }}>Password:</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: 'none', background: '#2d3748', color: '#fff' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#d69e2e', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? 'Processing...' : isSignUp ? 'Register Now' : 'Login'}
        </button>
      </form>

      <button onClick={() => setIsSignUp(!isSignUp)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#63b3ed', cursor: 'pointer', width: '100%', textAlign: 'center' }}>
        {isSignUp ? 'Pehle se account hai? Login karein' : "Account nahi hai? Sign Up karein"}
      </button>
    </div>
  );
}
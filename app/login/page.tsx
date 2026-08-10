'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="app-shell" style={{ justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 28, fontWeight: 900 }}>
          מטב<span style={{ color: 'var(--blob-eat)' }}>גיל</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>
          תפריט, קניות ולו״ז — כל מה שצריך במקום אחד
        </div>
      </div>

      {sent ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>נשלח קישור לאימייל שלך</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
            לחצי על הקישור ב-{email} כדי להיכנס
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>אימייל</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="את@דוגמה.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px solid var(--border)',
              fontFamily: 'Heebo, sans-serif',
              fontSize: 14,
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
          />
          {error && <div style={{ fontSize: 12, color: '#c0392b', marginBottom: 12 }}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'שולחת...' : 'שלחי קישור כניסה'}
          </button>
        </form>
      )}
    </div>
  );
}

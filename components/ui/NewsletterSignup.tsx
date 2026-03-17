'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
    setMessage(res.ok ? "You're subscribed. Check your inbox for the confirmation email." : "Could not subscribe right now. Please try again in a moment.");
    if (res.ok) setEmail('');
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h3 className="text-lg font-semibold">Get FinanceSphere updates</h3>
      <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <button className="btn-primary" type="submit">Subscribe</button>
      {message && <p className="alert-success">{message}</p>}
    </form>
  );
}

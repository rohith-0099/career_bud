import { useState } from 'react';
import { useCareerStore } from '../store/careerStore';
import { api } from '../services/api';

export default function Summary() {
  const { careers } = useCareerStore();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const top3 = careers.slice(0, 3);

  const send = async () => {
    setSending(true);
    try {
      await api.post('/api/email', { email, careers: top3 });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-4">Your top career paths</h2>
      <ul className="space-y-3 mb-8">
        {top3.map((c, i) => (
          <li key={i} className="border border-neutral-800 rounded-lg p-4">
            <div className="font-medium">{c.title}</div>
            <div className="text-neutral-400 text-sm">{c.summary}</div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 items-center">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800 flex-1" />
        <button onClick={send} disabled={!email || sending} className="px-4 py-2 rounded-md bg-white text-black disabled:opacity-50">
          {sending ? 'Sending...' : 'Email me the report'}
        </button>
      </div>
      {sent && <p className="text-green-400 mt-3 text-sm">Sent! Check your inbox.</p>}
    </section>
  );
}



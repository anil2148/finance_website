import { useState } from 'react';
import { useFinanceAI } from '../hooks/useFinanceAI';

export default function FinanceCopilot() {
  const [prompt, setPrompt] = useState('');
  const { loading, response, error, ask } = useFinanceAI();

  const handleSubmit = (event) => {
    event.preventDefault();
    ask(prompt);
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Finance Copilot</h1>
        <p style={styles.subtitle}>Ask about SIPs, stocks, mutual funds, and smarter money decisions.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: Should I increase my SIP when markets are volatile?"
            rows={4}
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

        {error ? <p style={styles.error}>{error}</p> : null}

        {response ? (
          <article style={styles.card}>
            <h2 style={styles.cardTitle}>AI Response</h2>
            <p style={styles.cardText}>{response}</p>
          </article>
        ) : null}
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem 1rem',
    backgroundColor: '#f8fafc',
    minHeight: 'calc(100vh - 72px)',
  },
  container: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
  },
  title: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  subtitle: {
    marginTop: '0.5rem',
    marginBottom: '1rem',
    color: '#475569',
  },
  form: {
    display: 'grid',
    gap: '0.75rem',
  },
  input: {
    width: '100%',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    padding: '0.75rem 0.9rem',
    outline: 'none',
    fontSize: '0.95rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  button: {
    justifySelf: 'start',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontWeight: 600,
    padding: '0.65rem 1.15rem',
    cursor: 'pointer',
  },
  error: {
    marginTop: '1rem',
    color: '#dc2626',
    fontWeight: 500,
  },
  card: {
    marginTop: '1.25rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    background: '#f8fafc',
    padding: '1rem',
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#0f172a',
  },
  cardText: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    color: '#1e293b',
    lineHeight: 1.6,
  },
};

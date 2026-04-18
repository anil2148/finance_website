import { useState } from 'react';
import { askAI } from '../api/financeAI';

export function useFinanceAI(defaultPersona = 'financial_advisor') {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const ask = async (prompt) => {
    const normalizedPrompt = prompt?.trim();

    if (!normalizedPrompt) {
      setError('Please enter a finance question.');
      setResponse('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const answer = await askAI(normalizedPrompt, defaultPersona);
      setResponse(answer);
    } catch (err) {
      setResponse('');
      setError(err?.message || 'Something went wrong while asking AI.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    response,
    error,
    ask,
  };
}

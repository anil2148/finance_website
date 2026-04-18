const FINANCE_AI_BASE_URL = 'https://interviewai-jvmk.onrender.com';

/**
 * Ask the Finance AI backend for an answer.
 * @param {string} prompt
 * @param {string} [persona='financial_advisor']
 * @returns {Promise<string>}
 */
export async function askAI(prompt, persona = 'financial_advisor') {
  try {
    const response = await fetch(`${FINANCE_AI_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, persona }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `AI request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data?.answer ?? '';
  } catch (error) {
    throw new Error(error?.message || 'Unable to get AI response right now.');
  }
}

export { FINANCE_AI_BASE_URL };

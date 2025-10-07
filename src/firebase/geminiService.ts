export const generateAIResponse = async (prompt: string) => {
  const WORKER_URL = import.meta.env.VITE_WORKER_URL;
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.error);
      return;
    }

    return data.text;
  } catch (err) {
    console.error('Fetch error:', err);
  }
};

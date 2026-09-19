/**
 * Centralized API client for Sparring.
 * Interacts only with our Express backend.
 * Zero Gemini keys are exposed to the client.
 */

const API_BASE = '/api';

export async function sendDebateTurn(payload) {
  try {
    const res = await fetch(`${API_BASE}/debate-turn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Sparring couldn't respond. Check your connection and try again.",
        code: data.code || 'UNKNOWN_ERROR',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: "Sparring couldn't respond. Check your connection and try again.",
      code: 'NETWORK_ERROR',
    };
  }
}

export async function generateFeedback(payload) {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Could not generate feedback report. Please try again.",
        code: data.code || 'UNKNOWN_ERROR',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: "Network error occurred while analyzing the debate transcript.",
      code: 'NETWORK_ERROR',
    };
  }
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return data?.status === 'ok';
  } catch {
    return false;
  }
}

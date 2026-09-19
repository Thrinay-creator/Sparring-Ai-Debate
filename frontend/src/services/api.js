/**
 * Centralized API client for Sparring.
 * Interacts only with our Express backend.
 * Zero Gemini keys are exposed to the client.
 */

const rawApiUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');
const API_BASE = rawApiUrl ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`) : '/api';

export async function sendDebateTurn(payload) {
  try {
    const res = await fetch(`${API_BASE}/debate-turn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: `Server error (${res.status} ${res.statusText || 'Non-JSON response'})` };
    }

    if (!res.ok) {
      return {
        success: false,
        error: data.message || `Backend error: HTTP ${res.status}`,
        code: data.code || `HTTP_${res.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err?.message?.includes('Failed to fetch')
        ? "Unable to reach the backend server. Please verify your connection or server status."
        : (err?.message || "Sparring couldn't respond. Check your connection and try again."),
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

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: `Server error (${res.status} ${res.statusText || 'Non-JSON response'})` };
    }

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Could not generate feedback report. Please try again.",
        code: data.code || `HTTP_${res.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err?.message || "Network error occurred while analyzing the debate transcript.",
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

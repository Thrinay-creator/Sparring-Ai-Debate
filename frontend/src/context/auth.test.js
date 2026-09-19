import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { supabase } from '../services/supabase';

describe('Supabase Auth Flow & Validation Tests', () => {
  beforeAll(() => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear()
    };
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('handles email/password signup and stores full_name metadata', async () => {
    const res = await supabase.auth.signUp({
      email: 'alex.debater@example.com',
      password: 'password123',
      options: {
        data: { full_name: 'Alex Debater' }
      }
    });

    expect(res.error).toBeNull();
    expect(res.data.user).toBeDefined();
    expect(res.data.user.email).toBe('alex.debater@example.com');
    expect(res.data.user.user_metadata.full_name).toBe('Alex Debater');
  });

  it('rejects signup with invalid email or short password', async () => {
    const invalidEmailRes = await supabase.auth.signUp({
      email: 'invalid-email',
      password: 'validpassword'
    });
    expect(invalidEmailRes.error).toBeDefined();
    expect(invalidEmailRes.error.message).toContain('valid email');

    const shortPassRes = await supabase.auth.signUp({
      email: 'valid@example.com',
      password: '123'
    });
    expect(shortPassRes.error).toBeDefined();
    expect(shortPassRes.error.message).toContain('at least 6 characters');
  });

  it('signs in with password and sets active session', async () => {
    const loginRes = await supabase.auth.signInWithPassword({
      email: 'sarah.orator@example.com',
      password: 'securePassword456'
    });

    expect(loginRes.error).toBeNull();
    expect(loginRes.data.user).toBeDefined();
    expect(loginRes.data.user.email).toBe('sarah.orator@example.com');

    // Verify session retrieval
    const sessionRes = await supabase.auth.getSession();
    expect(sessionRes.data.session?.user?.email).toBe('sarah.orator@example.com');
  });

  it('initiates password reset request for email', async () => {
    const resetRes = await supabase.auth.resetPasswordForEmail('reset.me@example.com');
    expect(resetRes.error).toBeNull();
  });

  it('updates password during recovery session', async () => {
    // Log in user first
    await supabase.auth.signInWithPassword({
      email: 'user.update@example.com',
      password: 'oldPassword123'
    });

    const updateRes = await supabase.auth.updateUser({
      password: 'newPassword789'
    });

    expect(updateRes.error).toBeNull();
    expect(updateRes.data.user).toBeDefined();
  });

  it('signs out and clears active session', async () => {
    await supabase.auth.signInWithPassword({
      email: 'logout.user@example.com',
      password: 'password123'
    });

    await supabase.auth.signOut();
    const sessionRes = await supabase.auth.getSession();
    expect(sessionRes.data.session).toBeNull();
  });
});

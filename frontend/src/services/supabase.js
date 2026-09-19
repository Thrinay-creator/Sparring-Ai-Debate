import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const isRealConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Safe environment logging without exposing secrets
console.info('[Sparring Supabase Config]', {
  'Supabase URL configured': isRealConfigured ? 'YES' : 'NO',
  'Supabase key configured': isRealConfigured ? 'YES' : 'NO',
  'Supabase mode': isRealConfigured ? 'REAL' : 'MOCK'
});

const isProduction = import.meta.env.PROD;

/**
 * Local Development Mock client for offline/local prototyping before live Supabase keys are configured.
 * Strictly prohibited in production per specification.
 */
class LocalSupabaseDevMock {
  constructor() {
    this.storagePrefix = 'sparring_mock_';
    this.listeners = new Set();
    this.recoveryMode = false;
    console.info(
      '%c[Sparring Auth]%c Running in Development Mock Mode (offline/local simulation). Provide VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in frontend/.env to connect to live Supabase.',
      'background: #d97706; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;',
      'color: #d97706; font-style: italic;'
    );
  }

  _getStoredUser() {
    try {
      const raw = localStorage.getItem(`${this.storagePrefix}auth_user`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  _setStoredUser(user) {
    if (user) {
      localStorage.setItem(`${this.storagePrefix}auth_user`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`${this.storagePrefix}auth_user`);
    }
    this.listeners.forEach((fn) => fn(user ? 'SIGNED_IN' : 'SIGNED_OUT', { user }));
  }

  _getMockDebates() {
    try {
      const raw = localStorage.getItem(`${this.storagePrefix}debates`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  _setMockDebates(debates) {
    localStorage.setItem(`${this.storagePrefix}debates`, JSON.stringify(debates));
  }

  get auth() {
    return {
      getSession: async () => {
        const user = this._getStoredUser();
        return { data: { session: user ? { user } : null }, error: null };
      },
      getUser: async () => {
        const user = this._getStoredUser();
        return { data: { user }, error: null };
      },
      signInWithPassword: async ({ email, password }) => {
        if (!email || !email.includes('@')) {
          return { data: { user: null }, error: new Error('Please enter a valid email address.') };
        }
        if (!password || password.length < 6) {
          return { data: { user: null }, error: new Error('Password must be at least 6 characters.') };
        }
        const user = {
          id: 'mock_user_' + btoa(email.toLowerCase()).replace(/=/g, '').substring(0, 12),
          email: email.trim().toLowerCase(),
          user_metadata: { full_name: email.split('@')[0] },
          last_sign_in_at: new Date().toISOString()
        };
        this._setStoredUser(user);
        return { data: { user, session: { user } }, error: null };
      },
      signUp: async ({ email, password, options }) => {
        if (!email || !email.includes('@')) {
          return { data: { user: null }, error: new Error('Please enter a valid email address.') };
        }
        if (!password || password.length < 6) {
          return { data: { user: null }, error: new Error('Password must be at least 6 characters.') };
        }
        const fullName = options?.data?.full_name || email.split('@')[0];
        const user = {
          id: 'mock_user_' + btoa(email.toLowerCase()).replace(/=/g, '').substring(0, 12),
          email: email.trim().toLowerCase(),
          user_metadata: { full_name: fullName },
          created_at: new Date().toISOString()
        };
        this._setStoredUser(user);
        return { data: { user, session: { user } }, error: null };
      },
      resetPasswordForEmail: async (email) => {
        if (!email || !email.includes('@')) {
          return { data: null, error: new Error('Please provide a valid email address.') };
        }
        // Mark recovery active in mock
        this.recoveryMode = true;
        return { data: {}, error: null };
      },
      updateUser: async ({ password }) => {
        const user = this._getStoredUser();
        if (!user) {
          return { data: null, error: new Error('No user is currently authenticated to update.') };
        }
        if (!password || password.length < 6) {
          return { data: null, error: new Error('New password must be at least 6 characters.') };
        }
        user.updated_at = new Date().toISOString();
        this._setStoredUser(user);
        this.recoveryMode = false;
        return { data: { user }, error: null };
      },
      signOut: async () => {
        this._setStoredUser(null);
        return { error: null };
      },
      onAuthStateChange: (callback) => {
        this.listeners.add(callback);
        const currentUser = this._getStoredUser();
        callback('INITIAL_SESSION', currentUser ? { user: currentUser } : null);
        return {
          data: {
            subscription: {
              unsubscribe: () => this.listeners.delete(callback)
            }
          }
        };
      }
    };
  }

  from(table) {
    if (table !== 'debates') {
      throw new Error(`Mock table ${table} not supported.`);
    }

    const self = this;
    const currentUser = this._getStoredUser();

    return {
      select: (columns = '*') => {
        return {
          order: (column, { ascending = false } = {}) => {
            // Enforce mock RLS: only return debates where user_id matches authenticated user
            if (!currentUser) {
              return Promise.resolve({ data: [], error: null });
            }
            const all = self._getMockDebates();
            const userDebates = all.filter((d) => d.user_id === currentUser.id);
            userDebates.sort((a, b) => {
              const tA = new Date(a[column] || 0).getTime();
              const tB = new Date(b[column] || 0).getTime();
              return ascending ? tA - tB : tB - tA;
            });
            return Promise.resolve({ data: userDebates, error: null });
          },
          eq: (field, value) => {
            if (!currentUser) return Promise.resolve({ data: [], error: null });
            const all = self._getMockDebates();
            const filtered = all.filter((d) => d.user_id === currentUser.id && d[field] === value);
            return Promise.resolve({ data: filtered, error: null });
          }
        };
      },
      insert: (records) => {
        if (!currentUser) {
          return Promise.resolve({ data: null, error: new Error('RLS check failed: User not authenticated.') });
        }
        const insertList = Array.isArray(records) ? records : [records];
        const all = self._getMockDebates();
        const created = [];

        for (const record of insertList) {
          // Enforce RLS check
          if (record.user_id !== currentUser.id) {
            return Promise.resolve({ data: null, error: new Error('RLS check failed: Cannot insert record for another user.') });
          }
          // Enforce UNIQUE(user_id, session_id)
          const isDuplicate = all.some(
            (d) => d.user_id === record.user_id && d.session_id === record.session_id
          );
          if (isDuplicate) {
            const dupErr = new Error('duplicate key value violates unique constraint "unique_user_session"');
            dupErr.code = '23505';
            return Promise.resolve({ data: null, error: dupErr });
          }

          const newRow = {
            id: 'deb_' + Math.random().toString(36).substring(2, 10),
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            ...record
          };
          all.unshift(newRow);
          created.push(newRow);
        }

        self._setMockDebates(all);
        return Promise.resolve({ data: created, error: null });
      },
      delete: () => {
        return {
          eq: (field, value) => {
            if (!currentUser) {
              return Promise.resolve({ data: null, error: new Error('RLS check failed: User not authenticated.') });
            }
            const all = self._getMockDebates();
            // Delete matching record belonging only to current user (RLS policy simulation)
            const remaining = all.filter((d) => !(d.user_id === currentUser.id && d[field] === value));
            self._setMockDebates(remaining);
            return Promise.resolve({ data: null, error: null });
          }
        };
      }
    };
  }
}

const isTest = Boolean(import.meta.env.MODE === 'test' || (typeof process !== 'undefined' && process.env?.VITEST));

// Client Export
let supabaseInstance;

if (isTest) {
  supabaseInstance = new LocalSupabaseDevMock();
} else if (isRealConfigured) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else if (!isProduction) {
  supabaseInstance = new LocalSupabaseDevMock();
} else {
  // In production, missing credentials must produce an explicit error
  supabaseInstance = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: new Error('Supabase configuration missing in production.') }),
      getUser: async () => ({ data: { user: null }, error: new Error('Supabase configuration missing in production.') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase configuration missing in production.') }),
      signUp: async () => ({ data: null, error: new Error('Supabase configuration missing in production.') }),
      resetPasswordForEmail: async () => ({ data: null, error: new Error('Supabase configuration missing in production.') }),
      updateUser: async () => ({ data: null, error: new Error('Supabase configuration missing in production.') }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (cb) => {
        cb('INITIAL_SESSION', null);
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: () => {
      throw new Error('Supabase database configuration missing in production.');
    }
  };
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = isRealConfigured;
export const isMockModeActive = !isRealConfigured && !isProduction;

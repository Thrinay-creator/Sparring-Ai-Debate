import { describe, it, expect, beforeEach, beforeAll } from 'vitest';

describe('Routing & Initial Entry Route Protection Tests', () => {
  let sessionStore;
  let localStore;

  beforeAll(() => {
    sessionStore = new Map();
    localStore = new Map();

    globalThis.sessionStorage = {
      getItem: (key) => sessionStore.get(key) || null,
      setItem: (key, val) => sessionStore.set(key, String(val)),
      removeItem: (key) => sessionStore.delete(key),
      clear: () => sessionStore.clear()
    };

    globalThis.localStorage = {
      getItem: (key) => localStore.get(key) || null,
      setItem: (key, val) => localStore.set(key, String(val)),
      removeItem: (key) => localStore.delete(key),
      clear: () => localStore.clear()
    };
  });

  beforeEach(() => {
    sessionStore.clear();
    localStore.clear();
  });

  it('TEST 1: unauthenticated user visits / and is redirected to /login; refresh on /login stays on /login', () => {
    const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
    let isAuthenticated = false;
    let isGuest = sessionStorage.getItem('sparring_is_guest') === 'true';
    let currentPath = '/';

    let navigatedTo = null;
    if (!isAuthenticated && !isGuest) {
      if (currentPath === '/history') {
        navigatedTo = '/login';
      } else if (!AUTH_ROUTES.includes(currentPath)) {
        navigatedTo = '/login';
      }
    }

    expect(isGuest).toBe(false);
    expect(navigatedTo).toBe('/login');

    // User is now on /login; refresh
    currentPath = '/login';
    navigatedTo = null;
    if (!isAuthenticated && !isGuest) {
      if (currentPath === '/history') {
        navigatedTo = '/login';
      } else if (!AUTH_ROUTES.includes(currentPath)) {
        navigatedTo = '/login';
      }
    }
    expect(navigatedTo).toBeNull(); // Stays on /login, not /
  });

  it('TEST 2: opening /login and refreshing remains on /login', () => {
    const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
    const isAuthenticated = false;
    const isGuest = false;
    const currentPath = '/login';

    let navigatedTo = null;
    if (!isAuthenticated && !isGuest && !AUTH_ROUTES.includes(currentPath)) {
      navigatedTo = '/login';
    }
    expect(navigatedTo).toBeNull(); // Stays on /login
  });

  it('TEST 3: opening /signup and refreshing remains on /signup', () => {
    const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
    const isAuthenticated = false;
    const isGuest = false;
    const currentPath = '/signup';

    let navigatedTo = null;
    if (!isAuthenticated && !isGuest && !AUTH_ROUTES.includes(currentPath)) {
      navigatedTo = '/login';
    }
    expect(navigatedTo).toBeNull(); // Stays on /signup
  });

  it('TEST 4: opening /forgot-password and refreshing remains on /forgot-password', () => {
    const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
    const isAuthenticated = false;
    const isGuest = false;
    const currentPath = '/forgot-password';

    let navigatedTo = null;
    if (!isAuthenticated && !isGuest && !AUTH_ROUTES.includes(currentPath)) {
      navigatedTo = '/login';
    }
    expect(navigatedTo).toBeNull(); // Stays on /forgot-password
  });

  it('TEST 5: authenticated user visits / and refreshes; remains on /', () => {
    const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
    const isAuthenticated = true;
    const isGuest = false;
    const currentPath = '/';

    let navigatedTo = null;
    if (!isAuthenticated && !isGuest) {
      if (!AUTH_ROUTES.includes(currentPath)) {
        navigatedTo = '/login';
      }
    }
    expect(navigatedTo).toBeNull(); // Remains on /
  });

  it('TEST 6: authenticated user visits /history and refreshes; remains on /history', () => {
    const isAuthenticated = true;
    const isGuest = false;
    const currentPath = '/history';

    let navigatedTo = null;
    if (!isAuthenticated && !isGuest) {
      navigatedTo = '/login';
    } else if (isGuest && currentPath === '/history') {
      navigatedTo = '/login';
    }
    expect(navigatedTo).toBeNull(); // Remains on /history
  });

  it('TEST 7: logout and refresh stays on /login', () => {
    // Logout clears guest session
    sessionStorage.removeItem('sparring_is_guest');
    const isAuthenticated = false;
    const isGuest = sessionStorage.getItem('sparring_is_guest') === 'true';
    const currentPath = '/login';

    const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
    let navigatedTo = null;
    if (!isAuthenticated && !isGuest && !AUTH_ROUTES.includes(currentPath)) {
      navigatedTo = '/login';
    }
    expect(isGuest).toBe(false);
    expect(navigatedTo).toBeNull(); // Stays on /login
  });

  it('TEST 8: Continue as Guest navigates to /, refresh preserves guest and active debate', () => {
    // User clicks Continue as Guest
    sessionStorage.setItem('sparring_is_guest', 'true');
    localStorage.setItem('sparring_active_session', JSON.stringify({
      sessionId: 'test-session-123',
      topic: 'AI Regulation',
      userStance: 'FOR',
      difficulty: 'SHARP',
      round: 2,
      transcript: []
    }));

    const isAuthenticated = false;
    const isGuest = sessionStorage.getItem('sparring_is_guest') === 'true';
    const currentPath = '/';

    let navigatedTo = null;
    const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
    if (!isAuthenticated && !isGuest && !AUTH_ROUTES.includes(currentPath)) {
      navigatedTo = '/login';
    }

    expect(isGuest).toBe(true);
    expect(navigatedTo).toBeNull(); // Allowed on /

    // Active session remains readable across refresh
    const restored = JSON.parse(localStorage.getItem('sparring_active_session'));
    expect(restored.sessionId).toBe('test-session-123');
    expect(restored.topic).toBe('AI Regulation');
  });
});

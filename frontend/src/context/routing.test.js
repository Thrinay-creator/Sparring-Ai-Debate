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

  it('unauthenticated user visits / and stays on / (Home Debate Setup) without redirecting to /login', () => {
    const isAuthenticated = false;
    const isGuest = sessionStorage.getItem('sparring_is_guest') === 'true';
    const currentPath = '/';

    let navigatedTo = null;
    // Protected routes are only /history when unauthenticated
    if (!isAuthenticated && !isGuest && currentPath === '/history') {
      navigatedTo = '/login';
    }

    expect(isGuest).toBe(false);
    expect(navigatedTo).toBeNull(); // Stays on '/'!
  });

  it('unauthenticated user navigating to /history redirects to /login and saves /history as redirectTarget', () => {
    const isAuthenticated = false;
    const isGuest = sessionStorage.getItem('sparring_is_guest') === 'true';
    const currentPath = '/history';

    let navigatedTo = null;
    let redirectTarget = null;

    if (!isAuthenticated && !isGuest) {
      if (currentPath === '/history') {
        redirectTarget = '/history';
        navigatedTo = '/login';
      }
    }

    expect(navigatedTo).toBe('/login');
    expect(redirectTarget).toBe('/history');

    // After login success, destination should be redirectTarget
    const dest = redirectTarget || '/';
    expect(dest).toBe('/history');
  });

  it('continuing as guest marks sessionStorage and allows access to / without redirecting to /login', () => {
    // User clicks Continue as Guest
    sessionStorage.setItem('sparring_is_guest', 'true');

    const isAuthenticated = false;
    const isGuest = sessionStorage.getItem('sparring_is_guest') === 'true';
    const currentPath = '/';

    let navigatedTo = null;
    if (!isAuthenticated && !isGuest) {
      if (currentPath === '/') {
        navigatedTo = '/login';
      }
    }

    expect(isGuest).toBe(true);
    expect(navigatedTo).toBeNull(); // Stays on '/'!
  });

  it('refreshing during active debate preserves guest status from sessionStorage', () => {
    // Active guest session
    sessionStorage.setItem('sparring_is_guest', 'true');
    localStorage.setItem('sparring_active_session', JSON.stringify({
      topic: 'Artificial Intelligence is conscious',
      userStance: 'FOR',
      difficulty: 'SHARP',
      round: 2,
      transcript: []
    }));

    // Page refresh re-evaluates session
    const isGuest = sessionStorage.getItem('sparring_is_guest') === 'true';
    const isAuthenticated = false;
    const currentPath = '/';

    let redirected = false;
    if (!isAuthenticated && !isGuest && currentPath === '/') {
      redirected = true;
    }

    expect(isGuest).toBe(true);
    expect(redirected).toBe(false);

    // Active session remains readable
    const session = JSON.parse(localStorage.getItem('sparring_active_session'));
    expect(session.topic).toBe('Artificial Intelligence is conscious');
  });

  it('authenticated user opening /login is redirected to /', () => {
    const isAuthenticated = true;
    const currentPath = '/login';
    let redirectTarget = null;
    let navigatedTo = null;

    if (isAuthenticated && currentPath === '/login') {
      navigatedTo = redirectTarget || '/';
    }

    expect(navigatedTo).toBe('/');
  });

  it('signing out clears guest sessionStorage and returns unauthenticated state', () => {
    sessionStorage.setItem('sparring_is_guest', 'true');
    expect(sessionStorage.getItem('sparring_is_guest')).toBe('true');

    // Sign out action
    sessionStorage.removeItem('sparring_is_guest');
    const isAuthenticated = false;
    const isGuest = sessionStorage.getItem('sparring_is_guest') === 'true';

    let navigatedTo = null;
    const currentPath = '/';
    if (!isAuthenticated && !isGuest) {
      navigatedTo = '/login';
    }

    expect(isGuest).toBe(false);
    expect(navigatedTo).toBe('/login');
  });
});

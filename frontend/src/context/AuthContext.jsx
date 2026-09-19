import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isMockModeActive } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading' | 'authenticated' | 'guest'
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [error, setError] = useState(null);

  const getIsGuest = useCallback(() => {
    try {
      if (typeof window === 'undefined') return false;
      return localStorage.getItem('sparring_is_guest') === 'true' ||
             sessionStorage.getItem('sparring_is_guest') === 'true';
    } catch {
      return false;
    }
  }, []);

  const setIsGuest = useCallback((val) => {
    try {
      if (typeof window === 'undefined') return;
      if (val) {
        localStorage.setItem('sparring_is_guest', 'true');
        sessionStorage.setItem('sparring_is_guest', 'true');
      } else {
        localStorage.removeItem('sparring_is_guest');
        sessionStorage.removeItem('sparring_is_guest');
      }
    } catch {}
  }, []);

  // Initialize session and attach listener
  useEffect(() => {
    let mounted = true;
    let subscription = null;

    // Check for password recovery hash in URL e.g. #type=recovery
    if (window.location.hash && window.location.hash.includes('type=recovery')) {
      setIsPasswordRecovery(true);
    }

    async function initAuth() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (mounted) {
          if (session?.user) {
            setIsGuest(false);
            setCurrentUser(session.user);
            setAuthStatus('authenticated');
          } else {
            const isGuestSession = getIsGuest();
            setCurrentUser(null);
            setAuthStatus(isGuestSession ? 'guest' : 'unauthenticated');
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Session init warning:', err?.message || err);
        if (mounted) {
          const isGuestSession = getIsGuest();
          setCurrentUser(null);
          setAuthStatus(isGuestSession ? 'guest' : 'unauthenticated');
        }
      }

      if (mounted) {
        // Register onAuthStateChange after getSession check
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (!mounted) return;

          console.log(`[AuthContext] Auth event: ${event}`);

          if (event === 'PASSWORD_RECOVERY') {
            setIsPasswordRecovery(true);
          }

          if (session?.user) {
            setIsGuest(false);
            setCurrentUser(session.user);
            setAuthStatus('authenticated');
          } else {
            const isGuestSession = getIsGuest();
            setCurrentUser(null);
            setAuthStatus(isGuestSession ? 'guest' : 'unauthenticated');
          }
        });
        subscription = data?.subscription;
      }
    }

    initAuth();

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [getIsGuest, setIsGuest]);

  // Email / Password Login
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (loginError) {
        const msg = loginError.message.includes('Invalid login credentials')
          ? 'Incorrect email or password.'
          : loginError.message;
        setError(msg);
        return { success: false, error: msg };
      }

      setCurrentUser(data.user);
      setAuthStatus('authenticated');
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your connection.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Email / Password Signup with full_name metadata
  const signup = useCallback(async (email, password, fullName = '') => {
    setError(null);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim() || email.split('@')[0]
          }
        }
      });

      if (signupError) {
        setError(signupError.message || 'Could not create account.');
        return { success: false, error: signupError.message };
      }

      // If user requires email confirmation
      if (data.user && !data.session) {
        return {
          success: true,
          user: data.user,
          needsConfirmation: true,
          message: 'Account created! Please check your email to confirm your account.'
        };
      }

      setCurrentUser(data.user);
      setAuthStatus('authenticated');
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || 'Signup failed. Please check your connection.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Forgot Password: Send reset email
  const sendPasswordReset = useCallback(async (email) => {
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetError) {
        setError(resetError.message || 'Could not send reset link.');
        return { success: false, error: resetError.message };
      }

      return { success: true };
    } catch (err) {
      const msg = err.message || 'Could not send reset link. Check your connection.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Update Password (during recovery)
  const updatePassword = useCallback(async (newPassword) => {
    setError(null);
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        setError(updateError.message || 'Could not update password.');
        return { success: false, error: updateError.message };
      }

      setIsPasswordRecovery(false);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || 'Could not update password.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Continue as Guest explicitly
  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    setCurrentUser(null);
    setAuthStatus('guest');
  }, [setIsGuest]);

  // Sign out
  const signOut = useCallback(async () => {
    setError(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Signout warning:', err?.message);
    } finally {
      setIsGuest(false);
      try {
        sessionStorage.removeItem('sparring_session_unlocked');
      } catch {}
      setCurrentUser(null);
      setAuthStatus('unauthenticated');
      setIsPasswordRecovery(false);
    }
  }, [setIsGuest]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser, // Alias for backwards compatibility
        authStatus,
        authLoading: authStatus === 'loading',
        isAuthenticated: authStatus === 'authenticated',
        isGuest: authStatus === 'guest',
        isPasswordRecovery,
        isMockModeActive,
        error,
        clearError: () => setError(null),
        login,
        signup,
        sendPasswordReset,
        updatePassword,
        continueAsGuest,
        signOut,
        logout: signOut // Alias for backwards compatibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

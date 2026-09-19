import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';
import { LogIn, ArrowLeft, AlertCircle, Sparkles, Mail, Lock } from 'lucide-react';

export default function LoginPage({ onNavigate, onSuccess }) {
  const { login, continueAsGuest, isMockModeActive, error: authError, clearError } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      else onNavigate('/');
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    if (onSuccess) {
      onSuccess();
    } else {
      onNavigate('/');
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 animate-message-in">
      {/* Top back/guest button */}
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={handleContinueAsGuest}
          className="inline-flex items-center gap-1.5 text-xs text-chamber-muted hover:text-chamber-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue as Guest</span>
        </button>
      </div>

      <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-black tracking-tight text-chamber-amber">
            SPARRING
          </h1>
          <h2 className="text-xl font-serif font-bold text-chamber-text">
            Welcome back
          </h2>
          <p className="text-xs text-chamber-muted">
            {t('auth.loginSubtitle')}
          </p>
          {isMockModeActive && (
            <div className="mt-1 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-700/50 text-[11px] text-amber-300">
              ⚡ Local Mock Mode active (no live Supabase keys configured)
            </div>
          )}
        </div>

        {/* Error banner */}
        {displayedError && (
          <div className="flex items-center gap-2 p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs animate-message-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{displayedError}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-chamber-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full pl-9 pr-3 py-2 bg-chamber-surfaceAlt border border-chamber-border rounded-md text-sm text-chamber-text placeholder-chamber-muted focus:outline-none focus:border-chamber-amber"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-[11px] text-chamber-amber hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-chamber-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full pl-9 pr-3 py-2 bg-chamber-surfaceAlt border border-chamber-border rounded-md text-sm text-chamber-text placeholder-chamber-muted focus:outline-none focus:border-chamber-amber"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Signing in...' : t('auth.loginBtn')}</span>
          </button>
        </form>

        {/* Footer switch & guest button */}
        <div className="pt-2 border-t border-chamber-border space-y-3 text-center text-xs">
          <div className="text-chamber-muted">
            <span>{t('auth.noAccount')} </span>
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="text-chamber-amber hover:underline font-semibold"
            >
              {t('auth.createAccount')}
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="text-chamber-muted hover:text-chamber-text text-xs underline"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

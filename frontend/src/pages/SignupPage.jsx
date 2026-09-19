import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';
import { UserPlus, ArrowLeft, AlertCircle, Sparkles, Mail, Lock, User } from 'lucide-react';

export default function SignupPage({ onNavigate, onSuccess }) {
  const { signup, continueAsGuest, isMockModeActive, error: authError, clearError } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState(null);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setConfirmationNotice(null);

    if (!name.trim()) {
      setLocalError('Please enter your name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setLocalError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup(email, password, name);
    setIsSubmitting(false);

    if (res.success) {
      if (res.needsConfirmation) {
        setConfirmationNotice(res.message);
      } else if (onSuccess) {
        onSuccess();
      } else {
        onNavigate('/');
      }
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    onNavigate('/');
  };

  const displayedError = localError || authError;

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 animate-message-in">
      {/* Back to debate chamber button */}
      <button
        type="button"
        onClick={handleContinueAsGuest}
        className="inline-flex items-center gap-1.5 text-xs text-chamber-muted hover:text-chamber-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t('auth.continueGuest')}</span>
      </button>

      <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chamber-surfaceAlt border border-chamber-border text-xs text-chamber-amber">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Sparring</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-chamber-text">
            {t('auth.signupTitle')}
          </h2>
          <p className="text-xs text-chamber-muted">
            {t('auth.signupSubtitle')}
          </p>
          {isMockModeActive && (
            <div className="mt-1 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-700/50 text-[11px] text-amber-300">
              ⚡ Local Mock Mode active (no live Supabase keys configured)
            </div>
          )}
        </div>

        {/* Confirmation notice for email verification */}
        {confirmationNotice && (
          <div className="p-3 rounded bg-amber-950/40 border border-amber-700 text-amber-200 text-xs animate-message-in">
            {confirmationNotice}
          </div>
        )}

        {/* Error banner */}
        {displayedError && (
          <div className="flex items-center gap-2 p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs animate-message-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{displayedError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
              Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-chamber-muted absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Debater Name"
                className="w-full pl-9 pr-3 py-2 bg-chamber-surfaceAlt border border-chamber-border rounded-md text-sm text-chamber-text placeholder-chamber-muted focus:outline-none focus:border-chamber-amber"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
              {t('auth.email')}
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
            <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
              {t('auth.password')}
            </label>
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

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-chamber-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Creating account...' : t('auth.signupBtn')}</span>
          </button>
        </form>

        {/* Footer switch & guest button */}
        <div className="pt-2 border-t border-chamber-border space-y-3 text-center text-xs">
          <div className="text-chamber-muted">
            <span>{t('auth.hasAccount')} </span>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="text-chamber-amber hover:underline font-semibold"
            >
              {t('auth.loginBtn')}
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

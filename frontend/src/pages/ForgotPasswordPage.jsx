import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage({ onNavigate }) {
  const { sendPasswordReset, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await sendPasswordReset(email);
    setIsSubmitting(false);

    if (res.success) {
      setIsSent(true);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 animate-message-in">
      <button
        type="button"
        onClick={() => onNavigate('/login')}
        className="inline-flex items-center gap-1.5 text-xs text-chamber-muted hover:text-chamber-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Login</span>
      </button>

      <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chamber-surfaceAlt border border-chamber-border text-xs text-chamber-amber">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Password Recovery</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-chamber-text">
            Reset Your Password
          </h2>
          <p className="text-xs text-chamber-muted">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {displayedError && (
          <div className="flex items-center gap-2 p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs animate-message-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{displayedError}</span>
          </div>
        )}

        {isSent ? (
          <div className="p-4 rounded-md bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs space-y-3 animate-message-in text-center">
            <div className="flex justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="font-medium text-sm text-emerald-100">Check your email for a password reset link.</p>
            <p className="text-[11px] text-emerald-300">Follow the link inside the email to choose a new password.</p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="text-chamber-amber hover:underline text-xs font-semibold"
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-chamber-muted absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-chamber-surfaceAlt border border-chamber-border rounded-md text-sm text-chamber-text placeholder-chamber-muted focus:outline-none focus:border-chamber-amber"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 shadow-sm"
            >
              <span>{isSubmitting ? 'Sending link...' : 'Send Reset Link'}</span>
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-chamber-border text-center space-y-2 text-xs">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="text-chamber-muted hover:text-chamber-text"
            >
              Remembered your password? <span className="text-chamber-amber font-semibold">Log In</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-chamber-muted hover:text-chamber-text underline"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

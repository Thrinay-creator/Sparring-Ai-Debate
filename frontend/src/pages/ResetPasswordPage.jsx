import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

export default function ResetPasswordPage({ onNavigate }) {
  const { updatePassword, error: authError, clearError } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!password) {
      setLocalError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await updatePassword(password);
    setIsSubmitting(false);

    if (res.success) {
      setIsUpdated(true);
      setTimeout(() => {
        onNavigate('/');
      }, 2500);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 animate-message-in">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1.5 text-xs text-chamber-muted hover:text-chamber-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Sparring</span>
      </button>

      <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chamber-surfaceAlt border border-chamber-border text-xs text-chamber-amber">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secure Password Update</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-chamber-text">
            Choose New Password
          </h2>
          <p className="text-xs text-chamber-muted">
            Enter your new credentials below to restore full access.
          </p>
        </div>

        {displayedError && (
          <div className="flex items-center gap-2 p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs animate-message-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{displayedError}</span>
          </div>
        )}

        {isUpdated ? (
          <div className="p-4 rounded-md bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs space-y-3 animate-message-in text-center">
            <div className="flex justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="font-medium text-sm text-emerald-100">Password successfully updated!</p>
            <p className="text-[11px] text-emerald-300">Redirecting to your debate chamber in a moment...</p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="text-chamber-amber hover:underline text-xs font-semibold"
              >
                Go to Chamber Now
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-chamber-muted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-chamber-surfaceAlt border border-chamber-border rounded-md text-sm text-chamber-text placeholder-chamber-muted focus:outline-none focus:border-chamber-amber"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-chamber-muted block">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-chamber-muted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-9 pr-3 py-2 bg-chamber-surfaceAlt border border-chamber-border rounded-md text-sm text-chamber-text placeholder-chamber-muted focus:outline-none focus:border-chamber-amber"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 shadow-sm"
            >
              <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

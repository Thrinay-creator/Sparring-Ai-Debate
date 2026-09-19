import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDebates, deleteDebate, deleteAllDebates } from '../services/historyService';
import SummaryPage from './SummaryPage';
import { 
  History, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  AlertTriangle, 
  Swords, 
  Sparkles, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Award,
  Layers
} from 'lucide-react';

export default function HistoryPage({ onNavigate, onOpenSettings }) {
  const { user, isAuthenticated, isGuest } = useAuth();

  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedDebate, setSelectedDebate] = useState(null);

  // Confirmation Modals State
  const [deleteTargetId, setDeleteTargetId] = useState(null); // specific debate ID to delete
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load debates
  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDeleteError(null);

    const res = await getUserDebates(user);
    setLoading(false);

    if (res.success) {
      setDebates(res.debates || []);
    } else {
      setError(res.error || "We couldn't load your debate history.");
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Confirm and delete single debate
  const handleConfirmDeleteOne = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    setDeleteError(null);

    const res = await deleteDebate(user, deleteTargetId);
    setIsDeleting(false);

    if (res.success) {
      setDebates((prev) => prev.filter((d) => (d.id || d.sessionId) !== deleteTargetId));
      setDeleteTargetId(null);
    } else {
      setDeleteError(res.error || "We couldn't delete this debate. Please try again.");
    }
  };

  // Confirm and delete all debates
  const handleConfirmDeleteAll = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    const res = await deleteAllDebates(user);
    setIsDeleting(false);

    if (res.success) {
      setDebates([]);
      setShowDeleteAllModal(false);
    } else {
      setDeleteError(res.error || "We couldn't delete debate history. Please try again.");
    }
  };

  // If viewing a single debate's complete feedback report
  if (selectedDebate) {
    const sessionAdapter = {
      sessionId: selectedDebate.sessionId || selectedDebate.id,
      topic: selectedDebate.topic,
      userStance: selectedDebate.userStance,
      aiStance: selectedDebate.aiStance,
      difficulty: selectedDebate.difficulty,
      transcript: selectedDebate.transcript || [],
      feedback: selectedDebate.feedback || {},
      round: selectedDebate.roundsCompleted || 6,
      createdAt: selectedDebate.createdAt
    };

    return (
      <div className="py-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-4 animate-message-in">
        <div className="flex items-center justify-between pb-2 border-b border-chamber-border">
          <button
            type="button"
            onClick={() => setSelectedDebate(null)}
            className="inline-flex items-center gap-1.5 text-xs text-chamber-muted hover:text-chamber-amber transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Debate History</span>
          </button>
          <span className="text-xs font-mono text-chamber-muted">
            Archived Report
          </span>
        </div>

        <SummaryPage
          session={sessionAdapter}
          onStartNewDebate={() => onNavigate('/')}
          onOpenSettings={onOpenSettings}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-message-in">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-chamber-muted hover:text-chamber-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Chamber</span>
        </button>

        {/* Delete All History Button (Only if 1+ debates exist) */}
        {debates.length > 0 && (
          <button
            type="button"
            onClick={() => setShowDeleteAllModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-300 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All History</span>
          </button>
        )}
      </div>

      {/* Page Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-amber-500/10 border border-chamber-amber/30 text-chamber-amber">
            <History className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-chamber-text">
            Debate History
          </h1>
        </div>
        <p className="text-xs text-chamber-muted">
          Review your completed debate chamber sessions, scored arguments, and analytical reports.
        </p>
      </div>

      {/* Guest Mode Notice */}
      {isGuest && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-chamber-surface border border-chamber-border text-xs">
          <div className="flex items-center gap-2.5 text-chamber-muted">
            <Sparkles className="w-4 h-4 text-chamber-amber shrink-0" />
            <span>You are viewing local guest debates. Create an account to sync your history across devices.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="px-3 py-1.5 rounded bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-xs transition-colors"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="px-3 py-1.5 rounded bg-chamber-surfaceAlt hover:bg-[#202733] border border-chamber-border text-chamber-text text-xs transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Delete Error Notification */}
      {deleteError && (
        <div className="flex items-center gap-2 p-3 rounded bg-red-950/50 border border-red-800 text-red-200 text-xs animate-message-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-chamber-amber animate-spin mx-auto" />
          <p className="text-xs text-chamber-muted">Loading your debates...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="py-12 px-6 rounded-lg bg-red-950/30 border border-red-800 text-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-red-200">{error}</p>
            <p className="text-xs text-red-300/80">Please check your connection or try again.</p>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            className="px-4 py-2 rounded bg-red-900/80 hover:bg-red-800 border border-red-700 text-xs font-semibold text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && debates.length === 0 && (
        <div className="py-16 px-6 rounded-lg bg-chamber-surface border border-chamber-border text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-chamber-surfaceAlt border border-chamber-border flex items-center justify-center mx-auto text-chamber-amber">
            <Swords className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-chamber-text">No debates yet.</h3>
            <p className="text-xs text-chamber-muted max-w-sm mx-auto">
              Complete your first debate and your analytical performance history will appear here.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 rounded-md bg-chamber-amber hover:bg-amber-500 text-[#11141A] font-semibold text-xs shadow transition-colors inline-flex items-center gap-2"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Start a Debate</span>
            </button>
          </div>
        </div>
      )}

      {/* Debate Cards List */}
      {!loading && !error && debates.length > 0 && (
        <div className="space-y-3">
          {debates.map((item) => {
            const debateId = item.id || item.sessionId;
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : 'Recent';

            const scoreDisplay = typeof item.overallScore === 'number' 
              ? `${item.overallScore} / 100`
              : 'Completed';

            return (
              <div
                key={debateId}
                className="p-4 sm:p-5 rounded-lg bg-chamber-surface border border-chamber-border hover:border-slate-600/80 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left side: details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-serif font-semibold text-chamber-text truncate group-hover:text-chamber-amber transition-colors">
                    {item.topic}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-chamber-userBg border border-chamber-userBorder text-chamber-user font-medium">
                      {item.userStance}
                    </span>
                    <span className="text-chamber-muted text-[10px]">vs</span>
                    <span className="px-2 py-0.5 rounded bg-chamber-aiBg border border-chamber-aiBorder text-chamber-ai font-medium">
                      {item.aiStance}
                    </span>
                    <span className="text-chamber-muted">•</span>
                    <span className="text-chamber-amber px-2 py-0.5 rounded bg-chamber-surfaceAlt border border-chamber-border text-[11px]">
                      {item.difficulty}
                    </span>
                    <span className="text-chamber-muted">•</span>
                    <span className="text-chamber-muted flex items-center gap-1 text-[11px]">
                      <Layers className="w-3 h-3" />
                      {item.roundsCompleted || 1} {item.roundsCompleted === 1 ? 'round' : 'rounds'}
                    </span>
                    <span className="text-chamber-muted">•</span>
                    <span className="text-chamber-muted flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>
                </div>

                {/* Right side: Score & Action buttons */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-chamber-border/60">
                  {/* Score pill */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-chamber-surfaceAlt border border-chamber-border text-xs font-mono text-chamber-amber font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{scoreDisplay}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDebate(item)}
                      className="px-3 py-1.5 rounded bg-chamber-amber hover:bg-amber-500 text-[#11141A] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      title="View complete debate transcript and scorecard"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(debateId)}
                      className="p-1.5 rounded bg-chamber-surfaceAlt hover:bg-red-950/60 hover:text-red-300 hover:border-red-800 border border-chamber-border text-chamber-muted transition-colors"
                      title="Delete this debate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal: Delete One Debate */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-message-in">
          <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-red-950/60 border border-red-800 text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-chamber-text">Delete this debate?</h4>
                <p className="text-xs text-chamber-muted leading-relaxed">
                  This action cannot be undone. The debate transcript and argument feedback report will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-chamber-border">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTargetId(null)}
                className="px-3 py-1.5 rounded bg-chamber-surfaceAlt hover:bg-[#202733] border border-chamber-border text-xs text-chamber-muted hover:text-chamber-text transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeleteOne}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete All Debates */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-message-in">
          <div className="bg-chamber-surface border border-chamber-border rounded-lg p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-red-950/60 border border-red-800 text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-chamber-text">Delete all debate history?</h4>
                <p className="text-xs text-chamber-muted leading-relaxed">
                  This will permanently delete all your saved debates ({debates.length} records). This action cannot be reversed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-chamber-border">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteAllModal(false)}
                className="px-3.5 py-2 rounded bg-chamber-surfaceAlt hover:bg-[#202733] border border-chamber-border text-xs text-chamber-muted hover:text-chamber-text transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeleteAll}
                className="px-3.5 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              >
                {isDeleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                <span>{isDeleting ? 'Deleting All...' : 'Delete All'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

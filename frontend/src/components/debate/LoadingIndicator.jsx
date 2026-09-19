import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingIndicator({ label = "Sparring is thinking..." }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-[#161B22] border border-chamber-border/80 text-chamber-muted w-fit animate-message-in">
      <Loader2 className="w-4 h-4 text-chamber-amber animate-spin" />
      <span className="text-xs font-medium tracking-wide text-chamber-text">
        {label}
      </span>
    </div>
  );
}

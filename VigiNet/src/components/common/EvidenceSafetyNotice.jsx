import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function EvidenceSafetyNotice() {
  return (
    <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 shadow-sm">
      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        <strong className="text-amber-300">Safety First:</strong> Stay safe. Never enter a dangerous area or floodwater just to capture evidence.
      </span>
    </div>
  );
}

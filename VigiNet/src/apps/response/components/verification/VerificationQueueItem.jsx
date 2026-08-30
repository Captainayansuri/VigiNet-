import React from 'react';
import StatusBadge from '../StatusBadge';

const tierAccent = {
  1: 'border-l-red-500 bg-red-950/25',
  2: 'border-l-red-500/70 bg-red-950/15',
  3: 'border-l-amber-400 bg-amber-950/10',
  4: 'border-l-cyan-500/60 bg-cyan-950/10',
  5: 'border-l-slate-600 bg-slate-900/40'
};

export default function VerificationQueueItem({ incident, priority, selected, onSelect }) {
  const confidence = parseInt(incident.assessment.confidence, 10) || 0;
  return (
    <button
      type="button"
      onClick={() => onSelect(incident.id)}
      aria-pressed={selected}
      className={`w-full border-l-4 px-3 py-3 text-left transition ${tierAccent[priority.tier]} ${
        selected ? 'ring-1 ring-cyan-400/60' : 'hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold text-cyan-300">{incident.id}</p>
          <p className="mt-0.5 truncate text-xs font-bold text-slate-100">● {incident.type}</p>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">{incident.location.area}</p>
        </div>
        <StatusBadge value={incident.priority} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-400">
        <span>{incident.reports.count} reports</span>
        <span>{incident.evidence.count} evidence items</span>
        <span>Confidence: <b className="text-purple-300">{incident.assessment.confidence}</b></span>
        <span className="text-slate-500">{incident.timestamps.reportedAt}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <StatusBadge value={incident.status} />
        <span className="text-[10px] font-bold text-cyan-300">REVIEW →</span>
      </div>

      {priority.reasons.length > 0 && (
        <p className="mt-2 text-[9px] font-mono uppercase tracking-wide text-slate-500">
          {priority.reasons.join(' + ')}
        </p>
      )}
    </button>
  );
}

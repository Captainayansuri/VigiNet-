import React from 'react';

const priorityStyle = {
  CRITICAL: { dot: 'bg-red-500 shadow-red-500/70', ring: 'border-red-500/40 bg-red-500/10', label: 'text-red-300' },
  SERIOUS: { dot: 'bg-amber-400 shadow-amber-400/60', ring: 'border-amber-400/30 bg-amber-400/10', label: 'text-amber-300' },
  MODERATE: { dot: 'bg-emerald-400 shadow-emerald-400/50', ring: 'border-emerald-400/30 bg-emerald-400/10', label: 'text-emerald-300' },
  LOW: { dot: 'bg-cyan-400 shadow-cyan-400/50', ring: 'border-cyan-400/30 bg-cyan-400/10', label: 'text-cyan-300' }
};

const isUnverified = status =>
  status === 'VERIFICATION REQUIRED' || status === 'UNDER REVIEW' || status === 'REPORTED' || status === 'UNVERIFIED';

export default function IncidentMarker({ node, selected, onSelect, showReports }) {
  const style = priorityStyle[node.priority] || priorityStyle.LOW;
  const unverified = isUnverified(node.status);
  const critical = node.priority === 'CRITICAL';

  return (
    <button
      type="button"
      onClick={() => onSelect({ kind: 'incident', id: node.id })}
      className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{ left: node.x, top: node.y, zIndex: selected ? 30 : 20 }}
      aria-label={`Incident ${node.id} ${node.type}`}
    >
      {critical && (
        <span className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border ${style.ring}`} />
      )}
      {showReports && (
        <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/40" />
      )}

      <span className="relative flex flex-col items-center">
        <span className={`block rounded-full border-2 border-slate-950 ${critical ? 'h-5 w-5' : 'h-4 w-4'} ${style.dot}`} />
        <span className={`mt-1 whitespace-nowrap rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-mono font-bold ${style.label}`}>
          {node.id}
        </span>
      </span>

      {unverified && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
        </span>
      )}

      {selected && (
        <span className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-300/80" />
      )}

      {showReports && node.reports > 1 && (
        <span className="absolute left-1/2 top-[120%] -translate-x-1/2 whitespace-nowrap rounded bg-slate-950/80 px-1.5 py-0.5 text-[8px] font-mono text-cyan-300">
          {node.reports} REPORTS · SAME AREA
        </span>
      )}
    </button>
  );
}

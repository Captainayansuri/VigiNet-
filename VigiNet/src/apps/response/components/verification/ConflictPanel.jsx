import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { conflictsByIncident } from '../../data/verificationMockData';

export default function ConflictPanel({ incidentId }) {
  const conflicts = conflictsByIncident[incidentId];
  if (!conflicts || conflicts.length === 0) {
    return (
      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <h2 className="font-heading text-sm font-extrabold text-white">INFORMATION CONFLICT</h2>
        <p className="mt-3 text-[11px] text-emerald-300">No contradictions detected between reports.</p>
      </section>
    );
  }
  return (
    <section className="rounded-xl border border-amber-500/40 bg-amber-950/15 p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-300" />
        <h2 className="font-heading text-sm font-extrabold text-amber-200">⚠ INFORMATION CONFLICT</h2>
      </div>
      <div className="mt-3 space-y-3">
        {conflicts.map((c, i) => (
          <div key={i} className="rounded-lg border border-amber-500/30 bg-slate-950/40 p-3">
            <p className="text-[10px] font-mono text-slate-400">REPORT A</p>
            <p className="text-[11px] text-slate-200">“{c.a}”</p>
            <p className="mt-2 text-[10px] font-mono text-slate-400">REPORT B</p>
            <p className="text-[11px] text-slate-200">“{c.b}”</p>
            <p className="mt-2 text-[10px] italic text-amber-300/90">{c.note}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">
              Conflict requires verification
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

import React from 'react';

export default function MapLegend() {
  const rows = [
    { title: 'INCIDENT', items: [['CRITICAL', 'bg-red-500'], ['SERIOUS', 'bg-amber-400'], ['MODERATE', 'bg-emerald-400'], ['LOW', 'bg-cyan-400']] },
    { title: 'REPORT', items: [['UNVERIFIED', 'border border-dashed border-cyan-400']] },
    { title: 'TEAM', items: [['AVAILABLE', 'bg-emerald-400'], ['DEPLOYED', 'bg-cyan-400'], ['EN ROUTE', 'bg-amber-400']] },
    { title: 'EVIDENCE', items: [['PHOTO', 'bg-purple-500'], ['VIDEO', 'bg-purple-500'], ['VOICE', 'bg-purple-500']] },
    { title: 'HAZARD', items: [['ZONE', 'border border-dashed border-red-500/70']] }
  ];
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-3 text-[9px] shadow-lg">
      <h2 className="mb-2 font-heading text-[10px] font-extrabold tracking-wide text-white">LEGEND</h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {rows.map(r => (
          <div key={r.title}>
            <p className="mb-1 font-mono font-bold text-slate-400">{r.title}</p>
            <div className="space-y-0.5">
              {r.items.map(([label, cls]) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-300">
                  <span className={`h-2 w-2 rounded-full ${cls}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

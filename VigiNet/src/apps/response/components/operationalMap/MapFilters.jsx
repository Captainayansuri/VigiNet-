import React from 'react';

const FILTERS = ['ALL', 'CRITICAL', 'SERIOUS', 'UNVERIFIED', 'VERIFIED', 'TEAMS', 'EVIDENCE'];

export default function MapFilters({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FILTERS.map(f => (
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          className={`rounded border px-2 py-1 text-[9px] font-bold tracking-wider transition ${
            active === f
              ? 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300'
              : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

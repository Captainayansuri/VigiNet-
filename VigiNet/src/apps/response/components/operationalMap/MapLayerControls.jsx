import React from 'react';

const LAYERS = [
  ['incidents', 'INCIDENTS'],
  ['reports', 'REPORTS'],
  ['teams', 'RESPONSE TEAMS'],
  ['evidence', 'EVIDENCE'],
  ['hazards', 'HAZARDS']
];

export default function MapLayerControls({ layers, onToggle }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <h2 className="font-heading text-xs font-extrabold tracking-wide text-white">MAP LAYERS</h2>
      <div className="mt-3 space-y-1.5">
        {LAYERS.map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-300">
            <input
              type="checkbox"
              checked={layers[key]}
              onChange={() => onToggle(key)}
              className="h-3.5 w-3.5 accent-cyan-500"
            />
            {label}
          </label>
        ))}
      </div>
    </section>
  );
}

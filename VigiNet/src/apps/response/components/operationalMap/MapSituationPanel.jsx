import React from 'react';

export default function MapSituationPanel() {
  const stats = [
    ['CRITICAL INCIDENTS', 5, 'text-red-300'],
    ['UNVERIFIED', 8, 'text-amber-300'],
    ['ACTIVE TEAMS', 12, 'text-blue-300'],
    ['EVIDENCE NODES', 21, 'text-purple-300'],
    ['AFFECTED ZONES', 4, 'text-cyan-300']
  ];
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <h2 className="font-heading text-xs font-extrabold tracking-wide text-white">OPERATIONAL SITUATION</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {stats.map(([label, value, tone]) => (
          <div key={label} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2.5">
            <p className="font-heading text-2xl font-black text-white">{value}</p>
            <p className={`text-[9px] font-mono font-bold ${tone}`}>{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[9px] text-slate-500">Mock operational overview · not live telemetry</p>
    </section>
  );
}

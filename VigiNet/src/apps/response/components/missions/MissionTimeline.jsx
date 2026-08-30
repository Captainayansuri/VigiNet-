import React from 'react';
import { Clock } from 'lucide-react';

export default function MissionTimeline({ entries = [] }) {
  if (!entries.length) return null;
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-cyan-400" />
        <h2 className="font-heading text-sm font-extrabold text-white">MISSION TIMELINE</h2>
      </div>
      <ol className="mt-3 space-y-0">
        {entries.map((e, i) => (
          <li key={i} className="relative border-l border-cyan-500/30 pl-4 pb-3">
            <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-cyan-400" />
            <p className="font-mono text-[10px] text-cyan-300">{e[0]}</p>
            <p className="text-[11px] text-slate-300">{e[1]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

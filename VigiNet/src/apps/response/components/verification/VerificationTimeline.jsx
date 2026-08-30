import React from 'react';
import { Clock } from 'lucide-react';

export default function VerificationTimeline({ incident, log = [] }) {
  const canonical = incident.timeline.map(([time, text]) => ({ time, text, local: false }));
  const local = log.map(([time, text]) => ({ time, text, local: true }));
  const entries = [...canonical, ...local];
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-cyan-400" />
        <h2 className="font-heading text-sm font-extrabold text-white">VERIFICATION TIMELINE</h2>
      </div>
      {entries.length === 0 ? (
        <p className="mt-3 text-[11px] text-slate-500">No timeline entries.</p>
      ) : (
        <ol className="mt-3 space-y-0">
          {entries.map((e, i) => (
            <li key={i} className="relative border-l border-cyan-500/30 pl-4 pb-3">
              <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-cyan-400" />
              <p className="font-mono text-[10px] text-cyan-300">{e.time}</p>
              <p className="text-[11px] text-slate-300">
                {e.text}
                {e.local && <span className="ml-1 text-[9px] font-mono text-emerald-400">(ACTION)</span>}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

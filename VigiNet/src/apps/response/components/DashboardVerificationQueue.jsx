import React from 'react';
import { ChevronRight } from 'lucide-react';

// Compact verification summary for the Response Dashboard. Derives incident
// information from the canonical model (passed via `items`). The full-featured
// queue lives at components/verification/VerificationQueue.jsx.
export default function DashboardVerificationQueue({ items }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 shadow-lg">
      <header className="border-b border-slate-800 px-4 py-3">
        <h2 className="font-heading text-sm font-extrabold tracking-wide text-white">VERIFICATION QUEUE</h2>
      </header>
      <div className="divide-y divide-slate-800">
        {items.map(item => (
          <article key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] font-bold text-purple-300">{item.id}</p>
                <p className="mt-1 text-xs font-bold text-slate-100">
                  {item.type} <span className="font-normal text-slate-500">· {item.location.area}</span>
                </p>
              </div>
              <span className="rounded border border-purple-500/30 bg-purple-950/40 px-2 py-1 text-[10px] font-mono font-bold text-purple-200">
                {item.assessment.confidence}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              {item.reports.count} citizen reports · {item.evidence.count} evidence items
            </p>
            <button type="button" className="mt-3 flex items-center gap-1 text-[10px] font-bold text-cyan-300 hover:text-cyan-100">
              REVIEW <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

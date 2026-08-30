import React from 'react';
import { FileText, Link2 } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { reportDetails } from '../../data/verificationMockData';

export default function ReportCorrelationPanel({ incident }) {
  const reports = incident.reports.relatedReports;
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-extrabold text-white">REPORT CORRELATION</h2>
        <span className="text-[9px] font-mono text-cyan-300">RELATED OBSERVATIONS</span>
      </div>

      {reports.length === 0 ? (
        <p className="mt-3 text-[11px] text-slate-500">No correlated reports yet.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {reports.map(r => {
            const [id, type, priority, time] = r;
            const detail = reportDetails[id] || {};
            return (
              <article key={id} className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] font-bold text-cyan-300">REPORT #{id}</p>
                  <StatusBadge value={priority} />
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-100">{type}</p>
                <p className="text-[10px] text-slate-500">{incident.location.area} · {time}</p>

                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-400">
                  <div><dt className="text-slate-500">Source</dt><dd className="text-slate-200">{detail.source || 'CITIZEN'}</dd></div>
                  <div><dt className="text-slate-500">Severity</dt><dd className="text-slate-200">{priority}</dd></div>
                  <div><dt className="text-slate-500">Location accuracy</dt><dd className="text-slate-200">{detail.accuracy || '—'}</dd></div>
                  <div><dt className="text-slate-500">Evidence</dt><dd className="text-slate-200">{detail.evidence || '—'}</dd></div>
                </dl>

                {detail.description && (
                  <p className="mt-2 rounded border border-slate-700 bg-slate-900/60 p-2 text-[11px] italic text-slate-300">
                    “{detail.description}”
                  </p>
                )}
              </article>
            );
          })}
          <p className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/80">
            <Link2 className="h-3 w-3" /> These reports are correlated as observations of the same incident.
          </p>
        </div>
      )}
    </section>
  );
}

import React from 'react';
import { FileImage, Mic, Video, Eye, ShieldAlert } from 'lucide-react';
import { reportDetails } from '../../data/verificationMockData';

const icon = { PHOTO: FileImage, VIDEO: Video, VOICE: Mic };

function EvidenceRow({ item, reportId }) {
  const Icon = icon[item.type] || FileImage;
  return (
    <div className="flex items-center gap-3 p-3">
      <Icon className="h-4 w-4 shrink-0 text-purple-400" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-mono font-bold text-slate-200">{item.type} · Citizen Upload</p>
        <p className="text-[10px] text-slate-500">{item.time} · {item.location}</p>
        <p className="text-[10px] text-slate-500">Associated: {reportId} · Status: UNVERIFIED</p>
      </div>
      {item.type !== 'VOICE' && (
        <button type="button" className="flex items-center gap-1 text-[10px] font-bold text-cyan-300">
          <Eye className="h-3.5 w-3.5" /> REVIEW
        </button>
      )}
    </div>
  );
}

export default function EvidenceReviewPanel({ incident }) {
  const items = incident.evidence.items.map(([type, time, location]) => ({ type, time, location }));
  const reports = incident.reports.relatedReports;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <h2 className="font-heading text-sm font-extrabold text-white">EVIDENCE REVIEW</h2>

      <div className="mt-3 rounded-lg border border-purple-500/25 bg-purple-950/15">
        <header className="flex items-center gap-2 border-b border-purple-500/20 px-3 py-2">
          <ShieldAlert className="h-3.5 w-3.5 text-purple-300" />
          <h3 className="text-[10px] font-bold tracking-wider text-purple-200">CITIZEN EVIDENCE</h3>
        </header>
        {items.length === 0 ? (
          <p className="p-3 text-[11px] text-slate-500">No citizen evidence yet.</p>
        ) : (
          <div className="divide-y divide-slate-800">
            {items.map((item, i) => (
              <EvidenceRow
                key={`${item.type}-${i}`}
                item={item}
                reportId={reports.length ? reports[i % reports.length][0] : '—'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          ['FIELD EVIDENCE', 'No field evidence yet.'],
          ['SENSOR DATA', 'No sensor data available.'],
          ['OFFICIAL DATA', 'No official data available.']
        ].map(([label, message]) => (
          <div key={label} className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
            <p className="text-[9px] font-bold tracking-wider text-slate-400">{label}</p>
            <p className="mt-1 text-[10px] font-semibold text-amber-300/90">NO DATA AVAILABLE</p>
            <p className="mt-1 text-[9px] text-slate-500">{message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

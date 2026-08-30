import React from 'react';

export default function AssessmentPanel({ incident }) {
  const confidence = parseInt(incident.assessment.confidence, 10) || 0;
  return (
    <section className="rounded-xl border border-purple-500/25 bg-purple-950/15 p-4 shadow-lg">
      <h2 className="font-heading text-sm font-extrabold text-white">VIGINET ASSESSMENT</h2>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Confidence</span>
          <b className="text-purple-300">{incident.assessment.confidence}</b>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-slate-800">
          <div className="h-full bg-purple-500/70" style={{ width: `${confidence}%` }} />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-slate-300">
        Assessment: <b className="text-slate-100">{incident.assessment.summary}</b>
      </p>
      <p className="mt-3 border-t border-purple-500/20 pt-2 text-[9px] leading-relaxed text-slate-500">
        Prototype assessment based on report count, evidence availability and source agreement. Not a
        scientifically calculated probability.
      </p>
    </section>
  );
}

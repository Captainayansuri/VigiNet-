import React from 'react';
import { ArrowUpRight, ShieldCheck, Eye } from 'lucide-react';
import StatusBadge from '../StatusBadge';

const unverifiedStatus = s =>
  s === 'VERIFICATION REQUIRED' || s === 'UNDER REVIEW' || s === 'REPORTED' || s === 'UNVERIFIED';

export default function MapObjectPanel({ selected, onViewIncident, onVerify, onViewTeam }) {
  if (!selected) {
    return (
      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 text-[11px] text-slate-500 shadow-lg">
        <p className="font-heading text-xs font-extrabold text-white">SELECTED OBJECT</p>
        <p className="mt-3">Select a marker on the map to inspect an incident, team, or evidence source.</p>
      </section>
    );
  }

  if (selected.kind === 'incident') {
    const d = selected.data;
    return (
      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <p className="text-[9px] font-mono font-bold tracking-widest text-cyan-400">INCIDENT</p>
        <p className="mt-1 font-mono text-xs font-bold text-cyan-300">{d.id}</p>
        <h3 className="font-heading text-lg font-black text-white">{d.type}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusBadge value={d.priority} />
          <StatusBadge value={d.status} />
        </div>
        <dl className="mt-3 space-y-1.5 text-[11px] text-slate-400">
          <div className="flex justify-between"><dt>Location</dt><dd className="text-slate-200">{d.location}</dd></div>
          <div className="flex justify-between"><dt>Reports</dt><dd className="text-cyan-300">{d.reports}</dd></div>
          <div className="flex justify-between"><dt>Evidence</dt><dd className="text-purple-300">{d.evidence}</dd></div>
          <div className="flex justify-between"><dt>Confidence</dt><dd className="text-purple-300">{d.confidence}</dd></div>
        </dl>
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onViewIncident(d.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-2 text-[10px] font-black text-cyan-200 hover:bg-cyan-500/20"
          >
            <Eye className="h-3.5 w-3.5" /> VIEW INCIDENT
          </button>
          {unverifiedStatus(d.status) && (
            <button
              type="button"
              onClick={onVerify}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 py-2 text-[10px] font-black text-amber-200 hover:bg-amber-500/20"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> VERIFY
            </button>
          )}
        </div>
      </section>
    );
  }

  if (selected.kind === 'team') {
    const d = selected.data;
    return (
      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <p className="text-[9px] font-mono font-bold tracking-widest text-blue-400">RESPONSE TEAM</p>
        <h3 className="font-heading text-lg font-black text-white">{d.name}</h3>
        <div className="mt-2"><StatusBadge value={d.status} /></div>
        <dl className="mt-3 space-y-1.5 text-[11px] text-slate-400">
          <div className="flex justify-between"><dt>Assignment</dt><dd className="text-slate-200">{d.assignment || 'NONE'}</dd></div>
        </dl>
        {d.capabilities && (
          <div className="mt-3">
            <p className="text-[9px] font-mono font-bold text-slate-500">CAPABILITIES</p>
            <ul className="mt-1 space-y-0.5 text-[11px] text-slate-300">
              {d.capabilities.map(c => <li key={c}>• {c}</li>)}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={() => onViewTeam(d.name)}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-slate-600 py-2 text-[10px] font-black text-slate-300 hover:bg-slate-800"
        >
          <ArrowUpRight className="h-3.5 w-3.5" /> VIEW TEAM
        </button>
      </section>
    );
  }

  // evidence
  const d = selected.data;
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <p className="text-[9px] font-mono font-bold tracking-widest text-purple-400">EVIDENCE</p>
      <h3 className="font-heading text-lg font-black text-white">{d.type}</h3>
      <dl className="mt-3 space-y-1.5 text-[11px] text-slate-400">
        <div className="flex justify-between"><dt>Source</dt><dd className="text-slate-200">Citizen Upload</dd></div>
        <div className="flex justify-between"><dt>Time</dt><dd className="text-slate-200">{d.time}</dd></div>
        <div className="flex justify-between"><dt>Location</dt><dd className="text-slate-200">{d.location}</dd></div>
        <div className="flex justify-between"><dt>Associated</dt><dd className="text-cyan-300">{d.incidentId}</dd></div>
        <div className="flex justify-between"><dt>Status</dt><dd className="text-amber-300">UNVERIFIED</dd></div>
      </dl>
      <button
        type="button"
        onClick={() => onViewIncident(d.incidentId)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-2 text-[10px] font-black text-cyan-200 hover:bg-cyan-500/20"
      >
        <Eye className="h-3.5 w-3.5" /> VIEW INCIDENT
      </button>
    </section>
  );
}

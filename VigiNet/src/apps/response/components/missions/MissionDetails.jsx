import React, { useState } from 'react';
import { MapPin, AlertTriangle, ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import MissionStatusControl from './MissionStatusControl';
import MissionTimeline from './MissionTimeline';
import MissionMap from './MissionMap';
import { TEAM_CAPABILITIES } from '../../data/mapMockData';

const unverified = s =>
  s === 'VERIFICATION REQUIRED' || s === 'UNDER REVIEW' || s === 'REPORTED' || s === 'UNVERIFIED';

export default function MissionDetails({ mission, incident, team, onTransition, onAbort, onReportProblem, onFieldUpdate, onViewIncident, onViewMap, onVerify }) {
  const [form, setForm] = useState({ situation: '', affected: '', rescued: '', assistance: '' });

  const capabilities = team ? TEAM_CAPABILITIES[team.name] || [] : [];
  const incidentUnverified = incident && unverified(incident.status);

  const submitUpdate = () => {
    if (!form.situation.trim()) return;
    onFieldUpdate(mission.id, {
      situation: form.situation.trim(),
      peopleAffected: form.affected,
      peopleRescued: form.rescued,
      assistance: form.assistance
    });
    setForm({ situation: '', affected: '', rescued: '', assistance: '' });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[11px] font-bold text-cyan-300">{mission.id}</p>
          <StatusBadge value={mission.priority} />
          <StatusBadge value={mission.status} />
        </div>
        <h1 className="mt-2 font-heading text-xl font-black text-white">{mission.title}</h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" /> {mission.location}</p>
        <p className="mt-1 text-[10px] text-slate-500">ETA {mission.eta} · Created {mission.createdAt}</p>
      </section>

      {incidentUnverified && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/15 p-3 text-[11px] text-amber-200">
          <AlertTriangle className="h-4 w-4" /> ⚠ INCIDENT NOT FIELD VERIFIED — proceed with operational caution.
        </div>
      )}

      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <h2 className="font-heading text-sm font-extrabold text-white">SOURCE INCIDENT</h2>
        {incident ? (
          <div className="mt-2">
            <p className="text-xs font-bold text-slate-100">{incident.id} · {incident.type}</p>
            <p className="text-[11px] text-slate-400">{incident.location.area}</p>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => onViewIncident(incident.id)} className="flex items-center gap-1 text-[10px] font-bold text-cyan-300">
                <ExternalLink className="h-3.5 w-3.5" /> VIEW INCIDENT
              </button>
              {incidentUnverified && (
                <button type="button" onClick={onVerify} className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
                  <ShieldAlert className="h-3.5 w-3.5" /> OPEN VERIFICATION
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-slate-500">Incident not found.</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <h2 className="font-heading text-sm font-extrabold text-white">MISSION OBJECTIVE</h2>
        <p className="mt-2 text-[11px] text-slate-300">{mission.objective}</p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <h2 className="font-heading text-sm font-extrabold text-white">ASSIGNED TEAM</h2>
        {team && (
          <div className="mt-2">
            <div className="flex items-center gap-2"><StatusBadge value={team.status} /><span className="text-xs font-bold text-slate-100">{team.name}</span></div>
            <p className="mt-1 text-[10px] text-slate-400">{team.assignment}</p>
            {capabilities.length > 0 && (
              <div className="mt-2">
                <p className="text-[9px] font-mono font-bold text-slate-500">CAPABILITIES</p>
                <ul className="mt-1 space-y-0.5 text-[11px] text-slate-300">{capabilities.map(c => <li key={c}>• {c}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <h2 className="font-heading text-sm font-extrabold text-white">LOCATION</h2>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div><dt className="text-slate-500">Latitude</dt><dd className="text-slate-200">{mission.lat}</dd></div>
          <div><dt className="text-slate-500">Longitude</dt><dd className="text-slate-200">{mission.lon}</dd></div>
          <div className="col-span-2"><dt className="text-slate-500">Accuracy</dt><dd className="text-slate-200">{mission.accuracy}</dd></div>
        </dl>
        <button type="button" onClick={onViewMap} className="mt-2 flex items-center gap-1 text-[10px] font-bold text-cyan-300">
          <ExternalLink className="h-3.5 w-3.5" /> VIEW ON MAP
        </button>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <h2 className="font-heading text-sm font-extrabold text-white">HAZARDS</h2>
        <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
          {mission.hazards.map(h => <li key={h} className="flex items-center gap-1.5"><AlertTriangle className="h-3 w-3 text-amber-400" /> {h}</li>)}
        </ul>
      </section>

      <MissionStatusControl mission={mission} onTransition={onTransition} onAbort={onAbort} onReportProblem={onReportProblem} />

      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /><h2 className="font-heading text-sm font-extrabold text-white">FIELD UPDATE</h2></div>
        <textarea
          value={form.situation}
          onChange={e => setForm(f => ({ ...f, situation: e.target.value }))}
          rows={2}
          placeholder="Situation report…"
          className="mt-2 w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200"
        />
        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
          <input value={form.affected} onChange={e => setForm(f => ({ ...f, affected: e.target.value }))} placeholder="Affected" className="rounded border border-slate-700 bg-slate-950 p-2 text-slate-200" />
          <input value={form.rescued} onChange={e => setForm(f => ({ ...f, rescued: e.target.value }))} placeholder="Rescued" className="rounded border border-slate-700 bg-slate-950 p-2 text-slate-200" />
          <input value={form.assistance} onChange={e => setForm(f => ({ ...f, assistance: e.target.value }))} placeholder="Assistance" className="rounded border border-slate-700 bg-slate-950 p-2 text-slate-200" />
        </div>
        <button type="button" onClick={submitUpdate} className="mt-3 w-full rounded bg-emerald-500/90 py-2 text-[10px] font-black text-slate-950">SUBMIT FIELD UPDATE</button>
      </section>

      <MissionMap mission={mission} />
      <MissionTimeline entries={mission.timeline} />

      {mission.fieldUpdates.length > 0 && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
          <h2 className="font-heading text-sm font-extrabold text-white">FIELD UPDATES</h2>
          <div className="mt-2 space-y-2">
            {mission.fieldUpdates.map((u, i) => (
              <div key={i} className="rounded border border-slate-700 bg-slate-950/50 p-2 text-[11px] text-slate-300">
                <p className="text-[10px] font-mono text-cyan-300">{u.time}</p>
                <p>{u.situation}</p>
                {(u.peopleAffected || u.peopleRescued) && (
                  <p className="text-[10px] text-slate-500">Affected: {u.peopleAffected || '—'} · Rescued: {u.peopleRescued || '—'}</p>
                )}
                {u.assistance && <p className="text-[10px] text-slate-500">Assistance: {u.assistance}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

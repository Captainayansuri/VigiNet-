import React, { useState } from 'react';
import { X } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { incidentToMissionPriority } from '../../data/missionMockData';

export default function CreateMissionModal({ incidents, teams, onClose, onCreate }) {
  const [incidentId, setIncidentId] = useState(incidents[0]?.id || '');
  const [teamId, setTeamId] = useState('');
  const [objective, setObjective] = useState('');
  const [capabilities, setCapabilities] = useState('');
  const [priority, setPriority] = useState('');

  const incident = incidents.find(i => i.id === incidentId);
  const defaultPriority = incident ? incidentToMissionPriority[incident.priority] || incident.priority : 'MEDIUM';
  const effectivePriority = priority || defaultPriority;
  const overridden = !!priority && priority !== defaultPriority;

  const canCreate = incidentId && teamId && objective.trim();

  const submit = () => {
    if (!canCreate) return;
    onCreate({
      incidentId,
      teamId,
      title: `${incident.type} — ${incident.location.area}`,
      objective: objective.trim(),
      location: incident.location.area,
      lat: incident.location.latitude,
      lon: incident.location.longitude,
      accuracy: incident.location.accuracy,
      priority: effectivePriority,
      priorityOverridden: overridden,
      capabilities: capabilities.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-[#0b1120] p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-extrabold text-white">CREATE MISSION</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-slate-400 hover:text-cyan-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[10px] font-bold tracking-wider text-slate-400">SOURCE INCIDENT</label>
            <select
              value={incidentId}
              onChange={e => { setIncidentId(e.target.value); setPriority(''); }}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200"
            >
              {incidents.map(i => (
                <option key={i.id} value={i.id}>{i.id} · {i.type}</option>
              ))}
            </select>
            {incident && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <span>Priority: <b className="text-slate-200">{incident.priority}</b></span>
                <span>Location: <b className="text-slate-200">{incident.location.area}</b></span>
                <span>Reports: <b className="text-cyan-300">{incident.reports.count}</b></span>
                <span>Evidence: <b className="text-purple-300">{incident.evidence.count}</b></span>
                <span className="col-span-2">Verification: <StatusBadge value={incident.status} /></span>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-slate-400">ASSIGNED TEAM</label>
            <select
              value={teamId}
              onChange={e => setTeamId(e.target.value)}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200"
            >
              <option value="">Select team…</option>
              {teams.map(t => (
                <option key={t.name} value={t.name.replace('TEAM ', '')}>{t.name} · {t.status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-slate-400">MISSION OBJECTIVE</label>
            <textarea
              value={objective}
              onChange={e => setObjective(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200"
              placeholder="Describe the field objective…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-400">PRIORITY</label>
              <select
                value={effectivePriority}
                onChange={e => setPriority(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200"
              >
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                  <option key={p} value={p}>{p}{p === defaultPriority ? ' (incident default)' : ''}</option>
                ))}
              </select>
              {overridden && <p className="mt-1 text-[9px] text-amber-300">Priority overridden from {defaultPriority}.</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-400">REQUIRED CAPABILITIES</label>
              <input
                value={capabilities}
                onChange={e => setCapabilities(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200"
                placeholder="e.g. Flood rescue"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="text-xs text-slate-400">CANCEL</button>
          <button
            type="button"
            onClick={submit}
            disabled={!canCreate}
            className="rounded bg-cyan-500 px-4 py-2 text-[10px] font-black text-slate-950 disabled:opacity-40"
          >
            CREATE MISSION
          </button>
        </div>
      </div>
    </div>
  );
}

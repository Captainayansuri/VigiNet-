import React, { useState } from 'react';
import { X, CheckCircle2, Radio } from 'lucide-react';
import { teams } from '../../data/verificationMockData';
import StatusBadge from '../StatusBadge';

export default function FieldVerificationModal({ incident, onConfirm, onClose }) {
  const [selectedTeam, setSelectedTeam] = useState(teams[0]?.name || '');
  const [submitted, setSubmitted] = useState(false);

  const team = teams.find(t => t.name === selectedTeam);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0b1120] p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-extrabold text-white">REQUEST FIELD VERIFICATION</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-slate-400 hover:text-cyan-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!submitted ? (
          <>
            <dl className="mt-4 space-y-2 rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-[11px]">
              <div className="flex justify-between"><dt className="text-slate-500">Incident</dt><dd className="font-mono text-cyan-300">{incident.id}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Location</dt><dd className="text-slate-200">{incident.location.area}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Priority</dt><dd><StatusBadge value={incident.priority} /></dd></div>
            </dl>
            <p className="mt-3 text-[11px] text-amber-300">Recommended action: Field verification required.</p>

            <p className="mt-4 text-[10px] font-bold tracking-wider text-slate-400">SELECT TEAM</p>
            <div className="mt-2 space-y-2">
              {teams.map(t => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setSelectedTeam(t.name)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition ${
                    selectedTeam === t.name ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="font-mono font-bold">{t.name}</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className={`h-2 w-2 rounded-full ${
                      t.status === 'AVAILABLE' ? 'bg-emerald-400' : t.status === 'DEPLOYED' ? 'bg-cyan-400' : t.status === 'EN ROUTE' ? 'bg-amber-400' : 'bg-slate-600'
                    }`} />
                    {t.status}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="text-xs text-slate-400">CANCEL</button>
              <button
                type="button"
                onClick={() => { onConfirm(selectedTeam); setSubmitted(true); }}
                className="rounded bg-cyan-500 px-3 py-2 text-[10px] font-black text-slate-950"
              >
                CONFIRM REQUEST
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
            <p className="mt-3 text-sm font-black text-emerald-300">VERIFICATION REQUEST CREATED</p>
            <p className="mt-1 font-mono text-xs text-cyan-300">{selectedTeam}</p>
            <p className="mt-3 inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-950/60 px-2 py-1 text-[9px] font-mono text-slate-500">
              <Radio className="h-3 w-3" /> LOCAL MOCK STATE ONLY
            </p>
            <div className="mt-5">
              <button type="button" onClick={onClose} className="rounded bg-cyan-500 px-4 py-2 text-[10px] font-black text-slate-950">CLOSE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

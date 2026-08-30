import React, { useState } from 'react';
import { AlertTriangle, Flag, XCircle, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { MISSION_TRANSITIONS } from '../../data/missionMockData';

export default function MissionStatusControl({ mission, onTransition, onAbort, onReportProblem }) {
  const [confirm, setConfirm] = useState(null);
  const normalizedStatus = String(mission.status || '').replace(/_/g, ' ');
  const next = MISSION_TRANSITIONS[normalizedStatus] || MISSION_TRANSITIONS[mission.status];

  const confirmTransition = () => {
    onTransition(next.to, next.label);
    setConfirm(null);
  };
  const confirmAbort = () => {
    onAbort();
    setConfirm(null);
  };

  return (
    <section className="rounded-xl border border-cyan-500/25 bg-cyan-950/10 p-4 shadow-lg">
      <h2 className="font-heading text-sm font-extrabold text-white">MISSION STATUS CONTROL</h2>
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        <span className="text-slate-400">Current:</span>
        <StatusBadge value={mission.status} />
      </div>

      {['COMPLETED', 'CANCELLED', 'ABORTED', 'UNABLE TO REACH', 'UNABLE_TO_REACH'].includes(normalizedStatus) ? (
        <p className="mt-3 text-[11px] text-slate-400">This mission is in a terminal state ({normalizedStatus}).</p>
      ) : confirm ? (
        <div className="mt-3 rounded-lg border border-amber-500/40 bg-slate-950/60 p-3">
          <p className="text-[11px] text-slate-200">
            {confirm.kind === 'transition' ? `Confirm: ${confirm.label}?` : 'Confirm abort mission? This cannot be undone.'}
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setConfirm(null)} className="text-xs text-slate-400">CANCEL</button>
            <button
              type="button"
              onClick={confirm.kind === 'transition' ? confirmTransition : confirmAbort}
              className="rounded bg-amber-500 px-3 py-1.5 text-[10px] font-black text-slate-950"
            >
              CONFIRM
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {next && (
            <button
              type="button"
              onClick={() => setConfirm({ kind: 'transition' })}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[10px] font-black text-emerald-200 hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> {next.label}
            </button>
          )}
          <button
            type="button"
            onClick={onReportProblem}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[10px] font-black text-amber-200 hover:bg-amber-500/20"
          >
            <Flag className="h-3.5 w-3.5" /> REPORT PROBLEM
          </button>
          <button
            type="button"
            onClick={() => setConfirm({ kind: 'abort' })}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[10px] font-black text-red-200 hover:bg-red-500/20"
          >
            <XCircle className="h-3.5 w-3.5" /> ABORT MISSION
          </button>
        </div>
      )}
    </section>
  );
}

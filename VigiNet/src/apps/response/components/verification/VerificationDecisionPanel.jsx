import React, { useState } from 'react';
import { ShieldCheck, Radio, HelpCircle, Eye, X } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import FieldVerificationModal from './FieldVerificationModal';

const MISSING_OPTIONS = [
  'Exact victim count',
  'Current water level',
  'Current access condition',
  'Recent photo',
  'Current location confirmation',
  'Other'
];

const FIELD_RESULTS = ['CONFIRMED', 'PARTIALLY CONFIRMED', 'NOT CONFIRMED', 'INSUFFICIENT INFORMATION'];

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0b1120] p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-extrabold text-white">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-slate-400 hover:text-cyan-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function VerificationDecisionPanel({
  incident,
  status,
  assignedTeam,
  fieldResult,
  onRequestFieldVerification,
  onMarkVerified,
  onRequestInfo,
  onKeepUnderReview,
  onSetFieldResult
}) {
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState([]);
  const [infoPending, setInfoPending] = useState(false);

  const toggle = id => setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  return (
    <section className="rounded-xl border border-cyan-500/25 bg-cyan-950/10 p-4 shadow-lg">
      <h2 className="font-heading text-sm font-extrabold text-white">VERIFICATION DECISION</h2>
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        <span className="text-slate-400">Current:</span>
        <StatusBadge value={status} />
      </div>

      {assignedTeam && (
        <p className="mt-2 text-[10px] font-mono text-blue-300">FIELD TEAM: {assignedTeam}</p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setModal('field')}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-2 text-[10px] font-black text-cyan-200 hover:bg-cyan-500/20"
        >
          <Radio className="h-3.5 w-3.5" /> REQUEST FIELD VERIFICATION
        </button>
        <button
          type="button"
          onClick={() => setModal('verify')}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-2 text-[10px] font-black text-emerald-200 hover:bg-emerald-500/20"
        >
          <ShieldCheck className="h-3.5 w-3.5" /> MARK VERIFIED
        </button>
        <button
          type="button"
          onClick={() => { setSelected([]); setInfoPending(false); setModal('info'); }}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 py-2 text-[10px] font-black text-amber-200 hover:bg-amber-500/20"
        >
          <HelpCircle className="h-3.5 w-3.5" /> REQUEST MORE INFORMATION
        </button>
        <button
          type="button"
          onClick={onKeepUnderReview}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-600 py-2 text-[10px] font-black text-slate-300 hover:bg-slate-800"
        >
          <Eye className="h-3.5 w-3.5" /> KEEP UNDER REVIEW
        </button>
      </div>

      {assignedTeam && (
        <div className="mt-4 rounded-lg border border-blue-500/20 bg-slate-950/40 p-3">
          <p className="text-[10px] font-bold tracking-wider text-blue-300">FIELD VERIFICATION RESULT</p>
          {fieldResult ? (
            <p className="mt-2 text-xs font-black text-emerald-300">RESULT: {fieldResult}</p>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FIELD_RESULTS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onSetFieldResult(r)}
                  className="rounded border border-slate-700 py-1.5 text-[9px] font-bold text-slate-200 hover:border-blue-500/50 hover:text-blue-200"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {modal === 'field' && (
        <FieldVerificationModal
          incident={incident}
          onConfirm={team => { onRequestFieldVerification(team); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'verify' && (
        <ModalShell title="VERIFY INCIDENT" onClose={() => setModal(null)}>
          <p className="mt-3 text-[11px] text-slate-300">
            Confirm that the available evidence is sufficient to mark this incident as verified.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setModal(null)} className="text-xs text-slate-400">CANCEL</button>
            <button
              type="button"
              onClick={() => { onMarkVerified(); setModal(null); }}
              className="rounded bg-emerald-500 px-3 py-2 text-[10px] font-black text-slate-950"
            >
              CONFIRM VERIFICATION
            </button>
          </div>
        </ModalShell>
      )}

      {modal === 'info' && (
        <ModalShell title="REQUEST MORE INFORMATION" onClose={() => setModal(null)}>
          {!infoPending ? (
            <>
              <p className="mt-3 text-[10px] text-slate-400">Select what is missing:</p>
              <div className="mt-3 space-y-1.5">
                {MISSING_OPTIONS.map(opt => (
                  <label key={opt} className="flex cursor-pointer items-center gap-2 rounded border border-slate-700 px-3 py-2 text-[11px] text-slate-200">
                    <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="accent-cyan-500" />
                    {opt}
                  </label>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setModal(null)} className="text-xs text-slate-400">CANCEL</button>
                <button
                  type="button"
                  disabled={selected.length === 0}
                  onClick={() => { onRequestInfo(selected); setInfoPending(true); }}
                  className="rounded bg-amber-500 px-3 py-2 text-[10px] font-black text-slate-950 disabled:opacity-40"
                >
                  SUBMIT REQUEST
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-amber-400" />
              <p className="mt-3 text-sm font-black text-amber-300">INFORMATION REQUEST PENDING</p>
              <p className="mt-2 text-[10px] text-slate-400">Prototype interaction only.</p>
              <button type="button" onClick={() => setModal(null)} className="mt-5 rounded bg-cyan-500 px-4 py-2 text-[10px] font-black text-slate-950">CLOSE</button>
            </div>
          )}
        </ModalShell>
      )}
    </section>
  );
}

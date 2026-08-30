import React from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { KnownUnknown } from '../IncidentPanels';
import ReportCorrelationPanel from './ReportCorrelationPanel';
import ConflictPanel from './ConflictPanel';
import EvidenceReviewPanel from './EvidenceReviewPanel';
import AssessmentPanel from './AssessmentPanel';
import VerificationDecisionPanel from './VerificationDecisionPanel';
import VerificationTimeline from './VerificationTimeline';
import VerificationMap from './VerificationMap';

const STAGES = ['REPORTED', 'UNVERIFIED', 'CORRELATED', 'FIELD VERIFIED', 'OFFICIALLY CONFIRMED'];

function stageIndex(incident, state) {
  let i = 0;
  if (incident.reports.count > 0) i = 1;
  if (incident.verification.required || incident.reports.relatedReports.length > 1) i = 2;
  if (state.assignedTeam || state.fieldResult) i = 3;
  if (state.status === 'VERIFIED' || incident.status === 'VERIFIED') i = 4;
  return i;
}

export default function VerificationWorkspace({ incident, state, actions }) {
  const stage = stageIndex(incident, state);
  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[11px] font-bold text-cyan-300">{incident.id}</p>
          <StatusBadge value={incident.priority} />
          <StatusBadge value={state.status} />
        </div>
        <h1 className="mt-2 font-heading text-xl font-black text-white">{incident.type}</h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
          <MapPin className="h-3.5 w-3.5" /> {incident.location.area}
        </p>

        <div className="mt-3 border-t border-slate-800 pt-3">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Verification state</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STAGES.map((s, idx) => (
              <span
                key={s}
                className={`rounded border px-2 py-0.5 text-[9px] font-bold tracking-wider ${
                  idx <= stage
                    ? idx === stage
                      ? 'border-cyan-400/60 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-600 text-slate-400'
                    : 'border-slate-800 text-slate-600'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
            <AlertTriangle className="h-3 w-3" /> Multiple reports increase signal, but verification remains a separate state.
          </p>
        </div>
      </header>

      <VerificationDecisionPanel
        incident={incident}
        status={state.status}
        assignedTeam={state.assignedTeam}
        fieldResult={state.fieldResult}
        onRequestFieldVerification={actions.onRequestFieldVerification}
        onMarkVerified={actions.onMarkVerified}
        onRequestInfo={actions.onRequestInfo}
        onKeepUnderReview={actions.onKeepUnderReview}
        onSetFieldResult={actions.onSetFieldResult}
      />

      <KnownUnknown incident={incident} />

      <ReportCorrelationPanel incident={incident} />
      <ConflictPanel incidentId={incident.id} />
      <EvidenceReviewPanel incident={incident} />
      <AssessmentPanel incident={incident} />

      <div className="grid gap-4 lg:grid-cols-2">
        <VerificationMap incident={incident} />
        <VerificationTimeline incident={incident} log={state.log} />
      </div>
    </div>
  );
}

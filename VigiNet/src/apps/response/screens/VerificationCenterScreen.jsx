import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, Clock3, ShieldCheck } from 'lucide-react';
import useRealTimeClock from '../../../hooks/useRealTimeClock';
import { useResponse } from '../context/ResponseContext';
import { getTeamById } from '../data/selectors';
import VerificationQueue from '../components/verification/VerificationQueue';
import VerificationWorkspace from '../components/verification/VerificationWorkspace';

export default function VerificationCenterScreen() {
  const navigate = useNavigate();
  const { time24, timezone } = useRealTimeClock();
  const { incidents, verifyIncident, teams } = useResponse();
  const [selectedId, setSelectedId] = useState('VN-63481');
  const [localStates, setLocalStates] = useState({});

  const incident = incidents.find(i => i.id === selectedId || i.incidentCode === selectedId) || incidents[0];

  const getState = id => {
    const base = incidents.find(i => i.id === id || i.incidentCode === id) || incidents[0];
    const local = localStates[id] || {};
    return {
      status: local.status || base.status,
      assignedTeam:
        local.assignedTeam ||
        (base.team && base.team.teamId ? getTeamById(base.team.teamId, teams)?.name || null : null),
      fieldResult: local.fieldResult || null,
      log: local.log || []
    };
  };

  const update = (id, patch, logEntry) => {
    verifyIncident(id, patch, logEntry);
    setLocalStates(prev => {
      const cur = prev[id] || { log: [] };
      return {
        ...prev,
        [id]: {
          ...cur,
          ...patch,
          log: logEntry ? [...(cur.log || []), logEntry] : cur.log
        }
      };
    });
  };

  const state = getState(selectedId);

  const actions = {
    onRequestFieldVerification: team =>
      update(selectedId, { assignedTeam: team, status: 'IN VERIFICATION' }, [time24, `Field verification requested · ${team}`]),
    onMarkVerified: () =>
      update(selectedId, { status: 'VERIFIED' }, [time24, 'Marked verified']),
    onRequestInfo: items =>
      update(selectedId, {}, [time24, `Information requested: ${items.join(', ')}`]),
    onKeepUnderReview: () =>
      update(selectedId, { status: 'UNDER REVIEW' }, [time24, 'Kept under review']),
    onSetFieldResult: result =>
      update(selectedId, { fieldResult: result }, [time24, `Field result: ${result}`])
  };

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/response')}
            className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 hover:text-cyan-100"
          >
            <ArrowLeft className="h-4 w-4" /> RESPONSE
          </button>
          <div>
            <p className="font-heading text-base font-extrabold tracking-[0.14em] text-white">VERIFICATION CENTER</p>
            <p className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">EMERGENCY INTELLIGENCE WORKSPACE</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="hidden items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-950/50 px-2 py-1 text-cyan-300 sm:flex">
            <Wifi className="h-3 w-3" /> SYSTEM ONLINE
          </span>
          <span className="hidden items-center gap-1.5 text-slate-400 sm:flex">
            <Clock3 className="h-3 w-3" /> {time24} {timezone}
          </span>
          <span className="hidden items-center gap-1.5 text-slate-400 lg:flex">
            <ShieldCheck className="h-3 w-3" /> ROLE: FIELD RESPONDER
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="lg:max-h-[calc(100vh-140px)] lg:sticky lg:top-20">
          <VerificationQueue incidents={incidents} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <VerificationWorkspace incident={incident} state={state} actions={actions} />
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { ArrowLeft, MapPin, Users, Image, ShieldAlert } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useResponse } from '../context/ResponseContext';

const statuses = ['UNDER REVIEW', 'FIELD TEAM ASSIGNED', 'IN VERIFICATION', 'VERIFIED', 'RESPONSE DISPATCHED', 'RESOLVED'];

export default function IncidentDetailsScreen({ incident, onBack }) {
  const { updateIncidentStatus, assignTeam, verifyIncident } = useResponse();
  const [status, setStatus] = useState(incident.status || 'UNDER REVIEW');
  const [team, setTeam] = useState(incident.team?.assigned ? `TEAM ${incident.team.teamId || 'ALPHA'} · ASSIGNED` : 'NOT ASSIGNED');
  const [modal, setModal] = useState('');
  const [next, setNext] = useState(status);
  const [log, setLog] = useState([]);

  const act = (x) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLog(l => [...l, [timeString, x]]);
    setModal('');
  };

  const handleRequestVerification = () => {
    setStatus('IN VERIFICATION');
    verifyIncident(incident.id, { status: 'IN VERIFICATION', notes: 'Field verification requested from details view' });
    act('Field verification requested');
  };

  const handleAssignTeam = (teamName) => {
    setTeam(`${teamName} · ASSIGNED`);
    setStatus('FIELD TEAM ASSIGNED');
    assignTeam(incident.id, teamName);
    act(`${teamName} assigned`);
  };

  const handleConfirmStatus = () => {
    if (modal === 'status') {
      const prev = status;
      setStatus(next);
      updateIncidentStatus(incident.id, next);
      act(`Status changed: ${prev} → ${next}`);
    } else if (modal === 'escalate') {
      act('Incident escalated to Regional Operations');
    }
  };

  return (
    <section className="space-y-5 pb-20">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-3">
        <button onClick={onBack} className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300">
          <ArrowLeft className="h-4 w-4" />BACK TO INCIDENTS
        </button>
        <b className="font-heading text-sm text-white">INCIDENT #{incident.id}</b>
        <StatusBadge value={status} />
        <StatusBadge value={incident.priority} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_.8fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-red-500/30 bg-red-950/20 p-5">
            <p className="text-[10px] font-mono text-red-300">INCIDENT SUMMARY · CANONICAL INTELLIGENCE</p>
            <h1 className="mt-2 font-heading text-2xl font-black text-white">{incident.type || incident.title}</h1>
            <p className="text-sm text-slate-300">{incident.location?.area || incident.locationText} · {incident.location?.district}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-400 sm:grid-cols-4">
              <span>REPORTED<b className="block text-slate-200">{incident.timestamps?.reportedAt || 'Recent'}</b></span>
              <span>UPDATED<b className="block text-slate-200">{incident.timestamps?.updatedAt || 'Just now'}</b></span>
              <span>REPORTS<b className="block text-cyan-300">{incident.reports?.count ?? 0}</b></span>
              <span>EVIDENCE<b className="block text-purple-300">{incident.evidence?.count ?? 0}</b></span>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4">
            <h2 className="font-heading text-sm font-extrabold text-white">LOCATION / OPERATIONAL MAP</h2>
            <div className="relative mt-3 h-72 rounded-lg border border-slate-700 bg-[#09111f] overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(#1e3a5f 1px,transparent 1px),linear-gradient(90deg,#1e3a5f 1px,transparent 1px)', backgroundSize: '35px 35px' }} />
              <i className="absolute left-[48%] top-[43%] h-4 w-4 rounded-full border-2 border-slate-950 bg-red-500 shadow-lg shadow-red-500/70" />
              <span className="absolute left-[53%] top-[42%] text-[10px] font-mono text-white">INCIDENT LOCATION</span>
              <i className="absolute left-[70%] top-[57%] h-3 w-3 rounded-full bg-blue-400" />
              <span className="absolute left-[74%] top-[55%] text-[9px] font-mono text-slate-300">TEAM STAGING</span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              <MapPin className="inline h-3.5 w-3.5 text-cyan-400" /> {incident.location?.coordinates || 'Coordinates Active'} · Accuracy {incident.location?.accuracy || '±20 m'} · Affected area {incident.location?.affectedArea || '~1.0 km'}
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/85">
            <h2 className="border-b border-slate-800 p-4 font-heading text-sm font-extrabold text-white">EVIDENCE · CITIZEN SOURCE</h2>
            {(incident.evidence?.items || []).map((x, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-800 p-3 text-xs">
                <span><Image className="mr-2 inline h-4 w-4 text-purple-400" />{x[0]} · Citizen Upload <small className="text-slate-500">{x[1]} · {x[2]}</small></span>
                {x[0] !== 'VOICE' && <button className="text-[10px] font-bold text-cyan-300">VIEW</button>}
              </div>
            ))}
            <p className="p-3 text-[9px] font-mono text-slate-500">FIELD EVIDENCE: METADATA LOGGED · TELEMETRY: VALIDATED</p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4">
            <h2 className="font-heading text-sm font-extrabold text-white">RELATED CITIZEN REPORTS</h2>
            {(incident.reports?.relatedReports || []).map(r => (
              <div key={r[0]} className="mt-3 flex justify-between text-xs">
                <span><b className="font-mono text-cyan-300">{r[0]}</b> · {r[1]} · {r[3]}</span>
                <StatusBadge value={r[2]} />
              </div>
            ))}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-purple-500/25 bg-purple-950/15 p-4">
            <h2 className="font-heading text-sm font-extrabold text-white">VIGINET ASSESSMENT</h2>
            <p className="mt-3 text-xs text-slate-300">
              CURRENT PRIORITY: <b className="text-red-300">{incident.priority}</b><br />
              CONFIDENCE: <b className="text-purple-300">{incident.assessment?.confidence || '80%'}</b><br />
              VERIFICATION: <b className="text-amber-300">REQUIRED</b>
            </p>
            <p className="mt-3 text-[11px] text-slate-400">{incident.assessment?.summary || incident.description}</p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl border border-emerald-500/25 p-4">
              <h2 className="font-heading text-sm font-extrabold text-emerald-200">WHAT WE KNOW</h2>
              {(incident.known || []).map(x => <p key={x} className="mt-2 text-[11px] text-slate-300">✓ {x}</p>)}
            </div>
            <div className="rounded-xl border border-amber-500/25 p-4">
              <h2 className="font-heading text-sm font-extrabold text-amber-200">WHAT WE DON'T KNOW</h2>
              {(incident.unknown || []).map(x => <p key={x} className="mt-2 text-[11px] text-slate-300">? {x}</p>)}
            </div>
          </section>

          <section className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
            <h2 className="font-heading text-sm font-extrabold text-amber-200">VERIFICATION</h2>
            <p className="mt-2 text-xs text-slate-300">{status}</p>
            <button
              onClick={handleRequestVerification}
              className="mt-3 w-full rounded bg-amber-500 p-2 text-[10px] font-black text-slate-950"
            >
              REQUEST FIELD VERIFICATION
            </button>
            <button onClick={() => setModal('status')} className="mt-2 w-full rounded border border-slate-600 p-2 text-[10px] font-bold">
              UPDATE STATUS
            </button>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4">
            <h2 className="font-heading text-sm font-extrabold text-white">RESPONSE TEAM</h2>
            <p className="mt-2 text-xs text-slate-300">{team}</p>
            <button onClick={() => setModal('team')} className="mt-3 w-full rounded border border-cyan-500/30 p-2 text-[10px] font-bold text-cyan-300">
              ASSIGN TEAM
            </button>
          </section>

          <button onClick={() => setModal('escalate')} className="w-full rounded border border-red-500/40 bg-red-950/30 p-2 text-[10px] font-black text-red-300">
            ESCALATE
          </button>
        </aside>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4">
        <h2 className="font-heading text-sm font-extrabold text-white">INCIDENT TIMELINE & ACTION LOG</h2>
        {[...(incident.timeline || []), ...log].map((x, i) => (
          <p key={i} className="mt-3 border-l border-cyan-500/40 pl-3 text-xs text-slate-300">
            <b className="mr-3 font-mono text-cyan-300">{x[0]}</b>{x[1]}
          </p>
        ))}
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-[#0b1120] p-5">
            <h2 className="font-heading font-black">{modal === 'team' ? 'ASSIGN TEAM' : modal === 'status' ? 'UPDATE INCIDENT STATUS' : 'ESCALATE INCIDENT?'}</h2>
            {modal === 'team' && ['TEAM ALPHA · AVAILABLE', 'TEAM BETA · DEPLOYED', 'TEAM GAMMA · EN ROUTE'].map(x => (
              <button
                key={x}
                onClick={() => handleAssignTeam(x.split(' · ')[0])}
                className="mt-3 block w-full rounded border border-slate-700 p-2 text-left text-xs"
              >
                {x}
              </button>
            ))}
            {modal === 'status' && (
              <select value={next} onChange={e => setNext(e.target.value)} className="mt-4 w-full bg-slate-950 p-2 text-xs">
                {statuses.map(x => <option key={x}>{x}</option>)}
              </select>
            )}
            {modal === 'escalate' && <p className="mt-3 text-xs text-slate-400">This marks the incident for higher-level attention and regional dispatch.</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setModal('')} className="text-xs text-slate-400">CANCEL</button>
              {modal !== 'team' && (
                <button
                  onClick={handleConfirmStatus}
                  className="rounded bg-cyan-500 px-3 py-2 text-[10px] font-black text-slate-950"
                >
                  CONFIRM
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Wifi, Clock3, ShieldCheck } from 'lucide-react';
import useRealTimeClock from '../../../hooks/useRealTimeClock';
import { useResponse } from '../context/ResponseContext';
import { getActiveMissions, getMissionsByStatus, getIncidentById, getTeamById } from '../data/selectors';
import MissionList from '../components/missions/MissionList';
import MissionDetails from '../components/missions/MissionDetails';
import CreateMissionModal from '../components/missions/CreateMissionModal';

export default function MissionsScreen() {
  const navigate = useNavigate();
  const { time24, timezone } = useRealTimeClock();
  const {
    missions,
    createMission: createMissionContext,
    updateMissionStatus,
    submitFieldUpdate,
    incidents,
    teams
  } = useResponse();
  const [selectedId, setSelectedId] = useState(missions[0]?.id || 'VN-M001');
  const [showCreate, setShowCreate] = useState(false);

  const transition = (id, to, label) => updateMissionStatus(id, to, label);
  const abort = id => updateMissionStatus(id, 'ABORTED', 'Mission aborted');
  const reportProblem = id => updateMissionStatus(id, missions.find(m => m.id === id)?.status || 'ASSIGNED', 'Problem reported');
  const fieldUpdate = (id, data) => submitFieldUpdate(id, data);

  const handleCreateMission = async data => {
    const created = await createMissionContext(data);
    if (created?.id) {
      setSelectedId(created.id);
    }
    setShowCreate(false);
  };

  const selected = missions.find(m => m.id === selectedId) || missions[0];
  const incident = selected ? getIncidentById(selected.incidentId, incidents) : null;
  const team = selected ? getTeamById(selected.teamId, teams) : null;

  const active = getActiveMissions(missions).length;
  const pending = getMissionsByStatus(missions, 'ASSIGNED').length + getMissionsByStatus(missions, 'ACCEPTED').length;
  const enRoute = getMissionsByStatus(missions, 'EN ROUTE').length;
  const onScene = getMissionsByStatus(missions, 'ON SCENE').length;
  const completed = getMissionsByStatus(missions, 'COMPLETED').length;

  const summary = [
    ['ACTIVE', active, 'text-cyan-300'],
    ['PENDING', pending, 'text-amber-300'],
    ['EN ROUTE', enRoute, 'text-amber-300'],
    ['ON SCENE', onScene, 'text-blue-300'],
    ['COMPLETED', completed, 'text-emerald-300']
  ];

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/response')} className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 hover:text-cyan-100">
            <ArrowLeft className="h-4 w-4" /> RESPONSE
          </button>
          <div>
            <p className="font-heading text-base font-extrabold tracking-[0.14em] text-white">FIELD MISSIONS</p>
            <p className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">ACTIVE OPERATIONS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-950/50 px-2 py-1 text-[10px] font-mono text-emerald-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> SYSTEM ONLINE
          </span>
          <span className="hidden items-center gap-1.5 text-slate-400 sm:flex"><Clock3 className="h-3 w-3" /> {time24} {timezone}</span>
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-black text-cyan-200 hover:bg-cyan-500/20">
            <Plus className="h-3.5 w-3.5" /> CREATE MISSION
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {summary.map(([label, value, tone]) => (
          <div key={label} className="rounded-lg border border-slate-700 bg-slate-900/60 p-2.5 text-center">
            <p className="font-heading text-xl font-black text-white">{value}</p>
            <p className={`text-[9px] font-mono font-bold ${tone}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="lg:h-[calc(100vh-220px)] lg:sticky lg:top-20">
          <MissionList missions={missions} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div>
          {selected && (
            <MissionDetails
              mission={selected}
              incident={incident}
              team={team}
              onTransition={(to, label) => transition(selected.id, to, label)}
              onAbort={() => abort(selected.id)}
              onReportProblem={() => reportProblem(selected.id)}
              onFieldUpdate={(id, data) => fieldUpdate(id, data)}
              onViewIncident={id => navigate(`/response/incidents/${id}`)}
              onViewMap={() => navigate('/response/map')}
              onVerify={() => navigate('/response/verification')}
            />
          )}
        </div>
      </div>

      {showCreate && (
        <CreateMissionModal
          incidents={incidents}
          teams={teams}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateMission}
        />
      )}
    </section>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck, Users } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useResponse } from '../context/ResponseContext';

export default function TeamsScreen() {
  const navigate = useNavigate();
  const { teams, missions } = useResponse();

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/response')}
            className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 hover:text-cyan-100"
          >
            <ArrowLeft className="h-4 w-4" /> RESPONSE
          </button>
          <div>
            <p className="font-heading text-base font-extrabold tracking-[0.14em] text-white">TEAM STATUS</p>
            <p className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">DEPLOYMENT GRID</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {teams.map((team) => {
          const assignedMissionCount = missions.filter(
            mission => mission.teamId === team.id || mission.teamId === team.name || mission.teamId === team.teamId
          ).length;

          return (
            <article key={team.name || team.id} className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono font-bold tracking-[0.14em] text-cyan-300">{team.id || team.name}</p>
                  <h2 className="mt-1 font-heading text-lg font-black text-white">{team.name}</h2>
                </div>
                <StatusBadge value={team.status || 'AVAILABLE'} />
              </div>

              <div className="mt-4 space-y-3 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{team.assignment || 'Staging area not assigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  <span>{assignedMissionCount} active mission{assignedMissionCount === 1 ? '' : 's'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{team.status === 'OFFLINE' ? 'Telemetry offline' : 'Telemetry synced'}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

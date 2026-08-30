import React from 'react';
import { useNavigate } from 'react-router-dom';
import SituationSummary from '../components/SituationSummary';
import CriticalIncidentCard from '../components/CriticalIncidentCard';
import IncidentFeed from '../components/IncidentFeed';
import OperationalMap from '../components/OperationalMap';
import DashboardVerificationQueue from '../components/DashboardVerificationQueue';
import TeamStatus from '../components/TeamStatus';
import AlertPanel from '../components/AlertPanel';
import { useResponse } from '../context/ResponseContext';
import { getCriticalIncidents, getVerificationQueue, getIncidentFeed, getMapNodes } from '../data/selectors';

export default function ResponseLandingScreen() {
  const navigate = useNavigate();
  const { incidents, teams, alerts, situationSummary, isLoading, apiConnected } = useResponse();
  const viewIncident = (id) => navigate(`/response/incidents/${id}`);

  const criticalList = getCriticalIncidents(incidents);
  const queueList = getVerificationQueue(incidents);
  const feedList = getIncidentFeed(incidents);
  const mapNodes = getMapNodes(incidents);

  if (isLoading) {
    return (
      <section className="space-y-4 animate-fade-in">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-center text-sm text-slate-300">
          Loading response dashboard…
        </div>
      </section>
    );
  }

  if (!apiConnected && incidents.length === 0 && teams.length === 0 && alerts.length === 0) {
    return (
      <section className="space-y-4 animate-fade-in">
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-6 text-center text-sm text-amber-200">
          Response data is unavailable right now. Check the backend connection and refresh to retry.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 animate-fade-in">
      <SituationSummary items={situationSummary} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,.8fr)]">
        <div className="space-y-5">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-sm font-extrabold tracking-wide text-white">CRITICAL INCIDENTS</h2>
              <span className="text-[10px] font-mono text-red-400">ACTION REQUIRED</span>
            </div>
            {criticalList.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400">
                No critical incidents are currently active.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {criticalList.map(incident => (
                  <CriticalIncidentCard key={incident.id} incident={incident} onView={viewIncident} />
                ))}
              </div>
            )}
          </section>
          <OperationalMap nodes={mapNodes} />
          <IncidentFeed items={feedList} />
        </div>
        <aside className="space-y-5">
          <DashboardVerificationQueue items={queueList} />
          <TeamStatus teams={teams} />
          <AlertPanel alerts={alerts} />
        </aside>
      </div>
    </section>
  );
}

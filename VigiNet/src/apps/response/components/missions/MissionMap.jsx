import React from 'react';
import OperationalMap from '../operationalMap/OperationalMap';
import { getIncidentMapNodes, getTeamMapNodes, getHazardZones } from '../../data/selectors';

// Reuses the existing mock OperationalMap. A mission contributes exactly one
// incident node and one team node; no separate map data model is created.
export default function MissionMap({ mission }) {
  const incidents = getIncidentMapNodes().filter(n => n.id === mission.incidentId);
  const teams = getTeamMapNodes().filter(t => t.id === `TEAM ${mission.teamId}`);
  const hazards = getHazardZones();
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <h2 className="font-heading text-sm font-extrabold text-white">OPERATIONAL MAP</h2>
      <div className="mt-3 h-56 overflow-hidden rounded-lg">
        <OperationalMap
          incidentNodes={incidents}
          teamNodes={teams}
          evidenceNodes={[]}
          hazards={hazards}
          layers={{ incidents: true, reports: false, teams: true, evidence: false, hazards: true }}
          selectedId={null}
          onSelect={() => {}}
          zoom={1}
        />
      </div>
    </section>
  );
}

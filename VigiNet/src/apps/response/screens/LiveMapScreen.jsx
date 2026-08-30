import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, Clock3, ShieldCheck } from 'lucide-react';
import useRealTimeClock from '../../../hooks/useRealTimeClock';
import { useResponse } from '../context/ResponseContext';
import { TEAM_CAPABILITIES } from '../data/mapMockData';
import {
  getIncidentMapNodes,
  getTeamMapNodes,
  getEvidenceMapNodes,
  getHazardZones,
  getIncidentById
} from '../data/selectors';
import OperationalMap from '../components/operationalMap/OperationalMap';
import MapLayerControls from '../components/operationalMap/MapLayerControls';
import MapLegend from '../components/operationalMap/MapLegend';
import MapControls from '../components/operationalMap/MapControls';
import MapFilters from '../components/operationalMap/MapFilters';
import MapObjectPanel from '../components/operationalMap/MapObjectPanel';
import MapSituationPanel from '../components/operationalMap/MapSituationPanel';

const UNVERIFIED = ['VERIFICATION REQUIRED', 'UNDER REVIEW', 'REPORTED', 'UNVERIFIED', 'IN VERIFICATION'];

function applyFilter(nodes, filter) {
  switch (filter) {
    case 'CRITICAL': return nodes.filter(n => n.kind === 'incident' && (n.priority === 'CRITICAL' || n.severity === 'CRITICAL'));
    case 'SERIOUS': return nodes.filter(n => n.kind === 'incident' && (n.priority === 'SERIOUS' || n.priority === 'HIGH'));
    case 'UNVERIFIED': return nodes.filter(n => n.kind === 'incident' && UNVERIFIED.includes(n.status));
    case 'VERIFIED': return nodes.filter(n => n.kind === 'incident' && n.status === 'VERIFIED');
    case 'TEAMS': return nodes.filter(n => n.kind === 'team');
    case 'EVIDENCE': return nodes.filter(n => n.kind === 'evidence');
    default: return nodes;
  }
}

export default function LiveMapScreen() {
  const navigate = useNavigate();
  const { time24, timezone } = useRealTimeClock();
  const { incidents, teams } = useResponse();
  const [layers, setLayers] = useState({ incidents: true, reports: true, teams: true, evidence: true, hazards: true });
  const [filter, setFilter] = useState('ALL');
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState(null);

  const incidentNodes = getIncidentMapNodes(incidents);
  const teamNodes = getTeamMapNodes(teams);
  const evidenceNodes = getEvidenceMapNodes(incidents);
  const hazards = getHazardZones();

  const visibleIncidents = applyFilter(incidentNodes, filter);
  const visibleTeams = applyFilter(teamNodes, filter);
  const visibleEvidence = applyFilter(evidenceNodes, filter);

  const toggleLayer = key => setLayers(l => ({ ...l, [key]: !l[key] }));

  let selectedObject = null;
  if (selected) {
    if (selected.kind === 'incident') {
      const d = getIncidentById(selected.id, incidents);
      if (d)
        selectedObject = {
          kind: 'incident',
          data: {
            id: d.id, type: d.type || d.title, priority: d.priority, status: d.status,
            location: d.location?.area || d.locationText, affectedArea: d.location?.affectedArea || '~1.0 km',
            reports: d.reports?.count ?? 0, evidence: d.evidence?.count ?? 0, confidence: d.assessment?.confidence || '80%'
          }
        };
    } else if (selected.kind === 'team') {
      const t = teams.find(x => x.name === selected.id || x.id === selected.id);
      if (t)
        selectedObject = {
          kind: 'team',
          data: { name: t.name || t.teamName || t.id, status: t.status, assignment: t.assignment || t.currentAssignment || 'Staging', capabilities: TEAM_CAPABILITIES[t.name] || t.capabilities || [] }
        };
    } else if (selected.kind === 'evidence') {
      const e = evidenceNodes.find(x => x.id === selected.id);
      if (e) selectedObject = { kind: 'evidence', data: e };
    }
  }

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
            <p className="font-heading text-base font-extrabold tracking-[0.14em] text-white">LIVE OPERATIONAL MAP</p>
            <p className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">GEOSPATIAL SITUATION AWARENESS</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="hidden items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-950/50 px-2 py-1 text-emerald-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> SYSTEM ONLINE
          </span>
          <span className="hidden items-center gap-1.5 text-slate-400 sm:flex"><Clock3 className="h-3 w-3" /> {time24} {timezone}</span>
          <span className="hidden items-center gap-1.5 text-slate-400 lg:flex"><ShieldCheck className="h-3 w-3" /> ROLE: FIELD RESPONDER</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <MapLayerControls layers={layers} onToggle={toggleLayer} />
          <MapSituationPanel />
          <MapLegend />
        </div>

        <div className="flex min-h-0 flex-col gap-3 lg:h-[calc(100vh-150px)]">
          <MapFilters active={filter} onChange={setFilter} />
          <div className="relative min-h-[60vh] flex-1 lg:min-h-0">
            <OperationalMap
              incidentNodes={visibleIncidents}
              teamNodes={visibleTeams}
              evidenceNodes={visibleEvidence}
              hazards={hazards}
              layers={layers}
              selectedId={selected ? selected.id : null}
              onSelect={setSelected}
              zoom={zoom}
            />
            <MapControls
              onZoomIn={() => setZoom(z => Math.min(2, z + 0.2))}
              onZoomOut={() => setZoom(z => Math.max(0.6, z - 0.2))}
              onReset={() => setZoom(1)}
            />
          </div>
        </div>

        <div className="lg:h-[calc(100vh-150px)] lg:overflow-y-auto">
          <MapObjectPanel
            selected={selectedObject}
            onViewIncident={id => navigate(`/response/incidents/${id}`)}
            onVerify={() => navigate('/response/verification')}
            onViewTeam={() => {}}
          />
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import IncidentMarker from './IncidentMarker';
import TeamMarker from './TeamMarker';
import EvidenceMarker from './EvidenceMarker';
import HazardOverlay from './HazardOverlay';

export default function OperationalMap({
  incidentNodes,
  teamNodes,
  evidenceNodes,
  hazards,
  layers,
  selectedId,
  onSelect,
  zoom
}) {
  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-xl border border-slate-800 bg-[#070d1a] shadow-lg">
      {/* grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(#16324f 1px,transparent 1px),linear-gradient(90deg,#16324f 1px,transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      {/* terrain suggestion */}
      <div className="absolute -left-10 top-1/3 h-72 w-72 rounded-full bg-cyan-900/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-900/20 blur-3xl" />
      <div className="absolute left-[20%] top-[60%] h-[40%] w-[60%] -rotate-6 rounded-[45%] border border-cyan-500/15 bg-cyan-950/15" />
      <div className="absolute left-[30%] top-[20%] h-px w-[45%] rotate-12 bg-cyan-500/20" />

      {/* zoomable content */}
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 150ms ease-out' }}
      >
        {layers.hazards && hazards.map(z => <HazardOverlay key={z.id} zone={z} />)}

        {layers.incidents &&
          incidentNodes.map(n => (
            <IncidentMarker
              key={n.id}
              node={n}
              selected={selectedId === n.id}
              onSelect={onSelect}
              showReports={layers.reports}
            />
          ))}

        {layers.teams &&
          teamNodes.map(n => (
            <TeamMarker key={n.id} node={n} selected={selectedId === n.id} onSelect={onSelect} />
          ))}

        {layers.evidence &&
          evidenceNodes.map(n => (
            <EvidenceMarker key={n.id} node={n} selected={selectedId === n.id} onSelect={onSelect} />
          ))}
      </div>

      {/* incident density hint */}
      <div className="pointer-events-none absolute left-3 top-3 rounded border border-slate-700 bg-slate-950/70 px-2 py-1 text-[9px] font-mono text-slate-400">
        INCIDENT DENSITY · <span className="text-amber-300">MODERATE</span>
      </div>
    </div>
  );
}

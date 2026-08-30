import React from 'react';
import { Navigation } from 'lucide-react';
import StatusBadge from '../StatusBadge';

export default function MissionListItem({ mission, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mission.id)}
      className={`w-full border-l-4 px-3 py-3 text-left transition ${
        selected
          ? 'border-l-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400/40'
          : 'border-l-slate-700 bg-slate-900/40 hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-bold text-cyan-300">{mission.id}</p>
        <StatusBadge value={mission.status} />
      </div>
      <p className="mt-0.5 truncate text-xs font-bold text-slate-100">{mission.title}</p>
      <p className="text-[10px] text-slate-400">{mission.location}</p>
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
        <StatusBadge value={mission.priority} />
        <span>Team {mission.teamId}</span>
        <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {mission.eta}</span>
      </div>
    </button>
  );
}

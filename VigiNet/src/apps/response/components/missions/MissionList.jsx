import React, { useState } from 'react';
import MissionListItem from './MissionListItem';

const FILTERS = ['ALL', 'CRITICAL', 'PENDING', 'EN ROUTE', 'ON SCENE', 'IN PROGRESS', 'COMPLETED'];

const matches = (mission, filter) => {
  if (filter === 'ALL') return true;
  if (filter === 'CRITICAL') return mission.priority === 'CRITICAL';
  if (filter === 'PENDING') return ['DRAFT', 'ASSIGNED', 'ACCEPTED'].includes(mission.status);
  return mission.status === filter;
};

export default function MissionList({ missions, selectedId, onSelect }) {
  const [filter, setFilter] = useState('ALL');
  const visible = missions.filter(m => matches(m, filter));
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/85 shadow-lg">
      <header className="border-b border-slate-800 px-4 py-3">
        <h2 className="font-heading text-sm font-extrabold tracking-wide text-white">MISSION LIST</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded border px-2 py-1 text-[9px] font-bold tracking-wider transition ${
                filter === f
                  ? 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>
      <div className="min-h-0 flex-1 divide-y divide-slate-800/70 overflow-y-auto">
        {visible.length === 0 ? (
          <p className="p-6 text-center text-[11px] text-slate-500">No missions match the filter.</p>
        ) : (
          visible.map(m => (
            <MissionListItem key={m.id} mission={m} selected={m.id === selectedId} onSelect={onSelect} />
          ))
        )}
      </div>
    </section>
  );
}

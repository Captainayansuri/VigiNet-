import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import VerificationQueueItem from './VerificationQueueItem';
import {
  verificationPriority,
  matchesFilter,
  searchIncidents,
  verificationFilters
} from '../../data/verificationMockData';

export default function VerificationQueue({ incidents, selectedId, onSelect }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    const filtered = incidents.filter(i => matchesFilter(i, filter));
    const searched = searchIncidents(filtered, search);
    return searched
      .map(i => ({ incident: i, priority: verificationPriority(i) }))
      .sort((a, b) => a.priority.tier - b.priority.tier || b.incident.reports.count - a.incident.reports.count);
  }, [incidents, filter, search]);

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/85 shadow-lg">
      <header className="border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-extrabold tracking-wide text-white">VERIFICATION QUEUE</h2>
          <span className="text-[9px] font-mono text-slate-500">{visible.length} ITEMS</span>
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="SEARCH INCIDENTS"
            aria-label="Search incidents"
            className="w-full rounded border border-slate-700 bg-slate-950 py-2 pl-8 pr-3 text-[11px] text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-500/50"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {verificationFilters.map(f => (
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
          <p className="p-6 text-center text-[11px] text-slate-500">No incidents match the current filter.</p>
        ) : (
          visible.map(({ incident, priority }) => (
            <VerificationQueueItem
              key={incident.id}
              incident={incident}
              priority={priority}
              selected={incident.id === selectedId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </section>
  );
}

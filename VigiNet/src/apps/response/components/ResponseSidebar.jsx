import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ClipboardCheck, Crosshair, FileCheck2, LayoutDashboard, Map, Radio, ShieldAlert, Users } from 'lucide-react';

const items = [
  ['OVERVIEW', LayoutDashboard, '/response'],
  ['INCIDENTS', AlertTriangle, '/response/incidents'],
  ['LIVE MAP', Map, '/response/live-map'],
  ['VERIFICATION', ClipboardCheck, '/response/verification'],
  ['MISSIONS', Crosshair, '/response/missions'],
  ['TEAMS', Users, '/response/teams'],
  ['EVIDENCE', FileCheck2, '/response/evidence'],
  ['ALERTS', Radio, '/response/alerts']
];

export default function ResponseSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isActive = label => {
    if (label === 'VERIFICATION') return path === '/response/verification';
    if (label === 'LIVE MAP') return path === '/response/live-map' || path === '/response/map';
    if (label === 'MISSIONS') return path === '/response/missions';
    if (label === 'TEAMS') return path === '/response/teams';
    if (label === 'EVIDENCE') return path === '/response/evidence';
    if (label === 'ALERTS') return path === '/response/alerts';
    if (label === 'OVERVIEW') return path === '/response' || path.startsWith('/response/incidents');
    if (label === 'INCIDENTS') return path === '/response/incidents' || path.startsWith('/response/incidents/');
    return false;
  };

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-800 bg-[#070b15] p-3 lg:block">
      <p className="px-3 pb-3 pt-1 text-[10px] font-mono font-bold tracking-widest text-slate-500">OPERATIONS</p>
      <nav className="space-y-1">
        {items.map(([label, Icon, route]) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(route)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-bold tracking-wide ${
              isActive(label)
                ? 'bg-cyan-500/12 text-cyan-300 ring-1 ring-cyan-500/25'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-8 rounded-lg border border-red-500/20 bg-red-950/20 p-3">
        <ShieldAlert className="h-4 w-4 text-red-400" />
        <p className="mt-2 text-[10px] font-mono font-bold text-red-300">5 CRITICAL INCIDENTS</p>
        <p className="mt-1 text-[10px] text-slate-500">Priority review active</p>
      </div>
    </aside>
  );
}

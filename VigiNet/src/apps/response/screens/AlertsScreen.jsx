import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BellRing, ChevronRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useResponse } from '../context/ResponseContext';

export default function AlertsScreen() {
  const navigate = useNavigate();
  const { alerts } = useResponse();

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
            <p className="font-heading text-base font-extrabold tracking-[0.14em] text-white">SYSTEM ALERTS</p>
            <p className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">LIVE INCIDENT NOTIFICATIONS</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {alerts.map((alert) => (
          <article key={alert.id || alert.title} className="rounded-xl border border-slate-800 bg-slate-900/85 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2">
                  <BellRing className="h-4 w-4 text-red-300" />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold tracking-[0.12em] text-red-300">{alert.area}</p>
                  <h2 className="mt-1 font-heading text-base font-black text-white">{alert.title}</h2>
                </div>
              </div>
              <StatusBadge value={alert.priority || 'ELEVATED'} />
            </div>

            <p className="mt-3 text-[11px] text-slate-300">{alert.message}</p>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-800 pt-3 text-[10px] font-mono text-slate-400">
              <span>{alert.incidentId ? `Linked incident: ${alert.incidentId}` : 'Monitoring only'}</span>
              <button type="button" className="inline-flex items-center gap-1 text-cyan-300">
                VIEW <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

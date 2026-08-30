import React from 'react';
import { ArrowLeft, FileImage, FileVideo, Mic, ShieldCheck } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useResponse } from '../context/ResponseContext';

const iconMap = {
  PHOTO: FileImage,
  VIDEO: FileVideo,
  VOICE: Mic,
};

export default function EvidenceScreen() {
  const navigate = useNavigate();
  const { incidents } = useResponse();

  const evidenceItems = incidents.flatMap((incident) =>
    (incident.evidence?.items || []).map((item, index) => ({
      incidentId: incident.id,
      incidentType: incident.type || incident.title,
      incidentPriority: incident.priority,
      incidentArea: incident.location?.area || 'Field Area',
      type: item[0],
      time: item[1],
      location: item[2],
      index,
    }))
  );

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
            <p className="font-heading text-base font-extrabold tracking-[0.14em] text-white">EVIDENCE STREAM</p>
            <p className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">CITIZEN + FIELD DATA</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {evidenceItems.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/85 p-6 text-sm text-slate-400">
            No evidence items are currently linked to active incidents.
          </div>
        ) : (
          evidenceItems.map((item) => {
            const Icon = iconMap[item.type] || ShieldCheck;
            return (
              <article key={`${item.incidentId}-${item.type}-${item.index}`} className="rounded-xl border border-slate-800 bg-slate-900/85 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-2">
                      <Icon className="h-4 w-4 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold tracking-[0.12em] text-purple-300">{item.incidentId}</p>
                      <p className="mt-1 font-heading text-sm font-black text-white">{item.incidentType}</p>
                    </div>
                  </div>
                  <StatusBadge value={item.incidentPriority} />
                </div>

                <div className="mt-4 grid gap-2 text-[11px] text-slate-300 sm:grid-cols-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Type</p>
                    <p className="mt-1 font-bold text-slate-200">{item.type}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Time</p>
                    <p className="mt-1 font-bold text-slate-200">{item.time}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Area</p>
                    <p className="mt-1 font-bold text-slate-200">{item.location}</p>
                  </div>
                </div>

                <p className="mt-3 text-[10px] text-slate-400">{item.incidentArea}</p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

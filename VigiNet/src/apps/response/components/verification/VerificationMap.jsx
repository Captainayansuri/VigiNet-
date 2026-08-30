import React from 'react';

export default function VerificationMap({ incident }) {
  const assigned = incident.team && incident.team.assigned;
  const nodes = [
    { label: 'INCIDENT', pos: 'left-[48%] top-[43%]', color: 'bg-red-500' },
    { label: 'CITIZEN REPORTS', pos: 'left-[27%] top-[30%]', color: 'bg-amber-400' },
    { label: 'EVIDENCE', pos: 'left-[38%] top-[70%]', color: 'bg-purple-400' },
    ...(assigned ? [{ label: 'RESPONSE TEAM', pos: 'left-[70%] top-[58%]', color: 'bg-blue-400' }] : [])
  ];
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 shadow-lg">
      <h2 className="font-heading text-sm font-extrabold text-white">OPERATIONAL MAP</h2>
      <p className="text-[10px] text-slate-500">Controlled mock geography · map provider pending</p>
      <div className="relative mt-3 h-56 overflow-hidden rounded-lg border border-slate-700 bg-[#09111f]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(#1e3a5f 1px,transparent 1px),linear-gradient(90deg,#1e3a5f 1px,transparent 1px)',
            backgroundSize: '34px 34px'
          }}
        />
        <div className="absolute left-[12%] top-[24%] h-[46%] w-[72%] rounded-[48%] border border-cyan-500/20 bg-cyan-950/30" />
        {nodes.map(n => (
          <div key={n.label} className={`absolute ${n.pos}`}>
            <i className={`block h-3.5 w-3.5 rounded-full border-2 border-slate-950 shadow-lg ${n.color}`} />
            <span className="absolute left-4 top-[-4px] whitespace-nowrap text-[9px] font-mono text-slate-200">{n.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-400 sm:grid-cols-4">
        <span><b className="block font-mono text-slate-500">LOCATION</b>{incident.location.area}</span>
        <span><b className="block font-mono text-slate-500">COORDINATES</b>{incident.location.coordinates}</span>
        <span><b className="block font-mono text-slate-500">ACCURACY</b>{incident.location.accuracy}</span>
        <span><b className="block font-mono text-slate-500">AFFECTED</b>{incident.location.affectedArea}</span>
      </div>
    </section>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import LowBatteryBanner from '../common/LowBatteryBanner';
import { AlertOctagon, LifeBuoy, MapPin, ChevronRight, Radio, Navigation, Clock } from 'lucide-react';
import useRealTimeClock from '../../hooks/useRealTimeClock';
import TimeService from '../../services/TimeService';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { 
    setActiveTab, 
    activeAlert, 
    locationState, 
    detectUserLocation, 
    reports, 
    setSelectedReportId 
  } = useApp();
  const { time24, timezone } = useRealTimeClock();
  const locationLabel = locationState.village || (locationState.lat != null
    ? `${locationState.lat.toFixed(4)}°, ${locationState.lng.toFixed(4)}°`
    : 'Location unavailable');

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Non-intrusive Low Battery Warning if Battery < 20% */}
      <LowBatteryBanner />
      <div className="text-center text-[10px] font-mono text-slate-500">DEVICE TIME {time24} {timezone}</div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/response')}
          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-500/15"
        >
          Responder Access
        </button>
      </div>

      {/* 1. CURRENT AREA & DISASTER STATUS BAR */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Current Area</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              {locationState.isLocating ? 'LOCATING YOU...' : locationLabel}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {locationState.status === 'APPROXIMATE' ? 'LOCATION APPROXIMATE' : locationState.lastKnown ? 'LAST KNOWN LOCATION' : locationState.lat != null ? 'LOCATION ACTIVE' : locationState.error || 'Tap Locate to use your device location'}
              {locationState.accuracyMeters != null && ` • ±${locationState.accuracyMeters}m`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={detectUserLocation}
          disabled={locationState.isLocating}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[11px] text-cyan-300 flex items-center gap-1 touch-active"
        >
          <Navigation className={`w-3.5 h-3.5 ${locationState.isLocating ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{locationState.isLocating ? 'LOCATING...' : 'Locate'}</span>
        </button>
      </div>

      {/* 2. ACTIVE EMERGENCY ALERT HEADER BANNER */}
      {activeAlert && (
        <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/70 border border-red-500/40 shadow-xl glow-red">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] tracking-wider animate-pulse">
                {activeAlert.levelText}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{TimeService.formatRelativeTime(activeAlert.createdAt)}</span>
            </div>
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
          </div>

          <h2 className="text-base font-extrabold text-white mt-2 font-heading">
            {activeAlert.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {activeAlert.description}
          </p>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-red-500/20">
            <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
              {locationState.lat != null ? `Your area • ${locationLabel}` : 'Location not attached'}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('safety')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View Guidance <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. PRIMARY ACTION TILES: REPORT NOW vs REQUEST EMERGENCY AID (Requirement 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* REPORT SOMETHING CTA */}
        <button
          type="button"
          onClick={() => setActiveTab('report')}
          className="w-full p-4 rounded-2xl bg-gradient-to-br from-cyan-950/90 to-slate-900 border-2 border-cyan-500/50 hover:border-cyan-400 text-left shadow-xl glow-cyan touch-active group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 rounded-xl bg-cyan-500 text-slate-950 font-black shadow-lg group-hover:scale-105 transition-transform">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              FAST REPORT (20s)
            </span>
          </div>

          <h3 className="text-lg font-black text-white font-heading tracking-wide">
            🚨 REPORT SOMETHING
          </h3>
          <p className="text-xs text-cyan-200/80 mt-1">
            Flooding, trapped victims, road blockage, fire, or hazards.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
            <span>START GROUND REPORT</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* REQUEST EMERGENCY AID CTA (Requirement 3: Distinct from Header "I NEED HELP") */}
        <button
          type="button"
          onClick={() => setActiveTab('sos')}
          className="w-full p-4 rounded-2xl bg-gradient-to-br from-red-950/90 to-slate-900 border-2 border-red-500/60 hover:border-red-400 text-left shadow-xl glow-red pulse-emergency touch-active group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 rounded-xl bg-red-600 text-white font-black shadow-lg group-hover:scale-105 transition-transform">
              <LifeBuoy className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
              PERSONAL SOS
            </span>
          </div>

          <h3 className="text-lg font-black text-white font-heading tracking-wide">
            🆘 REQUEST EMERGENCY AID
          </h3>
          <p className="text-xs text-red-200/80 mt-1">
            If you or your group are trapped or in personal danger.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:translate-x-1 transition-transform">
            <span>SEND SOS REQUEST</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* 4. RECENT ACTIVITY FEED */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recent Area Ground Activity
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('my_reports')}
            className="text-[11px] text-cyan-400 hover:underline font-semibold"
          >
            View All ({reports.length})
          </button>
        </div>

        <div className="space-y-2">
          {reports.slice(0, 3).map((report) => (
            <div
              key={report.id}
              onClick={() => {
                setSelectedReportId(report.id);
                setActiveTab('my_reports');
              }}
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all touch-active"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{report.incidentIcon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{report.incidentLabel}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      report.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      report.severity === 'SERIOUS' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>{report.village}</span>
                    <span>•</span>
                    <span className="font-mono">{report.createdAt ? TimeService.formatRelativeTime(report.createdAt) : report.timestamp}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {report.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useApp } from '../../context/AppContext';
import LocationPickerMap from '../common/LocationPickerMap';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  FileText, 
  WifiOff, 
  Radio, 
  AlertOctagon,
  Volume2
} from 'lucide-react';

export default function ReportDetailScreen() {
  const { selectedReport, setSelectedReportId, setActiveTab } = useApp();

  if (!selectedReport) return null;

  // Lifecycle steps order definition
  const ALL_STEPS = [
    { key: 'RECEIVED', label: 'Report Received', icon: Clock },
    { key: 'ANALYZING', label: 'Automated Analysis', icon: Radio },
    { key: 'UNDER_REVIEW', label: 'Under Command Review', icon: FileText },
    { key: 'VERIFIED', label: 'Field Verified', icon: ShieldCheck },
    { key: 'RESPONSE_DISPATCHED', label: 'Response Dispatched', icon: Truck }
  ];

  // Determine current active step index in timeline
  const currentStepIdx = ALL_STEPS.findIndex(s => s.key === selectedReport.status);

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setSelectedReportId(null)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1 text-xs touch-active"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>

        <span className="font-mono text-xs font-bold text-cyan-400">
          TIMELINE ID: {selectedReport.id}
        </span>
      </div>

      {/* Main Report Card Summary */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedReport.incidentIcon}</span>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">GROUND INCIDENT</span>
              <h2 className="text-base font-extrabold text-white font-heading">
                {selectedReport.incidentLabel}
              </h2>
            </div>
          </div>

          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
            selectedReport.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
            selectedReport.severity === 'SERIOUS' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
            'bg-slate-800 text-slate-300'
          }`}>
            {selectedReport.severity}
          </span>
        </div>

        {/* Location & Time Subline */}
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium truncate">{selectedReport.village}</span>
          </div>
          <span className="font-mono text-slate-400">{selectedReport.timestamp}</span>
        </div>

        {/* Offline Queued Indicator */}
        {selectedReport.isOfflineQueued && (
          <div className="p-2.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>Saved on Device - Waiting to Sync when reconnected</span>
          </div>
        )}
      </div>

      {/* STEP-BY-STEP LIFECYCLE TIMELINE (Requirement 18) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Incident Status Lifecycle</span>
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {ALL_STEPS.map((step, idx) => {
            const isCompleted = idx <= (currentStepIdx >= 0 ? currentStepIdx : 0);
            const isCurrent = idx === currentStepIdx;
            const historyItem = selectedReport.timeline?.find(t => t.status === step.key);
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative group">
                {/* Status Dot */}
                <div className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCurrent 
                    ? 'bg-cyan-500 border-cyan-400 glow-cyan animate-pulse' 
                    : isCompleted 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  {isCompleted && !isCurrent && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`text-xs font-extrabold ${isCompleted ? 'text-slate-100' : 'text-slate-500'}`}>
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {historyItem ? historyItem.description : 'Pending next stage verification.'}
                    </p>
                  </div>
                  {historyItem && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
                      {historyItem.time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAP LOCATION PREVIEW */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-300">Geospatial Report Pin</span>
        <LocationPickerMap
          lat={selectedReport.coordinates?.lat}
          lng={selectedReport.coordinates?.lng}
          accuracyMeters={selectedReport.accuracyMeters}
          interactive={false}
        />
      </div>

      {/* EVIDENCE PREVIEW */}
      {selectedReport.evidence && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-300">Evidence Record</span>
          <div className="flex items-center gap-3 text-xs text-cyan-300">
            <span>📷 {selectedReport.evidence.photosCount} Photos</span>
            {selectedReport.evidence.hasVoiceNote && (
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> Voice Note ({selectedReport.evidence.voiceNoteDuration})
              </span>
            )}
          </div>
          {selectedReport.evidence.message && (
            <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              "{selectedReport.evidence.message}"
            </p>
          )}
        </div>
      )}

    </div>
  );
}

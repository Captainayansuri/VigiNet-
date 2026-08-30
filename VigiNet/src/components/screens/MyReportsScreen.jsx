import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import useRealTimeClock from '../../hooks/useRealTimeClock';
import TimeService from '../../services/TimeService';
import ReportDetailScreen from './ReportDetailScreen';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  WifiOff, 
  ChevronRight, 
  PlusCircle, 
  ShieldAlert,
  Search
} from 'lucide-react';

export default function MyReportsScreen() {
  useRealTimeClock();
  const { 
    reports, 
    selectedReportId, 
    setSelectedReportId, 
    setActiveTab 
  } = useApp();

  const [filter, setFilter] = useState('ALL'); // ALL, QUEUED, VERIFIED

  // If a report is selected, show the detailed timeline screen
  if (selectedReportId) {
    return <ReportDetailScreen />;
  }

  const filteredReports = reports.filter(r => {
    if (filter === 'QUEUED') return r.isOfflineQueued;
    if (filter === 'VERIFIED') return r.status === 'VERIFIED' || r.status === 'RESPONSE_DISPATCHED';
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white font-heading uppercase tracking-wide">
            MY GROUND REPORTS
          </h2>
          <p className="text-xs text-slate-400">Track verification & emergency response lifecycle</p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('report')}
          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md glow-cyan touch-active"
        >
          <PlusCircle className="w-4 h-4" />
          <span>NEW REPORT</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
            filter === 'ALL' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ALL ({reports.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('VERIFIED')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
            filter === 'VERIFIED' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          VERIFIED ({reports.filter(r => r.status === 'VERIFIED' || r.status === 'RESPONSE_DISPATCHED').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('QUEUED')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
            filter === 'QUEUED' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          QUEUED ({reports.filter(r => r.isOfflineQueued).length})
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <FileText className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-sm font-bold text-slate-300">No reports found</h3>
          <p className="text-xs text-slate-500">You haven't submitted any reports matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReportId(report.id)}
              className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-lg touch-active space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{report.incidentIcon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">{report.id}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        report.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        report.severity === 'SERIOUS' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 font-heading">
                      {report.incidentLabel}
                    </h3>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>

              {/* Details Sub-row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>📍 {report.village}</span>
                  <span>•</span>
                  <span className="font-mono">{report.createdAt ? TimeService.formatRelativeTime(report.createdAt) : report.timestamp}</span>
                </div>

                {report.isOfflineQueued ? (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> WAITING SYNC
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    ● {report.status.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

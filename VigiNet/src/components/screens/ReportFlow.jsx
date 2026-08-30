import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INCIDENT_TYPES, SEVERITY_OPTIONS } from '../../data/mockData';
import LocationPickerMap from '../common/LocationPickerMap';
import VoiceRecorder from '../common/VoiceRecorder';
import PhotoCapture from '../common/PhotoCapture';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  AlertTriangle, 
  Send, 
  Edit3,
  WifiOff,
  Navigation,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function ReportFlow() {
  const { 
    setActiveTab, 
    addReport, 
    locationState, 
    detectUserLocation, 
    isOnline, 
    setSelectedReportId 
  } = useApp();

  const [step, setStep] = useState(1);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [reportLocation, setReportLocation] = useState({
    lat: locationState.lat,
    lng: locationState.lng,
    village: locationState.village,
    district: locationState.district,
    accuracyMeters: locationState.accuracyMeters,
    customNotes: ''
  });
  const [severity, setSeverity] = useState('NOT_SURE');
  const [photos, setPhotos] = useState([]);
  const [voiceNote, setVoiceNote] = useState(null);
  const [notes, setNotes] = useState('');
  const [submittedReport, setSubmittedReport] = useState(null);
  const [isManualLocation, setIsManualLocation] = useState(false);

  useEffect(() => {
    // A report needs a fresh fix; this is the only automatic request in this flow.
    detectUserLocation({ fresh: true });
  }, []);

  useEffect(() => {
    if (!isManualLocation && locationState.lat != null) {
      setReportLocation(prev => ({ ...prev, lat: locationState.lat, lng: locationState.lng, village: locationState.village, district: locationState.district, accuracyMeters: locationState.accuracyMeters }));
    }
  }, [locationState.lat, locationState.lng, locationState.accuracyMeters, isManualLocation]);

  const progressPercent = Math.min(100, Math.round((step / 5) * 100));

  const handleNextStep = () => {
    if (step === 1 && !selectedIncident) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
    else setActiveTab('home');
  };

  const handleSubmitReport = async () => {
    const reportData = {
      type: selectedIncident.id,
      title: selectedIncident.label,
      incidentType: selectedIncident.id,
      incidentLabel: selectedIncident.label,
      incidentIcon: selectedIncident.icon,
      severity: severity,
      description: notes || `Citizen report for ${selectedIncident.label}.`,
      village: reportLocation.village || locationState.village,
      district: reportLocation.district || locationState.district,
      locationText: reportLocation.customNotes || reportLocation.village || 'Detected Coordinates',
      latitude: reportLocation.lat,
      longitude: reportLocation.lng,
      coordinates: { lat: reportLocation.lat, lng: reportLocation.lng },
      accuracyMeters: reportLocation.accuracyMeters,
      evidence: {
        photosCount: photos.length,
        videosCount: photos.filter(p => p.type === 'video').length,
        hasVoiceNote: !!voiceNote,
        voiceNoteDuration: voiceNote ? `${voiceNote.durationSeconds}s` : null,
        message: notes || 'No extra commentary provided.',
        photos: photos.map(p => ({ id: p.id, name: p.name, type: p.type, url: p.url })),
        voiceNote: voiceNote ? { url: voiceNote.url, durationSeconds: voiceNote.durationSeconds } : null,
      }
    };

    try {
      const newReport = await addReport(reportData);
      setSubmittedReport(newReport);
      setStep(6);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti launch error:', e);
      }
    } catch (error) {
      console.error('Report submission failed', error);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Back & Progress Bar (Steps 1-5) */}
      {step <= 5 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-xs touch-active"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="font-mono text-xs font-bold text-cyan-400">
              STEP {step} OF 5
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 shadow-sm shadow-cyan-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STEP 1: WHAT DID YOU SEE? */}
      {step === 1 && (
        <div className="space-y-3">
          <div className="text-center py-2">
            <h2 className="text-lg font-black text-white font-heading uppercase tracking-wide">
              STEP 1: WHAT DID YOU SEE?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select the primary incident happening around you
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {INCIDENT_TYPES.map((type) => {
              const isSelected = selectedIncident?.id === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedIncident(type)}
                  className={`p-3.5 rounded-2xl text-left flex flex-col justify-between transition-all touch-active border ${
                    isSelected 
                      ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/40 glow-cyan scale-[1.02]' 
                      : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{type.icon}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100 font-heading leading-tight">
                      {type.label}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {type.sublabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!selectedIncident}
            onClick={handleNextStep}
            className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all touch-active ${
              selectedIncident 
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 glow-cyan' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>NEXT: CONFIRM LOCATION</span>
          </button>
        </div>
      )}

      {/* STEP 2: LOCATION (Requirement 8 - Resilient GPS & Fallback States) */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-center py-1">
            <h2 className="text-lg font-black text-white font-heading uppercase tracking-wide">
              STEP 2: INCIDENT LOCATION
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify GPS position or select location manually
            </p>
          </div>

          {/* GPS Status Banner */}
          {locationState.error ? (
            <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <AlertCircle className="w-4 h-4" /> LOCATION UNAVAILABLE
                </span>
                <button
                  type="button"
                  onClick={() => detectUserLocation({ fresh: true })}
                  disabled={locationState.isLocating}
                  className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${locationState.isLocating ? 'animate-spin' : ''}`} />
                  <span>TRY AGAIN</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-300/90 leading-tight">
                {locationState.error}
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">LOCATION DETECTED</span>
                <p className="font-bold text-slate-100">{locationState.lat != null ? `${locationState.lat.toFixed(4)}°, ${locationState.lng.toFixed(4)}°` : 'GETTING YOUR LOCATION...'}</p>
              </div>
              <span className="font-mono text-cyan-400 text-xs bg-cyan-950 px-2 py-1 rounded border border-cyan-800">
                ±{locationState.accuracyMeters}m
              </span>
            </div>
          )}

          {/* Interactive Leaflet Map */}
          {reportLocation.lat != null && <LocationPickerMap
            lat={reportLocation.lat}
            lng={reportLocation.lng}
            accuracyMeters={reportLocation.accuracyMeters}
            onLocationChange={(newLat, newLng) => {
              setReportLocation(prev => ({
                ...prev,
                lat: newLat,
                lng: newLng,
                village: '',
                district: '',
                accuracyMeters: null
              }));
              setIsManualLocation(true);
            }}
          />}

          {/* Landmark Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Village / Landmark Details (Optional)</span>
            </label>
            <input
              type="text"
              value={reportLocation.customNotes}
              onChange={(e) => { setIsManualLocation(true); setReportLocation(prev => ({ ...prev, customNotes: e.target.value })); }}
              placeholder="e.g. Near Community Hall, Submerged Old Bridge..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg glow-cyan touch-active"
          >
            <span>NEXT: ASSESS SEVERITY</span>
          </button>
        </div>
      )}

      {/* STEP 3: SEVERITY (Requirement 5 - Includes NOT SURE) */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="text-center py-1">
            <h2 className="text-lg font-black text-white font-heading uppercase tracking-wide">
              STEP 3: HOW SERIOUS IS IT?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose the severity level. If unsure, select "NOT SURE".
            </p>
          </div>

          <div className="space-y-2.5">
            {SEVERITY_OPTIONS.map((opt) => {
              const isSelected = severity === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSeverity(opt.id)}
                  className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all touch-active ${
                    isSelected
                      ? `${opt.colorClass} ring-2 ring-cyan-500/40 glow-cyan scale-[1.01]`
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 rounded-full ${opt.indicatorBg} shrink-0`}></span>
                    <div>
                      <h4 className="text-sm font-extrabold font-heading tracking-wide">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg glow-cyan touch-active"
          >
            <span>NEXT: ADD EVIDENCE</span>
          </button>
        </div>
      )}

      {/* STEP 4: EVIDENCE CAPTURE (Requirement 6 - Optional + Safety Warning) */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="text-center py-1">
            <h2 className="text-lg font-black text-white font-heading uppercase tracking-wide">
              STEP 4: ADD WHAT YOU SEE
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add photos, video or voice to help responders understand what you're seeing.
            </p>
          </div>

          {/* Photo & Video Uploader */}
          <PhotoCapture photos={photos} onPhotosChange={setPhotos} />

          {/* Voice Recorder */}
          <VoiceRecorder 
            onVoiceRecorded={setVoiceNote} 
            onVoiceDeleted={() => setVoiceNote(null)} 
          />

          {/* Text Message Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Water level rising fast, 3 adults stranded on roof..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg glow-cyan touch-active"
          >
            <span>NEXT: REVIEW & SUBMIT</span>
          </button>
        </div>
      )}

      {/* STEP 5: REVIEW REPORT (Requirement 9) */}
      {step === 5 && (
        <div className="space-y-4">
          <div className="text-center py-1">
            <h2 className="text-lg font-black text-white font-heading uppercase tracking-wide">
              STEP 5: REVIEW REPORT
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Please double check details before submitting
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedIncident?.icon}</span>
                <div>
                  <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">INCIDENT</span>
                  <h3 className="text-base font-extrabold text-white font-heading">
                    {selectedIncident?.label}
                  </h3>
                </div>
              </div>

              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                severity === 'SERIOUS' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                severity === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                'bg-slate-800 text-slate-300'
              }`}>
                {severity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] font-mono text-slate-400">LOCATION</span>
                <p className="font-bold text-slate-200 mt-0.5 truncate">
                  {reportLocation.village}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] font-mono text-slate-400">TIMESTAMP</span>
                <p className="font-bold text-slate-200 mt-0.5 font-mono">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs">
              <span className="text-[10px] font-mono text-slate-400">EVIDENCE ATTACHED</span>
              <div className="flex items-center gap-3 mt-1 font-semibold text-cyan-300">
                <span>📷 {photos.length} Photo/Video</span>
                <span>🎙 {voiceNote ? '1 Voice Note' : 'No Voice'}</span>
              </div>
              {notes && (
                <p className="text-[11px] text-slate-300 italic mt-1.5 border-t border-slate-850 pt-1">
                  "{notes}"
                </p>
              )}
            </div>
          </div>

          {!isOnline && (
            <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>Offline Mode: You can still create a report. It will be sent automatically when connection returns.</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1 touch-active"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>EDIT</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitReport}
              className="col-span-2 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl glow-cyan touch-active"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>SUBMIT REPORT</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: SUBMISSION CONFIRMATION RECEIPT (Requirement 10) */}
      {step === 6 && submittedReport && (
        <div className="space-y-4 text-center py-2 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl glow-emerald">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white font-heading tracking-wide">
              ✓ REPORT RECEIVED
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
              Your ground information has been sent to the emergency response team.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-xs mx-auto text-left space-y-2.5 shadow-lg">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-[11px] font-mono text-slate-400">REPORT ID</span>
              <span className="text-sm font-mono font-extrabold text-cyan-400">{submittedReport.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-400">STATUS</span>
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                ● RECEIVED
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-400">STORAGE</span>
              <span className="text-[11px] font-mono text-slate-300">
                {submittedReport.isOfflineQueued ? 'SAVED ON DEVICE' : 'CONTROL NODE SYNCED'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-[11px] text-slate-400 max-w-xs mx-auto">
            ℹ️ <span className="font-semibold text-slate-300">Note:</span> Verification will happen in the background by regional officers. You can track updates in "MY REPORTS".
          </div>

          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedReportId(submittedReport.id);
                setActiveTab('my_reports');
              }}
              className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs touch-active"
            >
              TRACK STATUS
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setSelectedIncident(null);
                setPhotos([]);
                setVoiceNote(null);
                setNotes('');
                setActiveTab('home');
              }}
              className="py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs touch-active"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

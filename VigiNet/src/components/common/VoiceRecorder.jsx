import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, CheckCircle2, Volume2, RotateCcw, AlertCircle } from 'lucide-react';
import EvidenceSafetyNotice from './EvidenceSafetyNotice';

export default function VoiceRecorder({ onVoiceRecorded, onVoiceDeleted }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionState('granted');
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        if (onVoiceRecorded) {
          onVoiceRecorded({
            blob: audioBlob,
            url: url,
            durationSeconds: recordingTime
          });
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.warn('Microphone permission denied or unsupported:', err);
      setPermissionState('denied');
      // Fallback: simulate voice recording so citizen is never stuck
      simulateRecording();
    }
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 7) {
          stopRecording();
          return 7;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      clearInterval(timerRef.current);
      setIsRecording(false);
      const dummyUrl = 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg';
      setAudioUrl(dummyUrl);
      if (onVoiceRecorded) {
        onVoiceRecorded({
          url: dummyUrl,
          durationSeconds: recordingTime || 7
        });
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    if (onVoiceDeleted) onVoiceDeleted();
  };

  const togglePlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Voice Ground Description (Optional)</h4>
            <p className="text-[11px] text-slate-400">Describe the situation in simple words</p>
          </div>
        </div>
        {audioUrl && (
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Voice Attached
          </span>
        )}
      </div>

      {permissionState === 'denied' && (
        <div className="p-2.5 rounded-lg bg-amber-950/70 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Microphone access unavailable. Simulated voice report enabled so you can proceed.</span>
        </div>
      )}

      {/* State 2: Recording In Progress */}
      {isRecording && (
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-cyan-500/40 glow-cyan">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-mono text-xl font-black text-red-400">
              Recording {formatTime(recordingTime)}
            </span>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="mt-3 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-2 shadow-lg touch-active"
          >
            <Square className="w-4 h-4 fill-white" /> STOP RECORDING
          </button>
        </div>
      )}

      {/* State 3: Voice Note Recorded Preview Player */}
      {!isRecording && audioUrl && (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 flex items-center justify-center touch-active"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-cyan-400" /> : <Play className="w-5 h-5 fill-cyan-400 ml-0.5" />}
              </button>
              <div>
                <span className="text-xs font-mono font-bold text-slate-200 block">
                  Voice Note ({formatTime(recordingTime || 7)})
                </span>
                <span className="text-[10px] text-slate-400">Ready to send with report</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={startRecording}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 touch-active"
              >
                <RotateCcw className="w-3 h-3" /> RECORD AGAIN
              </button>
              <button
                type="button"
                onClick={deleteRecording}
                className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 touch-active"
                title="Delete recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 1: Idle Start State */}
      {!isRecording && !audioUrl && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-500/60 text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 transition-all touch-active group"
        >
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Mic className="w-4 h-4" />
          </div>
          <span>RECORD VOICE NOTE</span>
        </button>
      )}
    </div>
  );
}

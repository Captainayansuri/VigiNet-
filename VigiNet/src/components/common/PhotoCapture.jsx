import React, { useState, useRef } from 'react';
import { Camera, Video, Trash2, CheckCircle, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import EvidenceSafetyNotice from './EvidenceSafetyNotice';

const PRESET_DISASTER_PHOTOS = [
  {
    id: 'p1',
    name: 'Flood Submerged Street',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    type: 'photo'
  },
  {
    id: 'p2',
    name: 'Trapped House Rooftop',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    type: 'photo'
  },
  {
    id: 'p3',
    name: 'Fallen Tree & Debris',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    type: 'photo'
  }
];

export default function PhotoCapture({ photos = [], onPhotosChange }) {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [showPresets, setShowPresets] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map(file => ({
      id: 'img_' + Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      type: file.type.startsWith('video') ? 'video' : 'photo'
    }));

    onPhotosChange([...photos, ...newPhotos]);
  };

  const addPresetPhoto = (preset) => {
    if (photos.some(p => p.url === preset.url)) return;
    onPhotosChange([...photos, preset]);
  };

  const removePhoto = (id) => {
    onPhotosChange(photos.filter(p => p.id !== id));
  };

  return (
    <div className="w-full rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Photo / Video Evidence (Optional)</h4>
            <p className="text-[11px] text-slate-400">Add photos or video to help responders understand</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md">
          {photos.length} Attached
        </span>
      </div>

      {/* Safety Notice Banner (Requirement 6) */}
      <EvidenceSafetyNotice />

      {/* Hidden Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Action Touch Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="py-3 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all touch-active"
        >
          <Camera className="w-4 h-4" />
          <span>TAKE PHOTO</span>
        </button>

        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all touch-active"
        >
          <Video className="w-4 h-4 text-amber-400" />
          <span>RECORD VIDEO</span>
        </button>
      </div>

      {/* Sample Disaster Photo Selector */}
      <div>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="w-full py-1.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[11px] font-medium text-slate-400 hover:text-slate-200 flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Use Sample Disaster Photos (Fast Testing)</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">{showPresets ? '▲ Hide' : '▼ View Samples'}</span>
        </button>

        {showPresets && (
          <div className="grid grid-cols-3 gap-2 mt-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
            {PRESET_DISASTER_PHOTOS.map((preset) => {
              const isSelected = photos.some(p => p.url === preset.url);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => addPresetPhoto(preset)}
                  className={`relative rounded-lg overflow-hidden border text-left group transition-all ${
                    isSelected ? 'border-cyan-400 ring-2 ring-cyan-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-16 object-cover" />
                  <div className="p-1 bg-slate-900/90 text-[9px] text-slate-300 font-medium truncate">
                    {preset.name}
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-cyan-500 text-slate-950 p-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Attached Media Previews with RETAKE / REMOVE */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
          {photos.map((item) => (
            <div key={item.id} className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
              {item.type === 'video' ? (
                <div className="w-full h-20 bg-slate-900 flex flex-col items-center justify-center text-amber-400">
                  <Video className="w-6 h-6" />
                  <span className="text-[9px] text-slate-400 mt-1">Video</span>
                </div>
              ) : (
                <img src={item.url} alt="Evidence preview" className="w-full h-20 object-cover" />
              )}
              
              <div className="absolute bottom-0 inset-x-0 p-1 bg-slate-950/90 flex items-center justify-between">
                <span className="text-[9px] font-mono text-cyan-400 font-bold">ATTACHED</span>
                <button
                  type="button"
                  onClick={() => removePhoto(item.id)}
                  className="text-red-400 hover:text-white p-0.5"
                  title="Remove / Retake"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

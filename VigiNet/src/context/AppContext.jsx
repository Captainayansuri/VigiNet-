import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import ReportService from '../services/ReportService';
import LocationService from '../services/LocationService';
import ShelterService from '../services/ShelterService';
import HelplineService from '../services/HelplineService';
import BatteryService from '../services/BatteryService';
import NetworkService from '../services/NetworkService';
import { ACTIVE_ALERT } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation tab: 'home' | 'report' | 'my_reports' | 'safety' | 'sos'
  const [activeTab, setActiveTab] = useState('home');
  
  // Offline & Connectivity Management
  const [isBrowserOnline, setIsBrowserOnline] = useState(NetworkService.isOnline);
  const isOnline = isBrowserOnline;
  const [networkNotice, setNetworkNotice] = useState('');

  // Developer Controls Visibility Toggle (Keeps public UI clean)
  const [showDevControls, setShowDevControls] = useState(false);

  // Device Frame Preview Switcher for Mobile Testing (responsive, iphone15, small320)
  const [deviceFrame, setDeviceFrame] = useState('responsive');

  // Onboarding Modal State
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Reports & Offline Queue powered by ReportService
  const [reports, setReports] = useState(() => ReportService.getReports());
  const [offlineQueue, setOfflineQueue] = useState(() => ReportService.getOfflineQueue());

  // Selected Report for Timeline Detail View
  const [selectedReportId, setSelectedReportId] = useState(null);

  // Battery Status State (Requirement 23)
  const [batteryState, setBatteryState] = useState({
    supported: false,
    level: 100,
    isCharging: false,
    isLowBattery: false
  });

  // User Geolocation State
  const [locationState, setLocationState] = useState({
    lat: null, lng: null, village: '', district: '', accuracyMeters: null,
    isLocating: false,
    error: null, status: 'IDLE', isManual: false, lastKnown: false,
    errorType: null,
    manualAddress: ''
  });

  // Active Disaster Alert State
  const [activeAlert] = useState(ACTIVE_ALERT);

  // Shelters & Helplines
  const [shelters] = useState(() => ShelterService.getShelters());
  const [helplines] = useState(() => HelplineService.getContacts());

  // Check Battery Status on Mount
  useEffect(() => {
    BatteryService.getBatteryStatus().then(status => {
      setBatteryState(status);
    });
  }, []);

  // Real Online/Offline Event Listeners
  useEffect(() => {
    return NetworkService.onTransition((online, transition) => {
      setIsBrowserOnline(online);
      setNetworkNotice(transition === 'LOST'
        ? 'You are offline. Reports will be saved and synced when connection returns.'
        : 'Connection restored. Syncing pending reports...');
      window.setTimeout(() => setNetworkNotice(''), 4500);
    });
  }, []);



  // Resilient GPS Location Fetch using LocationService
  const detectUserLocation = async ({ fresh = false } = {}) => {
    setLocationState(prev => ({ ...prev, isLocating: true, status: 'LOCATING', error: null, errorType: null }));

    const res = await LocationService.getCurrentLocation({ fresh });

    if (res.success) {
      setLocationState(prev => ({
        ...prev,
        lat: res.lat,
        lng: res.lng,
        accuracyMeters: res.accuracyMeters,
        village: '', district: '',
        isLocating: false,
        error: null, errorType: null,
        status: res.accuracyMeters > 100 ? 'APPROXIMATE' : 'ACTIVE',
        isManual: false, lastKnown: !isBrowserOnline
      }));
    } else {
      setLocationState(prev => ({
        ...prev,
        isLocating: false,
        error: res.message,
        errorType: res.errorType,
        status: res.errorType === 'PERMISSION_DENIED' ? 'DENIED' : 'UNAVAILABLE'
      }));
    }
  };

  // Add a new ground report
  const addReport = async (newReportData) => {
    const newReport = await ReportService.createReport(newReportData, isOnline);
    setReports(ReportService.getReports());
    setOfflineQueue(ReportService.getOfflineQueue());
    return newReport;
  };

  // Submit Urgent SOS Request ("I Need Help")
  const submitSos = async (sosData) => {
    const sosDataPayload = {
      incidentType: 'people_trapped',
      incidentLabel: `EMERGENCY SOS: ${sosData.needLabel || 'Rescue Needed'}`,
      incidentIcon: '🆘',
      severity: 'CRITICAL',
      village: locationState.village,
      district: locationState.district,
      locationText: sosData.locationDetails || locationState.village,
      coordinates: { lat: locationState.lat, lng: locationState.lng },
      accuracyMeters: locationState.accuracyMeters,
      evidence: {
        photosCount: 0,
        videosCount: 0,
        hasVoiceNote: false,
        message: `[SOS EMERGENCY AID REQUEST] Victims: ${sosData.peopleCount || 1}. Immediate Danger: ${sosData.isImmediateDanger ? 'YES' : 'NO'}. Need: ${sosData.needLabel}`
      }
    };

    const sosReport = await ReportService.createReport(sosDataPayload, isOnline);
    setReports(ReportService.getReports());
    setOfflineQueue(ReportService.getOfflineQueue());
    return sosReport;
  };

// Prevent multiple sync attempts at the same time
const isSyncingRef = useRef(false);

// Sync Offline Queue
const triggerSync = async () => {
  if (isSyncingRef.current) return;

  isSyncingRef.current = true;

  try {
    const updated = await ReportService.syncQueue();

    setReports(updated);
    setOfflineQueue(ReportService.getOfflineQueue());
  } finally {
    isSyncingRef.current = false;
  }
};
  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      triggerSync();
    }
  }, [isOnline, offlineQueue.length]);

  const selectedReport = reports.find(r => r.id === selectedReportId) || null;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isOnline,
        networkNotice,
        showDevControls,
        setShowDevControls,
        deviceFrame,
        setDeviceFrame,
        showOnboarding,
        setShowOnboarding,
        reports,
        offlineQueue,
        selectedReportId,
        setSelectedReportId,
        selectedReport,
        locationState,
        setLocationState,
        detectUserLocation,
        activeAlert,
        shelters,
        helplines,
        batteryState,
        addReport,
        submitSos,
        triggerSync
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

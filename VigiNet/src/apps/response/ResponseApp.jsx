import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import ResponseShell from './layouts/ResponseShell';
import ResponseLandingScreen from './screens/ResponseLandingScreen';
import IncidentDetailsScreen from './screens/IncidentDetailsScreen';
import VerificationCenterScreen from './screens/VerificationCenterScreen';
import LiveMapScreen from './screens/LiveMapScreen';
import MissionsScreen from './screens/MissionsScreen';
import TeamsScreen from './screens/TeamsScreen';
import EvidenceScreen from './screens/EvidenceScreen';
import AlertsScreen from './screens/AlertsScreen';
import { ResponseProvider, useResponse } from './context/ResponseContext';
import { incidentById } from './data/responseMockData';

function ResponseIncidentRoute() {
  const navigate = useNavigate();
  const { incidentId } = useParams();
  const incidentIdParam = incidentId ? decodeURIComponent(incidentId) : null;
  const { incidents, getIncident } = useResponse();
  const [loadedIncident, setLoadedIncident] = useState(
    incidentIdParam ? incidents.find(i => i.id === incidentIdParam || i.incidentCode === incidentIdParam) || incidentById[incidentIdParam] || null : null
  );

  useEffect(() => {
    if (!incidentIdParam) {
      setLoadedIncident(null);
      return;
    }

    getIncident(incidentIdParam).then(inc => {
      if (inc) setLoadedIncident(inc);
    });
  }, [incidentIdParam, getIncident]);

  if (!incidentIdParam) {
    return <Navigate to="/response" replace />;
  }

  if (!loadedIncident) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-8">
          <p className="font-heading text-lg font-black text-white">INCIDENT NOT FOUND</p>
          <p className="mt-2 text-xs text-slate-400">Incident #{incidentIdParam} could not be located.</p>
          <button
            onClick={() => navigate('/response')}
            className="mt-4 rounded bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950"
          >
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return <IncidentDetailsScreen incident={loadedIncident} onBack={() => navigate('/response')} />;
}

function ResponseAppContent() {
  return (
    <ResponseShell>
      <Routes>
        <Route path="/" element={<ResponseLandingScreen />} />
        <Route path="/incidents" element={<ResponseLandingScreen />} />
        <Route path="/incidents/:incidentId" element={<ResponseIncidentRoute />} />
        <Route path="/verification" element={<VerificationCenterScreen />} />
        <Route path="/live-map" element={<LiveMapScreen />} />
        <Route path="/map" element={<LiveMapScreen />} />
        <Route path="/missions" element={<MissionsScreen />} />
        <Route path="/teams" element={<TeamsScreen />} />
        <Route path="/evidence" element={<EvidenceScreen />} />
        <Route path="/alerts" element={<AlertsScreen />} />
        <Route path="*" element={<Navigate to="/response" replace />} />
      </Routes>
    </ResponseShell>
  );
}

export default function ResponseApp() {
  return (
    <ResponseProvider>
      <ResponseAppContent />
    </ResponseProvider>
  );
}

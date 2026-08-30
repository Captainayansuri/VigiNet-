import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchIncidents,
  fetchIncidentById,
  verifyIncidentApi,
  fetchMissions,
  createMissionApi,
  updateMissionStatusApi,
  submitFieldUpdateApi,
  fetchTeams,
  fetchAlerts,
} from '../services/responseApiService';
import { responseIncidents, teams as seedTeams, alerts as seedAlerts } from '../data/responseMockData';
import { seedMissions } from '../data/missionMockData';

const ResponseContext = createContext();

export const ResponseProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [missions, setMissions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [incData, teamData, misData, altData] = await Promise.all([
        fetchIncidents(),
        fetchTeams(),
        fetchMissions(),
        fetchAlerts(),
      ]);

      setIncidents(Array.isArray(incData) ? incData : []);
      setTeams(Array.isArray(teamData) ? teamData : []);
      setMissions(Array.isArray(misData) ? misData : []);
      setAlerts(Array.isArray(altData) ? altData : []);
      setApiConnected(true);
    } catch (err) {
      console.warn('[ResponseContext] API sync failed; showing empty operational state:', err.message);
      setIncidents([]);
      setTeams([]);
      setMissions([]);
      setAlerts([]);
      setApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    const interval = window.setInterval(() => {
      loadAllData();
    }, 15000);
    return () => window.clearInterval(interval);
  }, [loadAllData]);

  // Derived Situation Summary
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' || i.severity === 'CRITICAL').length;
  const unverifiedCount = incidents.filter(i => i.status === 'VERIFICATION REQUIRED' || i.status === 'UNDER REVIEW' || i.status === 'IN VERIFICATION').length;
  const deployedTeamsCount = teams.filter(t => t.status === 'DEPLOYED' || t.status === 'EN ROUTE').length;
  const availableTeamsCount = teams.filter(t => t.status === 'AVAILABLE').length;

  const situationSummary = [
    { label: 'ACTIVE INCIDENTS', value: String(incidents.length).padStart(2, '0'), detail: 'Across operational sectors', tone: 'cyan' },
    { label: 'CRITICAL', value: String(criticalCount).padStart(2, '0'), detail: 'Immediate action required', tone: 'red' },
    { label: 'UNDER VERIFICATION', value: String(unverifiedCount).padStart(2, '0'), detail: 'Review in progress', tone: 'amber' },
    { label: 'TEAMS DEPLOYED', value: String(deployedTeamsCount).padStart(2, '0'), detail: `${availableTeamsCount} available for staging`, tone: 'blue' },
  ];

  // Actions
  const getIncident = useCallback(async (id) => {
    const local = incidents.find(i => i.id === id || i.incidentCode === id);
    if (local) return local;
    return await fetchIncidentById(id);
  }, [incidents]);

  const updateIncidentStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.warn('[ResponseContext] Status update API notice:', e.message);
    }

    setIncidents(prev =>
      prev.map(i => (i.id === id || i.incidentCode === id ? { ...i, status: newStatus } : i))
    );
  };

  const assignTeam = async (incidentId, teamId) => {
    const targetTeam = teams.find(t => t.id === teamId || t.name === teamId);
    const teamName = targetTeam ? targetTeam.name : teamId;

    try {
      await createMissionApi({
        incidentId,
        teamId,
        title: `RESPONSE — ${incidentId}`,
        status: 'ASSIGNED',
        priority: 'HIGH',
      });
    } catch (e) {
      console.warn('[ResponseContext] Mission creation notice:', e.message);
    }

    setIncidents(prev =>
      prev.map(i =>
        i.id === incidentId || i.incidentCode === incidentId
          ? {
              ...i,
              status: 'FIELD TEAM ASSIGNED',
              team: { assigned: true, teamId, teamName, assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST' },
            }
          : i
      )
    );
  };

  const verifyIncident = async (incidentId, patch = {}, logEntry = null) => {
    try {
      await verifyIncidentApi(incidentId, patch);
    } catch (e) {
      console.warn('[ResponseContext] Verification API notice:', e.message);
    }

    setIncidents(prev =>
      prev.map(i => {
        if (i.id === incidentId || i.incidentCode === incidentId) {
          const newStatus = patch.status || i.status;
          return {
            ...i,
            status: newStatus,
            verification: {
              ...i.verification,
              status: newStatus,
              required: newStatus !== 'VERIFIED',
            },
            timeline: logEntry ? [...(i.timeline || []), logEntry] : i.timeline,
          };
        }
        return i;
      })
    );
  };

  const createMission = async (missionData) => {
    const created = await createMissionApi(missionData);
    const resolvedMission = created.data || {
      id: `VN-M${String(missions.length + 1).padStart(3, '0')}`,
      ...missionData,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      timeline: [[new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'Mission created']],
      fieldUpdates: [],
    };

    setMissions(prev => [resolvedMission, ...prev]);
    return resolvedMission;
  };

  const updateMissionStatus = async (missionId, status, label = 'Status updated') => {
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      await updateMissionStatusApi(missionId, status);
    } catch (e) {
      console.warn('[ResponseContext] Mission status API notice:', e.message);
    }

    setMissions(prev =>
      prev.map(m =>
        m.id === missionId
          ? {
              ...m,
              status,
              updatedAt: timeShort,
              timeline: [...(m.timeline || []), [timeShort, label]],
            }
          : m
      )
    );
  };

  const submitFieldUpdate = async (missionId, data) => {
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      await submitFieldUpdateApi(missionId, data);
    } catch (e) {
      console.warn('[ResponseContext] Field update API notice:', e.message);
    }

    setMissions(prev =>
      prev.map(m =>
        m.id === missionId
          ? {
              ...m,
              updatedAt: timeShort,
              fieldUpdates: [...(m.fieldUpdates || []), { time: timeShort, ...data }],
              timeline: [...(m.timeline || []), [timeShort, 'Field update submitted']],
            }
          : m
      )
    );
  };

  return (
    <ResponseContext.Provider
      value={{
        incidents,
        teams,
        missions,
        alerts,
        situationSummary,
        isLoading,
        apiConnected,
        refreshData: loadAllData,
        getIncident,
        updateIncidentStatus,
        assignTeam,
        verifyIncident,
        createMission,
        updateMissionStatus,
        submitFieldUpdate,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponse = () => useContext(ResponseContext);

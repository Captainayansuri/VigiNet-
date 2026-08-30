import { responseIncidents, incidentById, teams, alerts } from '../data/responseMockData';
import { seedMissions } from '../data/missionMockData';

const parseJsonResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    return null;
  }
};

const fetchJson = async (url, options = {}, fallbackValue = null) => {
  try {
    const res = await fetch(url, {
      ...options,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await parseJsonResponse(res);
    return json?.data ?? json ?? fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
};

export const fetchIncidents = async () => fetchJson('/api/incidents', {}, []);

export const fetchIncidentById = async (id) => fetchJson(`/api/incidents/${id}`, {}, null);

export const verifyIncidentApi = async (id, data, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api/incidents/${id}/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return await parseJsonResponse(res);
};

export const fetchMissions = async () => fetchJson('/api/missions', {}, []);

export const createMissionApi = async (data, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('/api/missions', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return (await parseJsonResponse(res)) || { data: null };
};

export const updateMissionStatusApi = async (id, status, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api/missions/${id}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return (await parseJsonResponse(res)) || { data: { id, status } };
};

export const submitFieldUpdateApi = async (id, data, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api/missions/${id}/field-updates`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return (await parseJsonResponse(res)) || { data: { missionId: id, ...data } };
};

export const fetchTeams = async () => fetchJson('/api/teams', {}, []);
export const fetchAlerts = async () => fetchJson('/api/alerts', {}, []);

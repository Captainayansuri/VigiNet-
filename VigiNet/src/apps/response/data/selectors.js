// Selectors / derivations for the Response app.
//
// These derive presentational views from the canonical `responseIncidents` model
// (and the `teams` registry). They accept optional datasets and default to the
// canonical baseline, ensuring components stay reactive to live API data.

import { responseIncidents, teams, alerts } from './responseMockData';
import { TEAM_MAP_LAYOUT, HAZARD_ZONES } from './mapMockData';
import { TERMINAL_STATUSES } from './missionMockData';

// --- Incident filters (return canonical objects) -----------------------------

const normalizeMissionStatus = (status = '') => String(status).trim().replace(/_/g, ' ');
const normalizeIncidentStatus = (status = '') => String(status).trim();

export const getCriticalIncidents = (list = responseIncidents) =>
  list.filter(i => normalizeIncidentStatus(i.priority) === 'CRITICAL' || normalizeIncidentStatus(i.severity) === 'CRITICAL');

export const getVerificationQueue = (list = responseIncidents) =>
  list.filter(
    i =>
      normalizeIncidentStatus(i.status) === 'VERIFICATION REQUIRED' ||
      normalizeIncidentStatus(i.status) === 'UNDER REVIEW' ||
      normalizeIncidentStatus(i.status) === 'IN VERIFICATION' ||
      normalizeIncidentStatus(i.verification?.status) === 'REQUIRED' ||
      normalizeIncidentStatus(i.verification?.status) === 'UNVERIFIED'
  );

export const getActiveIncidents = (list = responseIncidents) => list;

// --- Projections (derived, not stored) --------------------------------------

export const getIncidentFeed = (list = responseIncidents) =>
  list.map(i => ({
    id: i.id || i.incidentCode,
    time: i.timestamps?.reportedAt || 'Recent',
    type: i.type || i.category || 'INCIDENT',
    location: i.location?.area || i.locationText || 'Field Area',
    priority: i.priority || i.severity || 'MODERATE',
    status: i.status || 'OPEN'
  }));

const INCIDENT_MAP_LAYOUT = {
  'VN-63481': { x: '27%', y: '36%' },
  'VN-63476': { x: '65%', y: '42%' },
  'VN-28491': { x: '49%', y: '18%' },
  'VN-28455': { x: '35%', y: '62%' }
};

export const getMapNodes = (list = responseIncidents) =>
  list.map((i, index) => {
    const defaultPos = {
      x: `${25 + ((index * 23) % 60)}%`,
      y: `${25 + ((index * 29) % 55)}%`
    };
    return {
      label: i.location?.area || i.locationText || `Incident ${i.id}`,
      x: (INCIDENT_MAP_LAYOUT[i.id] || defaultPos).x,
      y: (INCIDENT_MAP_LAYOUT[i.id] || defaultPos).y,
      type:
        i.priority === 'CRITICAL' || i.severity === 'CRITICAL'
          ? 'critical'
          : i.priority === 'SERIOUS' || i.severity === 'HIGH'
          ? 'serious'
          : 'verified'
    };
  });

// --- Map node projections (canonical -> presentation) -------------------------

export const getIncidentMapNodes = (list = responseIncidents) =>
  list.map((i, index) => {
    const defaultPos = {
      x: `${25 + ((index * 23) % 60)}%`,
      y: `${25 + ((index * 29) % 55)}%`
    };
    const p = INCIDENT_MAP_LAYOUT[i.id] || defaultPos;
    return {
      kind: 'incident',
      id: i.id || i.incidentCode,
      type: i.type || i.category || 'INCIDENT',
      priority: i.priority || i.severity || 'MODERATE',
      status: i.status || 'OPEN',
      location: i.location?.area || i.locationText || 'Field Area',
      coordinates: i.location?.coordinates || 'Coordinates Available',
      affectedArea: i.location?.affectedArea || '~0.8 km',
      reports: i.reports?.count ?? i.reports?.length ?? 0,
      evidence: i.evidence?.count ?? i.evidence?.items?.length ?? 0,
      confidence: i.assessment?.confidence || '75%',
      x: p.x,
      y: p.y
    };
  });

export const getTeamMapNodes = (teamList = teams) =>
  teamList.map((t, index) => {
    const defaultPos = {
      x: `${30 + ((index * 20) % 50)}%`,
      y: `${30 + ((index * 25) % 50)}%`
    };
    const p = TEAM_MAP_LAYOUT[t.name] || defaultPos;
    return {
      kind: 'team',
      id: t.name || t.id,
      name: t.name || t.teamName || t.id,
      status: t.status || 'AVAILABLE',
      assignment: t.assignment || t.currentAssignment || 'Staging',
      x: p.x,
      y: p.y
    };
  });

export const getEvidenceMapNodes = (list = responseIncidents) => {
  const nodes = [];
  list.forEach((i, incIdx) => {
    const base = INCIDENT_MAP_LAYOUT[i.id] || {
      x: `${25 + ((incIdx * 23) % 60)}%`,
      y: `${25 + ((incIdx * 29) % 55)}%`
    };
    const bx = parseFloat(base.x);
    const by = parseFloat(base.y);
    const items = i.evidence?.items || [];
    items.forEach((item, idx) => {
      const [type, time, location] = item;
      const angle = (idx * 57) % 360;
      const rad = (angle * Math.PI) / 180;
      const x = Math.min(95, Math.max(5, bx + Math.cos(rad) * 6));
      const y = Math.min(95, Math.max(5, by + Math.sin(rad) * 6));
      nodes.push({
        kind: 'evidence',
        id: `${i.id}-E${idx}`,
        type,
        time,
        location: location || i.location?.area || 'Field',
        incidentId: i.id,
        x: `${x}%`,
        y: `${y}%`
      });
    });
  });
  return nodes;
};

export const getHazardZones = () => HAZARD_ZONES;

// --- Team registry access ---------------------------------------------------

export const getTeamById = (id, teamList = teams) =>
  teamList.find(
    t => t.teamId === id || t.id === id || t.name === id || t.name === `TEAM ${id}`
  ) || null;

export const getAssignedTeams = (teamList = teams) =>
  teamList.filter(t => t.status !== 'OFFLINE');

// --- Lookups used across Response modules -------------------------------------

export const getIncidentById = (id, list = responseIncidents) =>
  list.find(i => i.id === id || i.incidentCode === id) || null;

export const getAlertsForIncident = (incidentId, alertList = alerts) =>
  alertList.filter(a => a.incidentId && a.incidentId === incidentId);

// --- Mission selectors --------------------------------------------------------

export const getMissions = list => list;

export const getMissionById = (list, id) => list.find(m => m.id === id) || null;

export const getActiveMissions = list =>
  list.filter(m => !TERMINAL_STATUSES.includes(normalizeMissionStatus(m.status)));

export const getMissionsByStatus = (list, status) =>
  list.filter(m => normalizeMissionStatus(m.status) === normalizeMissionStatus(status));

export const getMissionsByTeam = (list, teamId) =>
  list.filter(m => m.teamId === teamId || m.teamId === `TEAM ${teamId}`);

export const getMissionsForIncident = (list, incidentId) =>
  list.filter(m => m.incidentId === incidentId);

// Mission entities. A mission is a field response task created from an incident.
//
// Data ownership: a mission references `incidentId` and `teamId` only. Incident
// and team details are resolved through selectors (getIncidentById / getTeamById)
// — they are NOT embedded in the mission object. This keeps a single source of
// truth for incidents and teams.

export const seedMissions = [
  {
    id: 'VN-M001',
    title: 'FLOOD RESCUE — VILLAGE B',
    incidentId: 'VN-63481',
    teamId: 'ALPHA',
    status: 'EN ROUTE',
    priority: 'CRITICAL',
    priorityOverridden: false,
    objective: 'Reach Village B Lower Sector and verify/rescue trapped civilians.',
    location: 'Village B — Lower Sector',
    createdAt: '10:05 IST',
    updatedAt: '10:12 IST',
    eta: '12 min',
    hazards: ['Flooded roads', 'Fast-moving water', 'Potential electrical hazard'],
    lat: 13.0827,
    lon: 80.2707,
    accuracy: '±14 m',
    timeline: [
      ['10:05', 'Mission created'],
      ['10:07', 'Team Alpha assigned'],
      ['10:09', 'Team accepted mission'],
      ['10:12', 'Team en route']
    ],
    fieldUpdates: []
  },
  {
    id: 'VN-M002',
    title: 'EAST BASIN FLOOD RESPONSE',
    incidentId: 'VN-63476',
    teamId: 'BETA',
    status: 'ON SCENE',
    priority: 'HIGH',
    priorityOverridden: true,
    objective: 'Assess East Basin flooding and support evacuation of low-lying sectors.',
    location: 'East Basin',
    createdAt: '09:35 IST',
    updatedAt: '10:20 IST',
    eta: '0 min',
    hazards: ['Flooded roads', 'Structural risk'],
    lat: 13.09,
    lon: 80.28,
    accuracy: '±25 m',
    timeline: [
      ['09:35', 'Mission created'],
      ['09:40', 'Team Beta assigned'],
      ['09:55', 'Team en route'],
      ['10:20', 'Team arrived on scene']
    ],
    fieldUpdates: []
  },
  {
    id: 'VN-M003',
    title: 'NORTH RIDGE VERIFICATION',
    incidentId: 'VN-28491',
    teamId: 'GAMMA',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    priorityOverridden: false,
    objective: 'Verify flooding reports in North Ridge and report field conditions.',
    location: 'North Ridge',
    createdAt: '08:30 IST',
    updatedAt: '08:30 IST',
    eta: '18 min',
    hazards: ['Rising water'],
    lat: 13.05,
    lon: 80.22,
    accuracy: '±30 m',
    timeline: [
      ['08:30', 'Mission created'],
      ['08:30', 'Team Gamma assigned']
    ],
    fieldUpdates: []
  },
  {
    id: 'VN-M004',
    title: 'GREEN AVENUE CLEARANCE',
    incidentId: 'VN-28455',
    teamId: 'ALPHA',
    status: 'COMPLETED',
    priority: 'LOW',
    priorityOverridden: false,
    objective: 'Clear fallen tree and confirm road safe for traffic.',
    location: 'Green Avenue',
    createdAt: '07:45 IST',
    updatedAt: '08:30 IST',
    eta: '—',
    hazards: ['Debris'],
    lat: 13.02,
    lon: 80.2,
    accuracy: '±20 m',
    timeline: [
      ['07:45', 'Mission created'],
      ['07:50', 'Team Alpha assigned'],
      ['08:10', 'Team en route'],
      ['08:25', 'Team on scene'],
      ['08:30', 'Mission completed']
    ],
    fieldUpdates: []
  }
];

// Lifecycle order for progress indication.
export const MISSION_LIFECYCLE = [
  'DRAFT', 'ASSIGNED', 'ACCEPTED', 'EN ROUTE', 'ON SCENE', 'IN PROGRESS', 'COMPLETED'
];

export const TERMINAL_STATUSES = ['COMPLETED', 'CANCELLED', 'ABORTED', 'UNABLE TO REACH'];

// Forward transition available from a given status.
export const MISSION_TRANSITIONS = {
  ASSIGNED: { label: 'MARK ACCEPTED', to: 'ACCEPTED' },
  ACCEPTED: { label: 'DEPART - EN ROUTE', to: 'EN ROUTE' },
  'EN ROUTE': { label: 'ARRIVED ON SCENE', to: 'ON SCENE' },
  'ON SCENE': { label: 'START OPERATION', to: 'IN PROGRESS' },
  'IN PROGRESS': { label: 'COMPLETE MISSION', to: 'COMPLETED' }
};

// Map canonical incident priority -> mission priority default.
export const incidentToMissionPriority = {
  CRITICAL: 'CRITICAL',
  SERIOUS: 'HIGH',
  MODERATE: 'MEDIUM',
  LOW: 'LOW'
};

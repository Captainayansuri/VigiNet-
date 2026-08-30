// Non-incident map entities and map presentation configuration.
//
// Data ownership:
//  - Incidents, evidence, and reports are derived from the canonical incident
//    model (see selectors.js). They are NOT duplicated here.
//  - Teams are a separate domain entity (registry in responseMockData.js). Their
//    geographic placement below is presentation-only mock data.
//  - Hazards are standalone mock operational overlays (no sensor/satellite data).
//  - Operational situation figures are static mock KPIs for the map overview.

export const TEAM_MAP_LAYOUT = {
  'TEAM ALPHA': { x: '72%', y: '58%' },
  'TEAM BETA': { x: '81%', y: '39%' },
  'TEAM GAMMA': { x: '37%', y: '27%' },
  'TEAM DELTA': { x: '13%', y: '69%' }
};

export const HAZARD_ZONES = [
  { id: 'HZ-1', label: 'FLOOD ZONE', type: 'flood', x: '58%', y: '49%', size: '30%' },
  { id: 'HZ-2', label: 'ROAD BLOCKAGE', type: 'road', x: '29%', y: '41%', size: '15%' },
  { id: 'HZ-3', label: 'LANDSLIDE RISK', type: 'landslide', x: '45%', y: '73%', size: '18%' },
  { id: 'HZ-4', label: 'HIGH WATER', type: 'water', x: '70%', y: '27%', size: '20%' }
];

export const OPERATIONAL_SITUATION = {
  critical: 5,
  unverified: 8,
  teams: 12,
  evidence: 21,
  zones: 4
};

// Mock capabilities shown in the team information panel. Kept separate from the
// team registry so the registry stays a clean domain record.
export const TEAM_CAPABILITIES = {
  'TEAM ALPHA': ['Flood rescue', 'Medical support'],
  'TEAM BETA': ['Swift water', 'Evacuation'],
  'TEAM GAMMA': ['Verification', 'Reconnaissance'],
  'TEAM DELTA': ['Standby', 'Logistics']
};

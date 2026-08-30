// Verification-specific data for the Verification Center.
//
// This module holds ONLY information genuinely unique to verification
// (per-report correlation detail, detected conflicts, source categories, and
// the priority/filter selectors). It does NOT duplicate canonical incident
// fields such as title, location, priority, status, reports or evidence — those
// are read from the canonical `responseIncidents` model.
//
// The canonical incident stays the single source of truth. The maps below are
// keyed by the same report/incident ids that already exist in the canonical
// model, so there is a single place to change underlying data later.

import { teams } from './responseMockData';

// Per-report correlation detail. Keyed by the report id found in the canonical
// incident's `reports.relatedReports`. Enriches (does not replace) that list.
export const reportDetails = {
  'VN-63481': { source: 'CITIZEN', accuracy: '±14 m', description: 'Water has entered the lower houses and people are calling for help.', evidence: '2 photos' },
  'VN-63492': { source: 'CITIZEN', accuracy: '±18 m', description: 'Street is flooding near the market.', evidence: '1 video' },
  'VN-63503': { source: 'CITIZEN', accuracy: '±22 m', description: 'Road blocked by debris and rising water.', evidence: '1 photo' },
  'VN-28491': { source: 'CITIZEN', accuracy: '±30 m', description: 'Water entering shops on the main road.', evidence: '1 photo' },
  'VN-28501': { source: 'CITIZEN', accuracy: '±28 m', description: 'Water level going up fast near the bridge.', evidence: '1 video' },
  'VN-28512': { source: 'CITIZEN', accuracy: '±35 m', description: 'Car stranded in moving water.', evidence: '—' },
  'VN-28523': { source: 'CITIZEN', accuracy: '±40 m', description: 'Power went out across the block.', evidence: '—' },
  'VN-28455': { source: 'CITIZEN', accuracy: '±20 m', description: 'Big tree down across the road.', evidence: '1 photo' },
  'VN-28460': { source: 'CITIZEN', accuracy: '±25 m', description: 'Road fully blocked by the fallen tree.', evidence: '—' },
  'VN-28467': { source: 'FIELD RESPONDER', accuracy: '±5 m', description: 'Road cleared by locals, tree removed, no hazards remain.', evidence: '1 photo' }
};

// Detected information conflicts, keyed by incident id. VigiNet surfaces these
// for verification rather than deciding which report is correct.
export const conflictsByIncident = {
  'VN-63481': [
    { a: 'Water approximately waist deep.', b: 'Water approximately knee deep.', note: 'Reports differ on flood depth.' }
  ],
  'VN-28491': [
    { a: 'Water level rising rapidly.', b: 'Water level stable since morning.', note: 'Contradictory observations on water trend.' }
  ]
};

// Provenance categories. These communicate WHERE information came from, not a
// trust score. Citizens are not treated as inherently unreliable.
export const sourceCategories = ['CITIZEN', 'FIELD RESPONDER', 'SENSOR', 'OFFICIAL'];

export const verificationFilters = [
  'ALL',
  'CRITICAL',
  'SERIOUS',
  'NEEDS VERIFICATION',
  'CONFLICTING',
  'VERIFIED'
];

// Structured, mock priority tiers. This is NOT a real algorithm — it is a
// presentation aid that explains WHY an item ranks where it does.
export function verificationPriority(incident) {
  const conf = parseInt(incident.assessment.confidence, 10) || 0;
  const critical = incident.priority === 'CRITICAL';
  const serious = incident.priority === 'SERIOUS';
  const verified = incident.status === 'VERIFIED' || incident.verification.status === 'VERIFIED';
  const needsVerification =
    incident.verification.required ||
    incident.status === 'VERIFICATION REQUIRED' ||
    incident.status === 'UNDER REVIEW';
  const conflicting = !!conflictsByIncident[incident.id];

  const reasons = [];
  if (critical) reasons.push('CRITICAL');
  if (critical && conf <= 70) reasons.push('LOW CONFIDENCE');
  if (needsVerification) reasons.push('VERIFICATION REQUIRED');
  if (serious && conflicting) reasons.push('CONFLICTING REPORTS');
  if (!verified) reasons.push('UNVERIFIED');

  let tier = 5;
  if (critical && conf <= 70) tier = 1;
  else if (critical && needsVerification) tier = 2;
  else if (serious && conflicting) tier = 3;
  else if (!verified) tier = 4;

  return { tier, reasons, conflicting };
}

export function matchesFilter(incident, filter) {
  switch (filter) {
    case 'CRITICAL':
      return incident.priority === 'CRITICAL';
    case 'SERIOUS':
      return incident.priority === 'SERIOUS';
    case 'NEEDS VERIFICATION':
      return (
        incident.status !== 'VERIFIED' &&
        (incident.verification.required ||
          incident.status === 'VERIFICATION REQUIRED' ||
          incident.status === 'UNDER REVIEW')
      );
    case 'CONFLICTING':
      return !!conflictsByIncident[incident.id];
    case 'VERIFIED':
      return incident.status === 'VERIFIED' || incident.verification.status === 'VERIFIED';
    case 'ALL':
    default:
      return true;
  }
}

export function searchIncidents(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(incident => {
    const haystack = [incident.id, incident.type, incident.location.area, incident.location.district]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export { teams };

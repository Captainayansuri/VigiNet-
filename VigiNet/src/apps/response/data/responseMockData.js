// Canonical Response incident model.
//
// This is the single source of truth for incident data. Every incident follows
// the same shape so it can be consumed by the Dashboard, Critical Incident
// Cards, Incident Feed, Incident Details, and future modules (Verification
// Center, Live Map, Team Assignment) without maintaining duplicate
// representations.
//
// Layers (keep this separation so the model can be swapped for API responses):
//   RAW DATA        -> responseIncidents (defined below)
//   APPLICATION MODEL -> incidentById / criticalIncidents selectors
//   UI COMPONENTS   -> read the canonical incident object directly
//
// `coordinates` is derived from latitude/longitude here (data layer) so UI
// components stay free of transformation logic.

export const responseIncidents = [
  {
    id: 'VN-63481',
    type: 'PEOPLE TRAPPED',
    title: 'People Trapped',
    description: 'Potentially severe trapping incident.',
    priority: 'CRITICAL',
    status: 'VERIFICATION REQUIRED',
    location: {
      area: 'Village B — Lower Sector',
      district: 'District 4',
      state: 'Tamil Nadu',
      latitude: 13.0827,
      longitude: 80.2707,
      accuracy: '±14 m',
      affectedArea: '~0.8 km',
      coordinates: '13.0827° N · 80.2707° E'
    },
    timestamps: { reportedAt: '09:42 IST', updatedAt: '10:03 IST' },
    reports: {
      count: 7,
      relatedReports: [
        ['VN-63481', 'People Trapped', 'CRITICAL', '09:42'],
        ['VN-63492', 'Flooding', 'SERIOUS', '09:48'],
        ['VN-63503', 'Road Blocked', 'SERIOUS', '09:51']
      ]
    },
    evidence: {
      count: 4,
      items: [
        ['PHOTO', '09:44 IST', 'Village B'],
        ['PHOTO', '09:46 IST', 'Lower Sector'],
        ['VIDEO', '09:48 IST', 'Main Road'],
        ['VOICE', '09:49 IST', 'Village B']
      ]
    },
    assessment: {
      priority: 'CRITICAL',
      confidence: '82%',
      summary: 'Multiple reports indicate a potentially severe incident. Field verification is recommended.'
    },
    known: [
      'Multiple nearby reports',
      'Water level reportedly rising',
      'People may be trapped',
      'Road access may be restricted'
    ],
    unknown: [
      'Exact number of people trapped',
      'Current water depth',
      'Safe access route',
      'Condition of affected buildings'
    ],
    verification: { status: 'REQUIRED', required: true, requestedAt: '10:01 IST' },
    team: { assigned: false, teamId: null, assignedAt: null },
    timeline: [
      ['09:42', 'Citizen report received'],
      ['09:44', 'Additional flooding report received'],
      ['09:48', 'Photo evidence received'],
      ['09:51', 'Multiple reports correlated'],
      ['09:54', 'Incident escalated to CRITICAL'],
      ['10:01', 'Verification requested']
    ],
    actions: []
  },
  {
    id: 'VN-63476',
    type: 'FLASH FLOODING',
    title: 'Flash Flooding',
    description: 'Flooding in East Basin.',
    priority: 'CRITICAL',
    status: 'FIELD TEAM ASSIGNED',
    location: {
      area: 'East Basin',
      district: 'District 4',
      state: 'Tamil Nadu',
      latitude: 13.09,
      longitude: 80.28,
      accuracy: '±25 m',
      affectedArea: '~1.2 km',
      coordinates: '13.09° N · 80.28° E'
    },
    timestamps: { reportedAt: '09:31 IST', updatedAt: '09:58 IST' },
    reports: { count: 12, relatedReports: [] },
    evidence: { count: 7, items: [] },
    assessment: { priority: 'CRITICAL', confidence: '76%', summary: 'Field team assigned.' },
    known: [],
    unknown: [],
    verification: { status: 'PENDING', required: true, requestedAt: null },
    team: { assigned: true, teamId: 'BETA', assignedAt: '09:58 IST' },
    timeline: [],
    actions: []
  },
  {
    id: 'VN-28491',
    type: 'FLOODING',
    title: 'Urban Flooding',
    description: 'Flooding reported across North Ridge low-lying streets.',
    priority: 'SERIOUS',
    status: 'UNDER REVIEW',
    location: {
      area: 'North Ridge',
      district: 'District 2',
      state: 'Tamil Nadu',
      latitude: 13.05,
      longitude: 80.22,
      accuracy: '±30 m',
      affectedArea: '~2.1 km',
      coordinates: '13.05° N · 80.22° E'
    },
    timestamps: { reportedAt: '08:15 IST', updatedAt: '09:10 IST' },
    reports: {
      count: 4,
      relatedReports: [
        ['VN-28491', 'Flooding', 'SERIOUS', '08:15'],
        ['VN-28501', 'Rising Water', 'SERIOUS', '08:22'],
        ['VN-28512', 'Stranded Vehicle', 'MODERATE', '08:40'],
        ['VN-28523', 'Power Outage', 'MODERATE', '08:55']
      ]
    },
    evidence: {
      count: 2,
      items: [
        ['PHOTO', '08:18 IST', 'North Ridge'],
        ['VIDEO', '08:30 IST', 'North Ridge']
      ]
    },
    assessment: {
      priority: 'SERIOUS',
      confidence: '64%',
      summary: 'Multiple serious reports, but source agreement is only partial.'
    },
    known: [
      'Water level rising in low-lying streets',
      'Several vehicles stranded',
      'Local power disrupted in sector 3'
    ],
    unknown: [
      'Exact depth of flooding',
      'Number of people needing rescue',
      'Structural integrity of older buildings'
    ],
    verification: { status: 'REVIEW', required: true, requestedAt: null },
    team: { assigned: false, teamId: null, assignedAt: null },
    timeline: [
      ['08:15', 'Citizen report received'],
      ['08:22', 'Second flooding report'],
      ['08:40', 'Stranded vehicle reported'],
      ['08:55', 'Power outage reported'],
      ['09:10', 'Marked under review']
    ],
    actions: []
  },
  {
    id: 'VN-28455',
    type: 'TREE FALLEN',
    title: 'Fallen Tree',
    description: 'Tree fallen across road, cleared by locals.',
    priority: 'MODERATE',
    status: 'VERIFIED',
    location: {
      area: 'Green Avenue',
      district: 'District 1',
      state: 'Tamil Nadu',
      latitude: 13.02,
      longitude: 80.20,
      accuracy: '±20 m',
      affectedArea: '~0.3 km',
      coordinates: '13.02° N · 80.20° E'
    },
    timestamps: { reportedAt: '07:40 IST', updatedAt: '08:30 IST' },
    reports: {
      count: 3,
      relatedReports: [
        ['VN-28455', 'Tree Fallen', 'MODERATE', '07:40'],
        ['VN-28460', 'Road Blocked', 'MODERATE', '07:52'],
        ['VN-28467', 'Cleared', 'LOW', '08:10']
      ]
    },
    evidence: {
      count: 3,
      items: [
        ['PHOTO', '07:45 IST', 'Green Avenue'],
        ['PHOTO', '08:12 IST', 'Green Avenue'],
        ['VOICE', '08:20 IST', 'Green Avenue']
      ]
    },
    assessment: {
      priority: 'MODERATE',
      confidence: '90%',
      summary: 'Verified by field responder; road cleared, no injuries.'
    },
    known: [
      'Tree blocked road',
      'Locals cleared the road',
      'No injuries reported'
    ],
    unknown: [
      'Cause of tree fall',
      'Whether adjacent trees are at risk'
    ],
    verification: { status: 'VERIFIED', required: false, requestedAt: '07:50 IST' },
    team: { assigned: true, teamId: 'ALPHA', assignedAt: '07:55 IST' },
    timeline: [
      ['07:40', 'Citizen report received'],
      ['07:55', 'Team Alpha assigned'],
      ['08:12', 'Photo evidence received'],
      ['08:30', 'Marked verified']
    ],
    actions: []
  }
];

// Application-model selectors. These return the same canonical incident object
// (no shape transformation) so components can consume one consistent model.
export const incidentById = Object.fromEntries(responseIncidents.map(x => [x.id, x]));
export const criticalIncidents = responseIncidents.filter(x => x.priority === 'CRITICAL');

// Separate operational mock datasets (distinct concerns, not incident
// representations). Kept here so the Response app remains self-contained until
// these are backed by the VigiNet API.
export const situationSummary = [
  { label: 'ACTIVE INCIDENTS', value: '24', detail: 'Across 4 sectors', tone: 'cyan' },
  { label: 'CRITICAL', value: '05', detail: 'Immediate action', tone: 'red' },
  { label: 'UNDER VERIFICATION', value: '08', detail: 'Review required', tone: 'amber' },
  { label: 'TEAMS DEPLOYED', value: '12', detail: '4 available', tone: 'blue' }
];
export const teams = [
  { name: 'TEAM ALPHA', status: 'AVAILABLE', assignment: 'North District staging' },
  { name: 'TEAM BETA', status: 'DEPLOYED', assignment: 'East Basin flood response' },
  { name: 'TEAM GAMMA', status: 'EN ROUTE', assignment: 'Village B verification' },
  { name: 'TEAM DELTA', status: 'OFFLINE', assignment: 'No current telemetry' }
];
export const alerts = [
  { id: 'ALT-001', title: 'FLASH FLOOD WARNING', area: 'East Basin', priority: 'CRITICAL', message: 'Response required.', incidentId: 'VN-63476' },
  { id: 'ALT-002', title: 'HEAVY RAINFALL', area: 'North District', priority: 'ELEVATED', message: 'Monitor low-lying areas.', incidentId: null }
];

export const ACTIVE_ALERT = {
  id: 'ALT-2026-089',
  title: 'Severe Rainfall & Flash Flood Warning',
  severity: 'CRITICAL', // CRITICAL, WARNING, ADVISORY
  levelText: 'RED ALERT',
  createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  district: 'District 4 - East River Basin',
  affectedAreas: ['Village A', 'Village B', 'Riverside Ward', 'North Highway'],
  description: 'Heavy rainfall is expected in your area. Low-lying areas may experience flooding.',
  actions: [
    'Charge your phone & power bank immediately',
    'Keep essential medicines and documents safe in waterproof bags',
    'Store drinking water and non-perishable food',
    'Avoid flooded roads, bridges, and flowing streams',
    'Move to safer or high ground if instructed'
  ]
};

export const INCIDENT_TYPES = [
  {
    id: 'flooding',
    label: 'Flooding',
    sublabel: 'Rising water or flooded areas',
    icon: '🌊',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40'
  },
  {
    id: 'people_trapped',
    label: 'People Trapped',
    sublabel: 'Surrounded by water or debris',
    icon: '👥',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40'
  },
  {
    id: 'building_collapse',
    label: 'Building Collapse',
    sublabel: 'Collapsed or severely damaged structure',
    icon: '🏚️',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40'
  },
  {
    id: 'road_blocked',
    label: 'Road Blocked',
    sublabel: 'Fallen trees, debris, or damaged bridge',
    icon: '🛣️',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
  },
  {
    id: 'landslide',
    label: 'Landslide',
    sublabel: 'Mudslides or falling rocks',
    icon: '⛰️',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
  },
  {
    id: 'medical_emergency',
    label: 'Medical Help',
    sublabel: 'Injuries, illness, or urgent care',
    icon: '🏥',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  },
  {
    id: 'fire',
    label: 'Fire Hazard',
    sublabel: 'Electrical fire or gas leak',
    icon: '🔥',
    badgeColor: 'bg-red-600/20 text-red-400 border-red-600/40'
  },
  {
    id: 'other',
    label: 'Other Danger',
    sublabel: 'Downed power line or crisis',
    icon: '⚠️',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
  }
];

export const SEVERITY_OPTIONS = [
  {
    id: 'LOW',
    label: 'LOW',
    subtitle: 'Something minor (e.g. minor water pooling, small debris)',
    colorClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    indicatorBg: 'bg-emerald-500'
  },
  {
    id: 'SERIOUS',
    label: 'SERIOUS',
    subtitle: 'Needs attention (e.g. road submerged, property flooded)',
    colorClass: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    indicatorBg: 'bg-amber-500'
  },
  {
    id: 'CRITICAL',
    label: 'CRITICAL',
    subtitle: 'People may be in danger (e.g. trapped, injured, fast current)',
    colorClass: 'border-red-500/40 bg-red-500/10 text-red-300',
    indicatorBg: 'bg-red-500'
  },
  {
    id: 'NOT_SURE',
    label: 'NOT SURE',
    subtitle: 'I cannot accurately tell right now',
    colorClass: 'border-slate-500/40 bg-slate-800/40 text-slate-300',
    indicatorBg: 'bg-slate-400'
  }
];

export const INITIAL_REPORTS = [
  {
    id: 'VN-28491',
    incidentType: 'people_trapped',
    incidentLabel: 'People Trapped',
    incidentIcon: '👥',
    severity: 'CRITICAL',
    village: 'Village B (Lower Sector)',
    district: 'District 4',
    locationText: 'Near Community Hall, Main Road Submerged',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    accuracyMeters: 14,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    timestamp: '09:42 AM',
    date: 'Today',
    status: 'UNDER_REVIEW',
    verificationStatus: 'Pending Field Triangulation',
    isOfflineQueued: false,
    evidence: {
      photosCount: 2,
      videosCount: 0,
      hasVoiceNote: true,
      voiceNoteDuration: '0:24',
      message: 'Elderly couple stuck on single-story roof. Water level rising fast.'
    },
    timeline: [
      { status: 'RECEIVED', title: 'Report Submitted', time: '09:42 AM', description: 'Ground report logged in VigiNet node.' },
      { status: 'ANALYZING', title: 'Automated Processing', time: '09:43 AM', description: 'Location cross-referenced with satellite risk grid.' },
      { status: 'UNDER_REVIEW', title: 'Under Command Review', time: '10:01 AM', description: 'District responder desk reviewing priority.' },
      { status: 'VERIFIED', title: 'Field Verified', time: '10:47 AM', description: 'Verified by local ground unit VN-Unit-12.' },
      { status: 'ACTION_TAKEN', title: 'Response Dispatched', time: '11:02 AM', description: 'NDRF Rescue Boat-04 en route.' }
    ]
  },
  {
    id: 'VN-28473',
    incidentType: 'flooding',
    incidentLabel: 'Flooding',
    incidentIcon: '🌊',
    severity: 'SERIOUS',
    village: 'Village A (North Ridge)',
    district: 'District 4',
    locationText: 'Culvert Overflow near Old Bridge',
    coordinates: { lat: 19.0820, lng: 72.8840 },
    accuracyMeters: 8,
    createdAt: new Date(Date.now() - 97 * 60 * 1000).toISOString(),
    timestamp: '08:15 AM',
    date: 'Today',
    status: 'VERIFIED',
    verificationStatus: 'Verified by Civilian Cluster',
    isOfflineQueued: false,
    evidence: {
      photosCount: 1,
      videosCount: 1,
      hasVoiceNote: false,
      voiceNoteDuration: null,
      message: 'Water washing over the old concrete bridge. Light vehicles cannot cross.'
    },
    timeline: [
      { status: 'RECEIVED', title: 'Report Submitted', time: '08:15 AM', description: 'Report logged.' },
      { status: 'ANALYZING', title: 'Spatial Clustering', time: '08:16 AM', description: 'Matched neighboring civilian reports.' },
      { status: 'UNDER_REVIEW', title: 'Command Review', time: '08:30 AM', description: 'Assigned to Traffic Diversion Unit.' },
      { status: 'VERIFIED', title: 'Verified Status', time: '08:45 AM', description: 'High probability hazard confirmed.' },
      { status: 'ACTION_TAKEN', title: 'Barrier Deployed', time: '09:10 AM', description: 'Road closure barricades set up by local police.' }
    ]
  },
  {
    id: 'VN-28460',
    incidentType: 'road_blocked',
    incidentLabel: 'Road Blocked',
    incidentIcon: 'MW',
    severity: 'LOW',
    village: 'East Valley Road',
    district: 'District 4',
    locationText: 'Fallen Banyan Tree blocking lane 2',
    coordinates: { lat: 19.0710, lng: 72.8690 },
    accuracyMeters: 20,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    timestamp: '07:30 AM',
    date: 'Today',
    status: 'RECEIVED',
    verificationStatus: 'Queued for Analysis',
    isOfflineQueued: false,
    evidence: {
      photosCount: 1,
      videosCount: 0,
      hasVoiceNote: false,
      voiceNoteDuration: null,
      message: 'Branch hanging dangerously over power line.'
    },
    timeline: [
      { status: 'RECEIVED', title: 'Report Submitted', time: '07:30 AM', description: 'Initial report logged.' }
    ]
  }
];

export const EMERGENCY_CONTACTS = [
  { name: 'National Disaster Response (NDRF)', number: '112', icon: '🚨' },
  { name: 'Disaster Management Cell', number: '1070', icon: '🏛️' },
  { name: 'Ambulance & Medical Emergency', number: '108', icon: '🚑' },
  { name: 'Flood Rescue Control Room', number: '+91 1800-233-4554', icon: '🛶' },
  { name: 'Police Control Room', number: '100', icon: '👮' }
];

export const RESCUE_SHELTERS = [
  { name: 'St. Mary Community School Shelter', distance: '0.8 km', status: 'OPEN', capacity: '75% Full', location: 'Highland Ridge' },
  { name: 'West Valley Relief Camp #2', distance: '1.2 km', status: 'FULL', capacity: '100% Full', location: 'West Avenue' },
  { name: 'Government Indoor Sports Stadium', distance: '1.4 km', status: 'OPEN', capacity: '40% Full', location: 'District Center' }
];

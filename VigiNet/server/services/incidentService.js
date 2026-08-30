import { prisma, checkDatabaseConnection } from '../config/prisma.js';
import { logAuditEvent } from './auditService.js';

// Canonical fallback data when DB is offline
const fallbackIncidents = [
  {
    id: 'VN-63481',
    incidentCode: 'VN-63481',
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
      coordinates: '13.0827° N · 80.2707° E',
    },
    timestamps: { reportedAt: '09:42 IST', updatedAt: '10:03 IST' },
    reports: {
      count: 7,
      relatedReports: [
        ['VN-63481', 'People Trapped', 'CRITICAL', '09:42'],
        ['VN-63492', 'Flooding', 'SERIOUS', '09:48'],
        ['VN-63503', 'Road Blocked', 'SERIOUS', '09:51'],
      ],
    },
    evidence: {
      count: 4,
      items: [
        ['PHOTO', '09:44 IST', 'Village B'],
        ['PHOTO', '09:46 IST', 'Lower Sector'],
        ['VIDEO', '09:48 IST', 'Main Road'],
        ['VOICE', '09:49 IST', 'Village B'],
      ],
    },
    assessment: {
      priority: 'CRITICAL',
      confidence: '82%',
      summary: 'Multiple reports indicate a potentially severe incident. Field verification is recommended.',
    },
    known: [
      'Multiple nearby reports',
      'Water level reportedly rising',
      'People may be trapped',
      'Road access may be restricted',
    ],
    unknown: [
      'Exact number of people trapped',
      'Current water depth',
      'Safe access route',
      'Condition of affected buildings',
    ],
    verification: { status: 'REQUIRED', required: true, requestedAt: '10:01 IST' },
    team: { assigned: false, teamId: null, assignedAt: null },
    timeline: [
      ['09:42', 'Citizen report received'],
      ['09:44', 'Additional flooding report received'],
      ['09:48', 'Photo evidence received'],
      ['09:51', 'Multiple reports correlated'],
      ['09:54', 'Incident escalated to CRITICAL'],
      ['10:01', 'Verification requested'],
    ],
    actions: [],
  },
  {
    id: 'VN-63476',
    incidentCode: 'VN-63476',
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
      coordinates: '13.09° N · 80.28° E',
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
    actions: [],
  },
  {
    id: 'VN-28491',
    incidentCode: 'VN-28491',
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
      coordinates: '13.05° N · 80.22° E',
    },
    timestamps: { reportedAt: '08:15 IST', updatedAt: '09:10 IST' },
    reports: { count: 4, relatedReports: [] },
    evidence: { count: 2, items: [] },
    assessment: { priority: 'SERIOUS', confidence: '64%', summary: 'Multiple serious reports.' },
    known: [],
    unknown: [],
    verification: { status: 'REVIEW', required: true, requestedAt: null },
    team: { assigned: false, teamId: null, assignedAt: null },
    timeline: [],
    actions: [],
  },
  {
    id: 'VN-28455',
    incidentCode: 'VN-28455',
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
      coordinates: '13.02° N · 80.20° E',
    },
    timestamps: { reportedAt: '07:40 IST', updatedAt: '08:30 IST' },
    reports: { count: 3, relatedReports: [] },
    evidence: { count: 3, items: [] },
    assessment: { priority: 'MODERATE', confidence: '90%', summary: 'Verified by field responder.' },
    known: [],
    unknown: [],
    verification: { status: 'VERIFIED', required: false, requestedAt: '07:50 IST' },
    team: { assigned: true, teamId: 'ALPHA', assignedAt: '07:55 IST' },
    timeline: [],
    actions: [],
  },
];

export const formatCanonicalIncident = (inc) => {
  const lat = inc.latitude || 0;
  const lng = inc.longitude || 0;
  const coordString = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;

  const relatedReports = (inc.reports || []).map((r) => [
    r.id || `VN-${r.incidentId || '000'}`,
    r.title || r.type || 'Citizen Report',
    r.severity || 'MODERATE',
    r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
  ]);

  const evidenceItems = (inc.evidence || []).map((e) => [
    e.type || 'PHOTO',
    e.createdAt ? new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST' : 'Recent',
    e.metadata?.locationName || inc.area || 'Field',
  ]);

  const missions = inc.missions || [];
  const assignedMission = missions.find((m) => m.teamId);

  return {
    id: inc.incidentCode || inc.id,
    dbId: inc.id,
    type: inc.category || inc.title || 'DISASTER',
    title: inc.title || 'Active Incident',
    description: inc.description || '',
    priority: inc.severity || 'MODERATE',
    status: inc.status === 'OPEN' ? (inc.verification?.length > 0 ? 'UNDER REVIEW' : 'VERIFICATION REQUIRED') : inc.status,
    location: {
      area: inc.area || inc.locationText || 'Unknown Area',
      district: inc.district || 'District',
      state: inc.state || 'Tamil Nadu',
      latitude: lat,
      longitude: lng,
      accuracy: inc.accuracy || '±20 m',
      affectedArea: inc.affectedArea || '~1.0 km',
      coordinates: coordString,
    },
    timestamps: {
      reportedAt: inc.reportedAt ? new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST' : 'Recent',
      updatedAt: inc.updatedAt ? new Date(inc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST' : 'Recent',
    },
    reports: {
      count: (inc.reports && inc.reports.length) || inc._count?.reports || 0,
      relatedReports,
    },
    evidence: {
      count: (inc.evidence && inc.evidence.length) || inc._count?.evidence || 0,
      items: evidenceItems,
    },
    assessment: {
      priority: inc.severity || 'MODERATE',
      confidence: inc.confidence || '75%',
      summary: inc.summary || inc.description || 'Active incident in assessment.',
    },
    known: inc.knownFacts || [],
    unknown: inc.unknownFacts || [],
    verification: {
      status: inc.status === 'VERIFIED' ? 'VERIFIED' : (inc.verification && inc.verification.length > 0 ? inc.verification[0].status : 'REQUIRED'),
      required: inc.status !== 'VERIFIED',
      requestedAt: inc.reportedAt ? new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST' : null,
    },
    team: {
      assigned: !!assignedMission,
      teamId: assignedMission ? assignedMission.teamId : null,
      assignedAt: assignedMission?.createdAt ? new Date(assignedMission.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST' : null,
    },
    timeline: (inc.auditEvents || []).map((a) => [
      new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      a.action.replace(/_/g, ' ').toLowerCase(),
    ]),
    actions: [],
  };
};

export const getAllIncidents = async () => {
  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    return fallbackIncidents;
  }

  const incidents = await prisma.incident.findMany({
    include: {
      reports: true,
      evidence: true,
      missions: true,
      verification: true,
      auditEvents: {
        orderBy: { timestamp: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (incidents.length === 0) {
    return fallbackIncidents;
  }

  return incidents.map(formatCanonicalIncident);
};

export const getIncidentByCodeOrId = async (idOrCode) => {
  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    const found = fallbackIncidents.find((i) => i.id === idOrCode || i.incidentCode === idOrCode);
    return found || fallbackIncidents[0];
  }

  const incident = await prisma.incident.findFirst({
    where: {
      OR: [{ id: idOrCode }, { incidentCode: idOrCode }],
    },
    include: {
      reports: true,
      evidence: true,
      missions: true,
      verification: true,
      auditEvents: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });

  if (!incident) {
    // Fallback if seeded ID is queried but DB has no records
    const found = fallbackIncidents.find((i) => i.id === idOrCode || i.incidentCode === idOrCode);
    return found || null;
  }

  return formatCanonicalIncident(incident);
};

export const createIncident = async (data, actorId = null) => {
  const { isConnected } = await checkDatabaseConnection();

  const incidentCode = data.incidentCode || `VN-${Math.floor(10000 + Math.random() * 90000)}`;

  if (!isConnected) {
    const mock = {
      id: incidentCode,
      incidentCode,
      ...data,
      createdAt: new Date().toISOString(),
    };
    return formatCanonicalIncident(mock);
  }

  const created = await prisma.incident.create({
    data: {
      incidentCode,
      title: data.title || 'New Incident',
      description: data.description || '',
      category: data.category || data.type || 'GENERAL',
      severity: data.severity || data.priority || 'MODERATE',
      status: data.status || 'OPEN',
      latitude: data.latitude || data.lat || null,
      longitude: data.longitude || data.lng || null,
      accuracy: data.accuracy || '±20 m',
      area: data.area || data.locationText || null,
      district: data.district || null,
      state: data.state || 'Tamil Nadu',
      affectedArea: data.affectedArea || '~0.5 km',
      radiusMeters: data.radiusMeters || 500,
      locationText: data.locationText || null,
      confidence: data.confidence || '70%',
      summary: data.summary || data.description || null,
      knownFacts: data.known || [],
      unknownFacts: data.unknown || [],
      reportedAt: new Date(),
    },
    include: {
      reports: true,
      evidence: true,
      missions: true,
      verification: true,
    },
  });

  await logAuditEvent({
    actorId,
    action: 'INCIDENT_CREATED',
    entity: 'Incident',
    entityId: created.id,
    incidentId: created.id,
    metadata: { code: incidentCode, title: created.title },
  });

  return formatCanonicalIncident(created);
};

export const updateIncident = async (idOrCode, data, actorId = null) => {
  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    return { id: idOrCode, ...data, updatedAt: new Date().toISOString() };
  }

  const target = await prisma.incident.findFirst({
    where: {
      OR: [{ id: idOrCode }, { incidentCode: idOrCode }],
    },
  });

  if (!target) {
    const error = new Error(`Incident ${idOrCode} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.incident.update({
    where: { id: target.id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.severity && { severity: data.severity }),
      ...(data.priority && { severity: data.priority }),
      ...(data.summary && { summary: data.summary }),
      ...(data.confidence && { confidence: data.confidence }),
    },
    include: {
      reports: true,
      evidence: true,
      missions: true,
      verification: true,
    },
  });

  await logAuditEvent({
    actorId,
    action: 'INCIDENT_UPDATED',
    entity: 'Incident',
    entityId: updated.id,
    incidentId: updated.id,
    metadata: data,
  });

  return formatCanonicalIncident(updated);
};

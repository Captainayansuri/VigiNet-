import { prisma, checkDatabaseConnection } from '../config/prisma.js';
import { logAuditEvent } from './auditService.js';

export const normalizeMissionStatus = (status) => {
  const normalized = String(status || '').trim().toUpperCase().replace(/\s+/g, '_');
  const map = {
    PENDING: 'PENDING',
    ASSIGNED: 'ASSIGNED',
    ACCEPTED: 'ACCEPTED',
    EN_ROUTE: 'EN_ROUTE',
    ENROUTE: 'EN_ROUTE',
    'EN ROUTE': 'EN_ROUTE',
    ON_SCENE: 'ON_SCENE',
    ONSCENE: 'ON_SCENE',
    'ON SCENE': 'ON_SCENE',
    IN_PROGRESS: 'IN_PROGRESS',
    INPROGRESS: 'IN_PROGRESS',
    'IN PROGRESS': 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ABORTED: 'ABORTED',
    CANCELLED: 'CANCELLED',
    CANCELLED_STATUS: 'CANCELLED',
    UNABLE_TO_REACH: 'UNABLE_TO_REACH',
    UNABLETOREACH: 'UNABLE_TO_REACH',
  };
  return map[normalized] || normalized || 'ASSIGNED';
};

const fallbackMissions = [
  {
    id: 'VN-M001',
    title: 'FLOOD RESCUE — VILLAGE B',
    incidentId: 'VN-63481',
    teamId: 'ALPHA',
    status: 'EN_ROUTE',
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
      ['10:12', 'Team en route'],
    ],
    fieldUpdates: [],
  },
  {
    id: 'VN-M002',
    title: 'EAST BASIN FLOOD RESPONSE',
    incidentId: 'VN-63476',
    teamId: 'BETA',
    status: 'ON_SCENE',
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
    timeline: [],
    fieldUpdates: [],
  },
];

export const getAllMissions = async () => {
  const { isConnected } = await checkDatabaseConnection();
  if (!isConnected) return fallbackMissions;

  const list = await prisma.mission.findMany({
    include: {
      team: true,
      incident: true,
      fieldUpdates: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (list.length === 0) return fallbackMissions;
  return list.map((mission) => ({
    ...mission,
    status: normalizeMissionStatus(mission.status),
  }));
};

export const getMissionById = async (id) => {
  const { isConnected } = await checkDatabaseConnection();
  if (!isConnected) {
    return fallbackMissions.find((m) => m.id === id) || fallbackMissions[0];
  }

  return prisma.mission.findUnique({
    where: { id },
    include: {
      team: true,
      incident: true,
      fieldUpdates: {
        include: { responder: { select: { id: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

export const createMission = async (data, actorId = null) => {
  const { isConnected } = await checkDatabaseConnection();

  const id = `VN-M${String(Math.floor(100 + Math.random() * 900))}`;
  const missionPayload = {
    id,
    title: data.title || 'Response Mission',
    incidentId: data.incidentId || null,
    teamId: data.teamId || null,
    objective: data.objective || '',
    status: normalizeMissionStatus(data.status || 'ASSIGNED'),
    priority: data.priority || 'MODERATE',
    priorityOverridden: Boolean(data.priorityOverridden),
    location: data.location || '',
    etaMinutes: data.etaMinutes ? Number(data.etaMinutes) : null,
    hazards: data.hazards || [],
    lat: data.lat ? Number(data.lat) : null,
    lon: data.lon ? Number(data.lon) : null,
    accuracy: data.accuracy || '±20 m',
  };

  if (!isConnected) {
    return {
      ...missionPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const created = await prisma.mission.create({
    data: missionPayload,
    include: { team: true, incident: true },
  });

  await logAuditEvent({
    actorId,
    action: 'MISSION_CREATED',
    entity: 'Mission',
    entityId: created.id,
    incidentId: data.incidentId,
    metadata: { teamId: data.teamId, title: data.title },
  });

  return created;
};

export const updateMissionStatus = async (id, status, actorId = null) => {
  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    return { id, status, updatedAt: new Date().toISOString() };
  }

  const normalizedStatus = normalizeMissionStatus(status);

  const updated = await prisma.mission.update({
    where: { id },
    data: { status: normalizedStatus },
    include: { team: true, incident: true },
  });

  await logAuditEvent({
    actorId,
    action: 'MISSION_STATUS_UPDATED',
    entity: 'Mission',
    entityId: id,
    incidentId: updated.incidentId,
    metadata: { status: normalizedStatus },
  });

  return { ...updated, status: normalizeMissionStatus(updated.status) };
};

export const addFieldUpdate = async (missionId, data, actorId = null) => {
  const { isConnected } = await checkDatabaseConnection();

  const updatePayload = {
    missionId,
    responderId: actorId,
    description: data.description || 'Field telemetry report submitted.',
    locationText: data.locationText || null,
    latitude: data.latitude ? Number(data.latitude) : null,
    longitude: data.longitude ? Number(data.longitude) : null,
    affectedPeople: data.affectedPeople ? Number(data.affectedPeople) : null,
  };

  if (!isConnected) {
    return {
      id: `FU-${Date.now()}`,
      ...updatePayload,
      createdAt: new Date().toISOString(),
    };
  }

  const created = await prisma.fieldUpdate.create({
    data: updatePayload,
  });

  await logAuditEvent({
    actorId,
    action: 'FIELD_UPDATE_SUBMITTED',
    entity: 'FieldUpdate',
    entityId: created.id,
    metadata: { missionId, affectedPeople: data.affectedPeople },
  });

  return created;
};

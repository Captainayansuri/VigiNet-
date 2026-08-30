import { prisma, checkDatabaseConnection } from '../config/prisma.js';
import { correlateReportToIncidents } from './incidentCorrelationService.js';
import { logAuditEvent } from './auditService.js';

export const createReport = async (data, actorId = null) => {
  const { isConnected } = await checkDatabaseConnection();

  const reportType = data.type || data.incidentType || 'GENERAL';
  const title = data.title || data.incidentLabel || `${reportType} Report`;
  const description = data.description || data.evidence?.message || 'Ground report submitted by citizen.';
  const severity = data.severity || 'MODERATE';
  const lat = data.latitude != null ? Number(data.latitude) : (data.coordinates?.lat != null ? Number(data.coordinates.lat) : null);
  const lng = data.longitude != null ? Number(data.longitude) : (data.coordinates?.lng != null ? Number(data.coordinates.lng) : null);
  const village = data.village || data.location?.area || null;
  const district = data.district || data.location?.district || null;
  const locationText = data.locationText || data.locationDetails || village || 'Field Location';
  const accuracyMeters = data.accuracyMeters != null ? Number(data.accuracyMeters) : null;
  const citizenId = data.citizenId || actorId || null;

  if (!isConnected) {
    // Offline / Dev fallback
    const fallbackReportId = `REP-${Date.now()}`;
    const mockReport = {
      id: fallbackReportId,
      citizenId,
      incidentId: 'VN-63481',
      type: reportType,
      title,
      description,
      severity,
      status: 'RECEIVED',
      latitude: lat,
      longitude: lng,
      village,
      district,
      locationText,
      createdAt: new Date().toISOString(),
    };
    return {
      report: mockReport,
      correlation: {
        correlated: true,
        incidentCode: 'VN-63481',
        confidence: 80,
        reason: 'Development correlation fallback to active incident VN-63481.',
      },
    };
  }

  // 1. Fetch active incidents for correlation
  const activeIncidents = await prisma.incident.findMany({
    where: {
      status: { in: ['OPEN', 'IN_PROGRESS'] },
    },
  });

  // 2. Perform deterministic correlation
  const correlation = correlateReportToIncidents(
    { type: reportType, latitude: lat, longitude: lng, village, district, locationText },
    activeIncidents
  );

  let targetIncidentId = correlation.incidentId;
  let targetIncidentCode = correlation.incidentCode;

  // 3. If not correlated to an existing incident, create a new canonical Incident
  if (!targetIncidentId) {
    const newIncidentCode = `VN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newIncident = await prisma.incident.create({
      data: {
        incidentCode: newIncidentCode,
        title: `${reportType.replace(/_/g, ' ')} in ${village || 'Area'}`,
        description: description,
        category: reportType,
        severity: severity,
        status: 'OPEN',
        latitude: lat,
        longitude: lng,
        accuracy: accuracyMeters ? `±${accuracyMeters} m` : '±20 m',
        area: village || locationText,
        district: district,
        locationText: locationText,
        reportedAt: new Date(),
        summary: `Incident initialized from citizen submission (${newIncidentCode}).`,
      },
    });

    targetIncidentId = newIncident.id;
    targetIncidentCode = newIncident.incidentCode;

    await logAuditEvent({
      actorId,
      action: 'INCIDENT_CREATED',
      entity: 'Incident',
      entityId: newIncident.id,
      incidentId: newIncident.id,
      metadata: { source: 'Deterministic Correlation Trigger', reportType },
    });
  }

  // 4. Persist the Report
  const newReport = await prisma.report.create({
    data: {
      citizenId,
      incidentId: targetIncidentId,
      type: reportType,
      title,
      description,
      severity,
      status: 'RECEIVED',
      source: data.source || 'APP',
      latitude: lat,
      longitude: lng,
      accuracyMeters,
      village,
      district,
      locationText,
      mediaMetadata: data.evidence || null,
      externalRef: data.id || null,
    },
    include: {
      incident: true,
    },
  });

  // 5. Log audit event
  await logAuditEvent({
    actorId,
    action: 'REPORT_SUBMITTED',
    entity: 'Report',
    entityId: newReport.id,
    incidentId: targetIncidentId,
    reportId: newReport.id,
    metadata: {
      correlationConfidence: correlation.confidence,
      correlated: correlation.correlated,
      targetIncidentCode,
    },
  });

  return {
    report: newReport,
    correlation: {
      ...correlation,
      incidentId: targetIncidentId,
      incidentCode: targetIncidentCode,
    },
  };
};

export const getReports = async (filter = {}) => {
  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    return [];
  }

  return prisma.report.findMany({
    where: {
      ...(filter.incidentId && { incidentId: filter.incidentId }),
      ...(filter.citizenId && { citizenId: filter.citizenId }),
      ...(filter.status && { status: filter.status }),
    },
    include: {
      evidence: true,
      incident: {
        select: { id: true, incidentCode: true, title: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getReportById = async (id) => {
  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    return null;
  }

  return prisma.report.findUnique({
    where: { id },
    include: {
      evidence: true,
      incident: true,
      verification: true,
    },
  });
};

import { prisma, checkDatabaseConnection } from '../config/prisma.js';
import { logAuditEvent } from './auditService.js';

export const verifyIncident = async (incidentIdOrCode, { status = 'CONFIRMED', reason, notes }, actorId = null) => {
  const { isConnected } = await checkDatabaseConnection();

  if (!isConnected) {
    return {
      incidentId: incidentIdOrCode,
      status,
      responderId: actorId || 'responder-offline',
      notes: notes || 'Verified in development mode.',
      createdAt: new Date().toISOString(),
    };
  }

  const incident = await prisma.incident.findFirst({
    where: {
      OR: [{ id: incidentIdOrCode }, { incidentCode: incidentIdOrCode }],
    },
  });

  if (!incident) {
    const error = new Error(`Incident ${incidentIdOrCode} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const record = await prisma.verificationRecord.create({
    data: {
      incidentId: incident.id,
      responderId: actorId,
      status: status === 'CONFIRMED' || status === 'VERIFIED' ? 'CONFIRMED' : status === 'DISPUTED' ? 'DISPUTED' : 'UNVERIFIED',
      reason,
      notes,
    },
  });

  // Update incident status if confirmed
  if (status === 'CONFIRMED' || status === 'VERIFIED') {
    await prisma.incident.update({
      where: { id: incident.id },
      data: { status: 'VERIFIED' },
    });
  }

  await logAuditEvent({
    actorId,
    action: 'VERIFICATION_CHANGED',
    entity: 'VerificationRecord',
    entityId: record.id,
    incidentId: incident.id,
    metadata: { status, notes, reason },
  });

  return record;
};

export const getVerificationHistory = async (incidentIdOrCode) => {
  const { isConnected } = await checkDatabaseConnection();
  if (!isConnected) return [];

  const incident = await prisma.incident.findFirst({
    where: {
      OR: [{ id: incidentIdOrCode }, { incidentCode: incidentIdOrCode }],
    },
  });

  if (!incident) return [];

  return prisma.verificationRecord.findMany({
    where: { incidentId: incident.id },
    include: {
      responder: { select: { id: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

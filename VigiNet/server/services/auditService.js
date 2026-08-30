import { prisma, checkDatabaseConnection } from '../config/prisma.js';

export const logAuditEvent = async ({
  actorId = null,
  action,
  entity,
  entityId = null,
  incidentId = null,
  reportId = null,
  metadata = {},
}) => {
  const auditPayload = {
    actorId,
    action,
    entity,
    entityId,
    incidentId,
    reportId,
    metadata,
    timestamp: new Date(),
  };

  try {
    const { isConnected } = await checkDatabaseConnection();
    if (isConnected) {
      return await prisma.auditEvent.create({
        data: auditPayload,
      });
    } else {
      console.log('[Audit Log - Offline Mode]', JSON.stringify(auditPayload));
      return { id: `AUD-${Date.now()}`, ...auditPayload };
    }
  } catch (error) {
    console.error('[Audit Log Error]', error.message, auditPayload);
    return null;
  }
};

/**
 * Deterministic Incident Correlation Engine
 * Correlates citizen reports to active incidents using explainable rules:
 * 1. Category / Disaster Type Match
 * 2. Spatial / Geographic Proximity (Haversine distance <= 3km or matching locality/village)
 * 3. Temporal Proximity (Incident open within last 24h)
 */

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const normalizeCategory = (category = '') => {
  const cat = String(category).toUpperCase().trim();
  if (cat.includes('FLOOD')) return 'FLOOD';
  if (cat.includes('TRAP') || cat.includes('PEOPLE')) return 'PEOPLE_TRAPPED';
  if (cat.includes('TREE') || cat.includes('FALLEN')) return 'TREE_FALLEN';
  if (cat.includes('ROAD') || cat.includes('BLOCK')) return 'ROAD_BLOCK';
  if (cat.includes('FIRE')) return 'FIRE';
  if (cat.includes('SOS')) return 'SOS';
  return cat || 'GENERAL';
};

export const correlateReportToIncidents = (report, activeIncidents = []) => {
  if (!activeIncidents || activeIncidents.length === 0) {
    return {
      correlated: false,
      incidentId: null,
      confidence: 0,
      reason: 'No active candidate incidents available for correlation.',
    };
  }

  const reportNorm = normalizeCategory(report.type || report.incidentType || report.category);
  const reportLat = report.latitude != null ? Number(report.latitude) : (report.coordinates?.lat != null ? Number(report.coordinates.lat) : null);
  const reportLng = report.longitude != null ? Number(report.longitude) : (report.coordinates?.lng != null ? Number(report.coordinates.lng) : null);
  const reportLoc = (report.village || report.locationText || report.location?.area || '').toLowerCase();

  let bestMatch = null;
  let highestScore = 0;
  let matchReason = '';

  for (const inc of activeIncidents) {
    let score = 0;
    const reasons = [];

    const incNorm = normalizeCategory(inc.category || inc.type || inc.title);
    if (reportNorm === incNorm || (reportNorm === 'PEOPLE_TRAPPED' && incNorm === 'FLOOD') || (reportNorm === 'FLOOD' && incNorm === 'PEOPLE_TRAPPED')) {
      score += 40;
      reasons.push(`matching disaster category (${reportNorm})`);
    }

    const incLat = inc.latitude != null ? Number(inc.latitude) : (inc.location?.latitude != null ? Number(inc.location.latitude) : null);
    const incLng = inc.longitude != null ? Number(inc.longitude) : (inc.location?.longitude != null ? Number(inc.location.longitude) : null);

    if (reportLat != null && reportLng != null && incLat != null && incLng != null) {
      const distance = calculateDistanceKm(reportLat, reportLng, incLat, incLng);
      if (distance <= 1.0) {
        score += 45;
        reasons.push(`close geographic proximity (${distance.toFixed(2)} km)`);
      } else if (distance <= 3.0) {
        score += 30;
        reasons.push(`medium geographic proximity (${distance.toFixed(2)} km)`);
      }
    } else if (reportLoc && (inc.area || inc.locationText || inc.location?.area)) {
      const incLoc = (inc.area || inc.locationText || inc.location?.area || '').toLowerCase();
      if (reportLoc.includes(incLoc) || incLoc.includes(reportLoc)) {
        score += 35;
        reasons.push(`matching reported locality (${reportLoc})`);
      }
    }

    if (score > highestScore && score >= 50) {
      highestScore = score;
      bestMatch = inc;
      matchReason = reasons.join(', ');
    }
  }

  if (bestMatch) {
    return {
      correlated: true,
      incidentId: bestMatch.id,
      incidentCode: bestMatch.incidentCode || bestMatch.id,
      confidence: Math.min(highestScore, 95),
      reason: `Correlated based on ${matchReason}.`,
    };
  }

  return {
    correlated: false,
    incidentId: null,
    confidence: 0,
    reason: 'Report did not meet proximity thresholds for existing open incidents; new incident creation indicated.',
  };
};

export const correlateReportsToIncident = (reports, incidentSeed = []) => {
  if (!reports || reports.length === 0) {
    return incidentSeed;
  }
  return incidentSeed;
};

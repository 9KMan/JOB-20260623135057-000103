import type { ConfidenceLevel, ConfidenceScore, DatasetResult, SearchSummary } from '../types.js';

export function scoreResultConfidence(result: DatasetResult, _bbl: string): ConfidenceScore {
  const reasons: string[] = [];
  const warnings: string[] = [];
  const normalized = result.normalizedData;
  const populated = normalized ? Object.values(normalized).filter((v: any) => v != null && v !== '').length : 0;
  const total = normalized ? Object.keys(normalized).length : 1;
  const pct = total > 0 ? (populated / total) * 100 : 0;
  const fieldCompleteness: ConfidenceLevel = pct >= 80 ? 'HIGH' : pct >= 50 ? 'MEDIUM' : 'LOW';
  if (fieldCompleteness !== 'HIGH') warnings.push('Low field completeness: ' + pct.toFixed(0) + '%');
  const ageDays = (Date.now() - new Date(result.fetchedAt).getTime()) / 86400000;
  const dataFreshness: ConfidenceLevel = ageDays <= 365 ? 'HIGH' : ageDays <= 730 ? 'MEDIUM' : 'LOW';
  if (dataFreshness !== 'HIGH') warnings.push('Stale data: ' + ageDays.toFixed(0) + ' days old');
  const sourceReliability: ConfidenceLevel = 'HIGH';
  const crossSourceAgreement: ConfidenceLevel = result.reconciled ? 'HIGH' : 'MEDIUM';
  const levels = [fieldCompleteness, dataFreshness, sourceReliability, crossSourceAgreement];
  const low = levels.filter(l => l === 'LOW').length;
  const overall: ConfidenceLevel = low >= 2 ? 'LOW' : low === 1 ? 'MEDIUM' : 'HIGH';
  if (overall === 'HIGH') reasons.push('All confidence dimensions high');
  const score = Math.round((fieldCompleteness === 'HIGH' ? 100 : fieldCompleteness === 'MEDIUM' ? 70 : 40) * 0.3 + (dataFreshness === 'HIGH' ? 100 : dataFreshness === 'MEDIUM' ? 70 : 40) * 0.25 + 100 * 0.2 + (crossSourceAgreement === 'HIGH' ? 100 : 70) * 0.25);
  return { overall, dataFreshness, sourceReliability, fieldCompleteness, crossSourceAgreement, score, reasons, warnings };
}

export function scoreSearchConfidence(results: DatasetResult[]): { overall: ConfidenceLevel; greenCount: number; yellowCount: number; redCount: number; reviewRequired: boolean } {
  let g = 0, y = 0, r = 0;
  for (const res of results) { const lvl = res.confidence?.overall ?? 'LOW'; if (lvl === 'HIGH') g++; else if (lvl === 'MEDIUM') y++; else r++; }
  const overall: ConfidenceLevel = r > 0 ? 'LOW' : y > 0 ? 'MEDIUM' : 'HIGH';
  return { overall, greenCount: g, yellowCount: y, redCount: r, reviewRequired: overall !== 'HIGH' };
}

export function buildSearchSummary(results: DatasetResult[]): SearchSummary {
  const byCategory: Record<string, number> = {};
  const byConfidence: Record<string, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  let verifiedCount = 0, unverifiedCount = 0, mismatchedCount = 0;
  for (const r of results) {
    byCategory[r.datasetId] = (byCategory[r.datasetId] ?? 0) + 1;
    byConfidence[r.confidence?.overall ?? 'LOW']++;
    if (r.verificationStatus === 'VERIFIED') verifiedCount++;
    else if (r.verificationStatus === 'UNVERIFIED') unverifiedCount++;
    else if (r.verificationStatus === 'MISMATCH') mismatchedCount++;
  }
  return { totalResults: results.length, byCategory: byCategory as any, byConfidence: byConfidence as any, verifiedCount, unverifiedCount, mismatchedCount, greenCount: byConfidence['HIGH'], yellowCount: byConfidence['MEDIUM'], redCount: byConfidence['LOW'] } as SearchSummary;
}

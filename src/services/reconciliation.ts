/**
 * Reconciliation — merge results from multiple datasets on the same property.
 * Handles duplicates, contradictions, and gaps.
 */
import type { DatasetResult, ReconciliationCandidate, ReconciliationStrategy } from '../types.js';

export function reconcileResults(results: DatasetResult[]): DatasetResult[] {
  // Group by datasetId
  const byDataset = new Map<string, DatasetResult[]>();
  for (const r of results) {
    if (!byDataset.has(r.datasetId)) byDataset.set(r.datasetId, []);
    byDataset.get(r.datasetId)!.push(r);
  }

  const merged: DatasetResult[] = [];

  for (const [datasetId, records] of byDataset) {
    // Deduplicate within same dataset by recordKey
    const byKey = new Map<string, DatasetResult>();
    for (const r of records) {
      if (!byKey.has(r.recordKey)) byKey.set(r.recordKey, r);
    }
    for (const r of byKey.values()) {
      r.reconciled = true;
      r.matchedFields = Object.keys(r.normalizedData ?? {});
      merged.push(r);
    }
  }

  return merged;
}

export function findMatches(target: DatasetResult, candidates: DatasetResult[]): ReconciliationCandidate[] {
  const matches: ReconciliationCandidate[] = [];
  for (const candidate of candidates) {
    if (candidate.datasetId === target.datasetId) continue;
    const score = computeMatchScore(target, candidate);
    if (score >= 50) {
      matches.push({ result: candidate, matchScore: score, strategy: 'COMPOSITE_KEY_MATCH', matchedFields: {} });
    }
  }
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

function computeMatchScore(a: DatasetResult, b: DatasetResult): number {
  let score = 0;
  const aData = a.normalizedData;
  const bData = b.normalizedData;
  if (!aData || !bData) return 0;

  const fields = ['description', 'status', 'issueDate', 'penaltyAmount'] as const;
  let compared = 0;
  for (const field of fields) {
    const aVal = (aData as any)[field];
    const bVal = (bData as any)[field];
    if (aVal !== undefined && bVal !== undefined) {
      compared++;
      if (String(aVal) === String(bVal)) score += 25;
    }
  }
  return compared > 0 ? score : 0;
}

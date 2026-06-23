/**
 * Mock Database Layer — Cloudflare D1 / R2 stubs
 * In production, replace these with real D1 client calls.
 * All functions return the same shapes as the real implementation would.
 */

import type {
  Search,
  SearchCreateInput,
  SearchStatus,
  Property,
  DatasetResult,
  Report,
  BBL,
  Borough,
  BoroughCode,
  BOROUGH_CODES,
  InternalFileNumber,
  ConfidenceScore,
} from '../types';

// ─── In-memory store (resets on worker restart — for demo only) ───────────────

const searches = new Map<string, Search>();
const properties = new Map<string, Property>();
const results = new Map<string, DatasetResult[]>();
const reports = new Map<string, Report>();
const fileNumbers = new Map<string, InternalFileNumber>();

let fileSequence = 1234;

// ─── Internal File Number ─────────────────────────────────────────────────────

async function nextFileNumber(): Promise<InternalFileNumber> {
  fileSequence++;
  const year = new Date().getFullYear();
  const ifn: InternalFileNumber = {
    id: `ifn_${Date.now()}_${fileSequence}`,
    prefix: 'NYC-PR',
    sequence: fileSequence,
    display: `NYC-PR-${year}-${String(fileSequence).padStart(6, '0')}`,
    year,
    createdAt: new Date().toISOString(),
  };
  fileNumbers.set(ifn.id, ifn);
  return ifn;
}

// ─── Search CRUD ───────────────────────────────────────────────────────────────

export async function createSearch(
  input: SearchCreateInput,
  property: Property
): Promise<Search> {
  const id = `srch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const ifn = await nextFileNumber();

  const search: Search = {
    id,
    internalFileNumber: ifn,
    property,
    status: 'PENDING',
    priority: input.priority ?? 'NORMAL',
    requestedBy: input.requestedBy,
    requestedAt: new Date().toISOString(),
    startedAt: undefined,
    completedAt: undefined,
    reviewedBy: undefined,
    reviewedAt: undefined,
    approvedBy: undefined,
    approvedAt: undefined,
    rejectionReason: undefined,
    notes: input.notes ?? [],
    datasetsQueried: [],
    datasetsSucceeded: [],
    datasetsFailed: [],
    errorMessage: undefined,
    resultCount: 0,
    confidenceScore: {
      overall: 'HIGH',
      dataFreshness: 'HIGH',
      sourceReliability: 'HIGH',
      fieldCompleteness: 'HIGH',
      crossSourceAgreement: 'HIGH',
      score: 100,
      reasons: ['Search created'],
      warnings: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  searches.set(id, search);
  return search;
}

export async function getSearchById(id: string): Promise<Search | null> {
  return searches.get(id) ?? null;
}

export async function listSearches(opts: {
  page: number;
  pageSize: number;
  status?: SearchStatus;
  borough?: Borough;
  internalFileNumber?: string;
  requestedBy?: string;
}): Promise<{ searches: Search[]; total: number; page: number; pageSize: number }> {
  let items = Array.from(searches.values());

  if (opts.status) {
    items = items.filter((s) => s.status === opts.status);
  }
  if (opts.borough) {
    items = items.filter((s) => s.property.address.borough === opts.borough);
  }
  if (opts.internalFileNumber) {
    items = items.filter(
      (s) => s.internalFileNumber.display.includes(opts.internalFileNumber!)
    );
  }
  if (opts.requestedBy) {
    items = items.filter((s) => s.requestedBy === opts.requestedBy);
  }

  // Sort by requestedAt descending
  items.sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );

  const total = items.length;
  const offset = (opts.page - 1) * opts.pageSize;
  const pageItems = items.slice(offset, offset + opts.pageSize);

  return {
    searches: pageItems,
    total,
    page: opts.page,
    pageSize: opts.pageSize,
  };
}

export async function updateSearchStatus(
  id: string,
  status: SearchStatus,
  extra: Partial<Search> = {}
): Promise<Search | null> {
  const search = searches.get(id);
  if (!search) return null;

  const updated: Search = {
    ...search,
    status,
    ...extra,
    updatedAt: new Date().toISOString(),
  };

  if (status === 'RUNNING' && !updated.startedAt) {
    updated.startedAt = new Date().toISOString();
  }
  if (['COMPLETE', 'APPROVED', 'REJECTED', 'FAILED'].includes(status) && !updated.completedAt) {
    updated.completedAt = new Date().toISOString();
  }

  searches.set(id, updated);
  return updated;
}

export async function saveSearchResults(
  searchId: string,
  datasetResults: DatasetResult[]
): Promise<void> {
  results.set(searchId, datasetResults);

  // Update search summary
  const search = searches.get(searchId);
  if (search) {
    const uniqueDatasets = [...new Set(datasetResults.map((r) => r.datasetId))];
    const succeeded = uniqueDatasets.filter((d) =>
      datasetResults.some((r) => r.datasetId === d && r.verificationStatus !== 'UNAVAILABLE')
    );
    const failed = uniqueDatasets.filter(
      (d) => !datasetResults.some((r) => r.datasetId === d)
    );

    const overallScore = computeOverallConfidence(datasetResults);

    searches.set(searchId, {
      ...search,
      status: failed.length > 0 ? 'PARTIAL' : 'COMPLETE',
      datasetsQueried: uniqueDatasets,
      datasetsSucceeded: succeeded,
      datasetsFailed: failed,
      resultCount: datasetResults.length,
      confidenceScore: overallScore,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function getSearchResults(searchId: string): Promise<DatasetResult[]> {
  return results.get(searchId) ?? [];
}

// ─── Property CRUD ────────────────────────────────────────────────────────────

export async function saveProperty(property: Property): Promise<Property> {
  properties.set(property.id, property);
  return property;
}

export async function getPropertyByBBL(bbl: string): Promise<Property | null> {
  for (const p of properties.values()) {
    if (p.bbl.bbl === bbl) return p;
  }
  return null;
}

// ─── Report CRUD ───────────────────────────────────────────────────────────────

export async function createReport(searchId: string): Promise<Report> {
  const report: Report = {
    id: `rpt_${Date.now()}`,
    searchId,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  reports.set(report.id, report);
  return report;
}

export async function updateReport(
  id: string,
  updates: Partial<Report>
): Promise<Report | null> {
  const report = reports.get(id);
  if (!report) return null;
  const updated = { ...report, ...updates };
  reports.set(id, updated);
  return updated;
}

export async function getReportBySearchId(searchId: string): Promise<Report | null> {
  for (const r of reports.values()) {
    if (r.searchId === searchId) return r;
  }
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeOverallConfidence(datasetResults: DatasetResult[]): ConfidenceScore {
  if (datasetResults.length === 0) {
    return {
      overall: 'HIGH',
      dataFreshness: 'HIGH',
      sourceReliability: 'HIGH',
      fieldCompleteness: 'HIGH',
      crossSourceAgreement: 'HIGH',
      score: 100,
      reasons: ['No results to evaluate'],
      warnings: [],
    };
  }

  const avgScore =
    datasetResults.reduce((sum, r) => sum + r.confidence.score, 0) /
    datasetResults.length;

  const highCount = datasetResults.filter((r) => r.confidence.overall === 'HIGH').length;
  const mediumCount = datasetResults.filter(
    (r) => r.confidence.overall === 'MEDIUM'
  ).length;
  const lowCount = datasetResults.filter((r) => r.confidence.overall === 'LOW').length;

  let overall: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
  if (lowCount / datasetResults.length > 0.3) overall = 'LOW';
  else if (mediumCount / datasetResults.length > 0.3 || lowCount / datasetResults.length > 0.1)
    overall = 'MEDIUM';

  const reasons: string[] = [];
  const warnings: string[] = [];

  reasons.push(
    `${highCount} HIGH, ${mediumCount} MEDIUM, ${lowCount} LOW confidence results`
  );
  if (lowCount > 0) {
    warnings.push(`${lowCount} result(s) have low confidence`);
  }
  if (avgScore < 70) {
    warnings.push(`Average confidence score ${avgScore.toFixed(0)} is below threshold`);
  }

  return {
    overall,
    dataFreshness: overall,
    sourceReliability: overall,
    fieldCompleteness: overall,
    crossSourceAgreement: overall,
    score: Math.round(avgScore),
    reasons,
    warnings,
  };
}

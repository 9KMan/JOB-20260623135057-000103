import type { DatasetResult, DatasetId } from '../types.js';
import { getDatasetById } from '../data/datasets.js';
import { getFetcherForDataset } from './datasets/registry.js';
import { scoreResultConfidence } from './confidence-scorer.js';

const circuits = new Map<string, { state: string; failures: number; nextAttempt?: string }>();

function canAttempt(id: string): boolean {
  const cb = circuits.get(id);
  if (!cb || cb.state === 'CLOSED') return true;
  if (cb.state === 'OPEN' && cb.nextAttempt && Date.now() >= new Date(cb.nextAttempt).getTime()) { cb.state = 'HALF_OPEN'; return true; }
  return cb.state === 'HALF_OPEN';
}

function recordFailure(id: string): void {
  const cb = circuits.get(id) ?? { state: 'CLOSED', failures: 0 };
  cb.failures++;
  cb.state = cb.failures >= 5 ? 'OPEN' : 'CLOSED';
  cb.nextAttempt = cb.state === 'OPEN' ? new Date(Date.now() + 30000).toISOString() : undefined;
  circuits.set(id, cb);
}

function recordSuccess(id: string): void { circuits.set(id, { state: 'CLOSED', failures: 0 }); }

export class DatasetFetcherService {
  constructor(private timeoutMs = 15000) {}

  async fetchOne(id: DatasetId, bbl: string): Promise<DatasetResult> {
    const config = getDatasetById(id);
    const start = Date.now();
    if (!config) return this._err(id, bbl, 'Unknown dataset: ' + id, start);
    if (!canAttempt(id)) return this._err(id, bbl, 'Circuit breaker OPEN', start);
    const fetcher = getFetcherForDataset(config);
    try {
      const raw = await Promise.race([
        fetcher.fetch(bbl),
        new Promise((_, r) => setTimeout(() => r(new Error('timeout')), this.timeoutMs)),
      ]) as Record<string, unknown>[];
      const base = this._base(id, bbl, start);
      const fetcherAny = fetcher as any;
      if (fetcherAny.normalize && raw.length > 0) (base.normalizedData as any) = fetcherAny.normalize(raw[0], config);
      base.confidence = scoreResultConfidence(base, bbl);
      recordSuccess(id);
      return base;
    } catch (e: any) {
      recordFailure(id);
      return this._err(id, bbl, e.message, start);
    }
  }

  private _base(id: DatasetId, bbl: string, start: number): DatasetResult {
    const cfg = getDatasetById(id);
    return {
      id: Math.random().toString(36).slice(2), searchId: '', datasetId: id,
      datasetName: cfg?.name ?? id, recordKey: bbl, data: {},
      normalizedData: { description: '', status: 'UNKNOWN' } as any,
      confidence: { overall: 'LOW', dataFreshness: 'LOW', sourceReliability: 'MEDIUM', fieldCompleteness: 'LOW', crossSourceAgreement: 'LOW', score: 0, reasons: [], warnings: [] },
      sourceUrl: cfg?.sourceUrl, fetchedAt: new Date().toISOString(),
      reconciled: false, verificationStatus: 'UNVERIFIED', matchedFields: [],
    };
  }

  private _err(id: DatasetId, bbl: string, msg: string, _start: number): DatasetResult {
    const r = this._base(id, bbl, Date.now());
    r.confidence.warnings.push(msg);
    return r;
  }
}

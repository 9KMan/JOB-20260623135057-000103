import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { nanoid } from 'nanoid';
import type { Search, SearchStatus, DatasetResult } from '../types.js';
import { createToken } from './auth.js';
import { getAllDatasetConfigs, getDatasetById } from '../data/datasets.js';
import { DatasetFetcherService } from '../services/dataset-fetcher.js';
import { scoreSearchConfidence, buildSearchSummary } from '../services/confidence-scorer.js';

const app = new Hono();
app.use('*', cors({ origin: '*', allowMethods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));

app.get('/health', (c) => c.json({ ok: true, version: '1.0.0', timestamp: new Date().toISOString(), datasets: getAllDatasetConfigs().length }));

app.post('/auth/login', async (c) => {
  const { email } = await c.req.json<{ email: string }>();
  return c.json({ ok: true, token: await createToken(nanoid(), email, 'OPERATOR') });
});

app.get('/api/datasets', (c) => {
  const cfgs = getAllDatasetConfigs();
  return c.json({ success: true, data: cfgs.map(d => ({ id: d.id, name: d.name, category: d.category, source: d.source, description: d.description })) });
});

app.post('/api/searches', async (c) => {
  const body = await c.req.json<{ address: string; borough: string; searchTypes?: string[]; requestedBy?: string }>();
  if (!body.address || !body.borough) return c.json({ success: false, error: 'address and borough required' }, 400);
  const bbl = await resolveAddressToBBL(body.address, body.borough);
  if (!bbl) return c.json({ success: false, error: 'Could not resolve address to BBL' }, 422);
  const searchId = nanoid();
  const fileNum = 'NYC-PR-' + new Date().getFullYear() + '-' + searchId.slice(0, 6).toUpperCase();
  const datasetIds = (body.searchTypes?.length ?? 0) > 0
    ? getAllDatasetConfigs().filter(d => body.searchTypes!.some(t => d.id.toLowerCase().includes(t.toLowerCase()))).map(d => d.id)
    : getAllDatasetConfigs().map(d => d.id);
  const fetcher = new DatasetFetcherService();
  const results: DatasetResult[] = [];
  await Promise.all(datasetIds.slice(0, 20).map(async (id) => {
    const cfg = getDatasetById(id);
    if (!cfg) return;
    const result = await fetcher.fetchOne(id, bbl);
    result.searchId = searchId;
    results.push(result);
  }));
  const summary = scoreSearchConfidence(results);
  const search: Search = {
    id: searchId,
    internalFileNumber: { id: nanoid(), prefix: 'NYC-PR', sequence: Date.now(), display: fileNum, year: new Date().getFullYear(), createdAt: new Date().toISOString() },
    property: { id: nanoid(), address: { rawInput: body.address, normalizedAddress: body.address, streetNumber: '', streetName: body.address, borough: body.borough as any, boroughCode: '1' }, bbl: { borough: body.borough.toUpperCase(), boroughCode: bbl[0], block: bbl.slice(1,6), lot: bbl.slice(6,10), bbl }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any,
    status: summary.reviewRequired ? 'REVIEW_IN_PROGRESS' : 'COMPLETE',
    priority: 'NORMAL',
    requestedBy: body.requestedBy ?? 'unknown',
    requestedAt: new Date().toISOString(),
    datasetsQueried: datasetIds,
    datasetsSucceeded: results.filter(r => r.confidence.overall !== 'LOW').map(r => r.datasetId),
    datasetsFailed: results.filter(r => r.confidence.overall === 'LOW').map(r => r.datasetId),
    resultCount: results.length,
    confidenceScore: { overall: summary.overall, dataFreshness: 'HIGH', sourceReliability: 'HIGH', fieldCompleteness: 'MEDIUM', crossSourceAgreement: 'MEDIUM', score: 75, reasons: [], warnings: [] } as any,
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;
  return c.json({ success: true, data: { search, results, summary: buildSearchSummary(results) } }, 201);
});

app.get('/api/searches/:id', (c) => c.json({ success: true, data: { id: c.req.param('id'), note: 'Fetch from D1 in production' } }));

app.post('/api/searches/:id/review', async (c) => {
  const { action, reviewer, notes } = await c.req.json<{ action: 'approve' | 'reject'; reviewer: string; notes?: string }>();
  const status: SearchStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
  return c.json({ success: true, data: { searchId: c.req.param('id'), status, reviewedBy: reviewer, reviewedAt: new Date().toISOString(), notes } });
});

app.post('/api/searches/:id/report', (c) => c.json({ success: true, data: { searchId: c.req.param('id'), reportUrl: 'https://reports.example.com/' + c.req.param('id') + '/report.pdf', status: 'PENDING' } }));

async function resolveAddressToBBL(address: string, borough: string): Promise<string | null> {
  const boroMap: Record<string, string> = { manhattan: '1', bronx: '2', brooklyn: '3', queens: '4', 'staten island': '5' };
  const boro = boroMap[borough.toLowerCase()] ?? '1';
  return boro + '000010000';
}

export default { fetch: app.fetch, notFound: app.notFound };

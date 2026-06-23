/**
 * API Routes — REST wrapper for the Cloudflare Worker.
 * Re-exports from search-worker.ts for modular routing.
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { nanoid } from 'nanoid';
import { createToken, getCurrentUser } from './auth.js';
import { getAllDatasetConfigs, getDatasetById } from '../data/datasets.js';
import { DatasetFetcherService } from '../services/dataset-fetcher.js';
import { scoreSearchConfidence, buildSearchSummary } from '../services/confidence-scorer.js';

const app = new Hono();
app.use('*', cors({ origin: '*', allowMethods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));

// ── Search CRUD ────────────────────────────────────────────────────────────────
app.post('/api/searches', async (c) => {
  const body = await c.req.json<{ address: string; borough: string; searchTypes?: string[] }>();
  if (!body.address || !body.borough) return c.json({ success: false, error: 'address and borough required' }, 400);
  const bbl = resolveBBLDemo(body.borough);
  const searchId = nanoid();
  const fetcher = new DatasetFetcherService();
  const results = [];
  for (const cfg of getAllDatasetConfigs().slice(0, 20)) {
    const r = await fetcher.fetchOne(cfg.id, bbl);
    r.searchId = searchId;
    results.push(r);
  }
  const summary = scoreSearchConfidence(results);
  return c.json({ success: true, data: { searchId, results, summary: buildSearchSummary(results), status: summary.reviewRequired ? 'REVIEW_IN_PROGRESS' : 'COMPLETE' } }, 201);
});

app.get('/api/searches/:id', (c) => c.json({ success: true, data: { id: c.req.param('id') } }));
app.get('/api/searches/:id/results', (c) => c.json({ success: true, data: { searchId: c.req.param('id') } }));
app.post('/api/searches/:id/review', async (c) => {
  const { action, reviewer } = await c.req.json<{ action: string; reviewer: string }>();
  return c.json({ success: true, data: { searchId: c.req.param('id'), status: action === 'approve' ? 'APPROVED' : 'REJECTED', reviewedBy: reviewer } });
});
app.post('/api/searches/:id/report', (c) => c.json({ success: true, data: { searchId: c.req.param('id'), status: 'PENDING' } }));

function resolveBBLDemo(borough: string): string {
  const m: Record<string, string> = { manhattan: '1', bronx: '2', brooklyn: '3', queens: '4', 'staten island': '5' };
  return (m[borough.toLowerCase()] ?? '1') + '000010000';
}

export default app;

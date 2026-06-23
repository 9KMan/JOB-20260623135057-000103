/**
 * Pipeline — orchestrates BBL resolution → parallel dataset fetching → result assembly.
 */
import type { Search, DatasetResult } from '../types.js';
import { resolveAddressToBBL, type BBL } from './bbl-resolver.js';
import { getAllDatasetConfigs, getDatasetById } from '../data/datasets.js';
import { DatasetFetcherService } from './dataset-fetcher.js';
import { scoreSearchConfidence, buildSearchSummary } from './confidence-scorer.js';

export async function runSearch(address: string, borough: string, searchTypes?: string[]): Promise<{
  search: Search;
  results: DatasetResult[];
  summary: ReturnType<typeof scoreSearchConfidence>;
}> {
  const bbl = await resolveAddressToBBL(address, borough);
  if (!bbl) throw new Error('Could not resolve address to BBL: ' + address + ', ' + borough);

  const datasetIds = searchTypes?.length
    ? getAllDatasetConfigs().filter(d => searchTypes.some(t => d.id.toLowerCase().includes(t.toLowerCase()))).map(d => d.id)
    : getAllDatasetConfigs().map(d => d.id);

  const fetcher = new DatasetFetcherService();
  const results: DatasetResult[] = [];

  await Promise.all(datasetIds.slice(0, 20).map(async (id) => {
    const cfg = getDatasetById(id);
    if (!cfg) return;
    const result = await fetcher.fetchOne(id, bbl.bbl);
    result.searchId = 'search-' + Math.random().toString(36).slice(2);
    results.push(result);
  }));

  const summary = scoreSearchConfidence(results);
  return { search: {} as Search, results, summary };
}

import type { DatasetConfig } from '../../data/datasets.js';

export abstract class DatasetFetcher {
  constructor(protected config: DatasetConfig) {}
  abstract fetch(bbl: string): Promise<Record<string, unknown>[]>;
}

export class SocrataFetcher extends DatasetFetcher {
  async fetch(bbl: string): Promise<Record<string, unknown>[]> {
    const id = this.config.sourceUrl.split('/resource/')[1]?.replace('.json', '') ?? this.config.id;
    const u = 'https://data.cityofnewyork.us/resource/' + id + '.json?boro=' + bbl[0] + '&block=' + bbl.slice(1,6) + '&lot=' + bbl.slice(6,10) + '&$limit=50';
    const res = await fetch(u, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Socrata ' + res.status);
    return await res.json() as Record<string, unknown>[];
  }
}

export class ArcGISFetcher extends DatasetFetcher {
  async fetch(bbl: string): Promise<Record<string, unknown>[]> {
    const url = new URL(this.config.sourceUrl);
    url.searchParams.set('where', "BBL='" + bbl + "'");
    url.searchParams.set('outFields', '*');
    url.searchParams.set('f', 'json');
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('ArcGIS ' + res.status);
    const data = await res.json() as any;
    return (data.features ?? []).map((f: any) => f.attributes ?? f);
  }
}

export class AgencyApiFetcher extends DatasetFetcher {
  async fetch(bbl: string): Promise<Record<string, unknown>[]> {
    const url = new URL(this.config.sourceUrl);
    url.searchParams.set('bbl', bbl);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Agency API ' + res.status);
    const data = await res.json() as any;
    return Array.isArray(data) ? data : [data];
  }
}

export class InternalFetcher extends DatasetFetcher {
  async fetch(_bbl: string): Promise<Record<string, unknown>[]> { return []; }
}

export function getFetcherForDataset(config: DatasetConfig): DatasetFetcher {
  switch (config.source) {
    case 'SOCRATA':    return new SocrataFetcher(config);
    case 'ARCGIS':     return new ArcGISFetcher(config);
    case 'DIRECT_API': return new AgencyApiFetcher(config);
    case 'INTERNAL':   return new InternalFetcher(config);
    default:           return new InternalFetcher(config);
  }
}

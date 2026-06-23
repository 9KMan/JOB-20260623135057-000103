import type { DatasetResult } from '../types.js';
import { getDatasetById } from '../data/datasets.js';

export function generateVerifyUrl(result: DatasetResult, bbl?: string): string | undefined {
  const config = getDatasetById(result.datasetId);
  if (!config) return undefined;
  if (config.verifyUrlTemplate && bbl) {
    if (config.verifyUrlTemplate.includes('{{bbl}}')) return config.verifyUrlTemplate.replace('{{bbl}}', bbl);
    if (config.verifyUrlTemplate.includes('{{boro}}')) {
      return config.verifyUrlTemplate.replace('{{boro}}', bbl[0]).replace('{{block}}', bbl.slice(1,6)).replace('{{lot}}', bbl.slice(6,10));
    }
  }
  if (config.sourceUrl?.includes('data.cityofnewyork.us')) {
    const datasetId = config.sourceUrl.split('/resource/')[1]?.replace('.json', '') ?? result.datasetId;
    if (!bbl) return 'https://data.cityofnewyork.us/resource/' + datasetId;
    return 'https://data.cityofnewyork.us/resource/' + datasetId + '.json?boro=' + bbl[0] + '&block=' + bbl.slice(1,6) + '&lot=' + bbl.slice(6,10);
  }
  return config.sourceUrl;
}

export function generateRawDataUrl(result: DatasetResult, bbl?: string): string | undefined {
  const config = getDatasetById(result.datasetId);
  if (!config) return undefined;
  if (config.source === 'SOCRATA') {
    const datasetId = config.sourceUrl.split('/resource/')[1]?.replace('.json', '') ?? result.datasetId;
    if (!bbl) return 'https://data.cityofnewyork.us/resource/' + datasetId + '.json';
    return 'https://data.cityofnewyork.us/resource/' + datasetId + '.json?boro=' + bbl[0] + '&block=' + bbl.slice(1,6) + '&lot=' + bbl.slice(6,10);
  }
  return config.sourceUrl;
}

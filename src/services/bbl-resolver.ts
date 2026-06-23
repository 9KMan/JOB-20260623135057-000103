/**
 * BBL Resolver — NYC address → borough/block/lot canonical identifier.
 */
import type { Borough, PropertyAddress } from '../types.js';

const BORO_MAP: Record<string, string> = { manhattan: '1', bronx: '2', brooklyn: '3', queens: '4', 'staten island': '5' };
const BORO_NAMES: Record<string, string> = { '1': 'MANHATTAN', '2': 'BRONX', '3': 'BROOKLYN', '4': 'QUEENS', '5': 'STATEN ISLAND' };

export interface BBL { borough: string; boroughCode: string; block: string; lot: string; bbl: string; }

/**
 * Parse a BBL string (e.g. "1001234567") into components.
 */
export function parseBBL(bbl: string): BBL | null {
  if (!bbl || bbl.length !== 10) return null;
  return { borough: BORO_NAMES[bbl[0]] ?? 'UNKNOWN', boroughCode: bbl[0], block: bbl.slice(1, 6), lot: bbl.slice(6, 10), bbl };
}

/**
 * Convert a BBL object to string format.
 */
export function bblToString(bbl: BBL): string { return bbl.bbl; }

/**
 * Normalize a borough name to its code.
 */
export function boroughToCode(borough: string): string {
  return BORO_MAP[borough.toLowerCase()] ?? borough;
}

/**
 * Resolve an address + borough to a BBL via NYC Geoclient API.
 */
export async function resolveAddressToBBL(address: string, borough: string): Promise<BBL | null> {
  const boroCode = boroughToCode(borough);
  // In production: call https://api.nyc.gov/geoclient/v2/address.json
  // For demo, construct a deterministic BBL
  const hash = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const block = String(hash % 99999).padStart(5, '0');
  const lot = String((hash * 7) % 9999).padStart(4, '0');
  return { borough: BORO_NAMES[boroCode] ?? borough.toUpperCase(), boroughCode: boroCode, block, lot, bbl: boroCode + block + lot };
}

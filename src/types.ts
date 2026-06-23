/**
 * NYC Property Records Search Platform — Type Definitions
 * All shared TypeScript interfaces for the platform
 */

// ─── Borough / Address ──────────────────────────────────────────────────────

export type Borough =
  | 'MANHATTAN'
  | 'BRONX'
  | 'BROOKLYN'
  | 'QUEENS'
  | 'STATEN_ISLAND';

export type BoroughCode = '1' | '2' | '3' | '4' | '5';

/** NYC Borough codes used in BBL */
export const BOROUGH_CODES: Record<Borough, BoroughCode> = {
  MANHATTAN: '1',
  BRONX: '2',
  BROOKLYN: '3',
  QUEENS: '4',
  STATEN_ISLAND: '5',
};

/** Borough name to code mapping */
export const BOROUGH_NAME_TO_CODE: Record<string, BoroughCode> = {
  manhattan: '1',
  bronx: '2',
  brooklyn: '3',
  queens: '4',
  'staten island': '5',
  'staten_island': '5',
};

/** BBL = Borough (1 digit) + Block (5 digits) + Lot (4 digits) */
export interface BBL {
  borough: Borough;
  boroughCode: BoroughCode;
  block: string; // up to 5 digits, zero-padded
  lot: string;  // up to 4 digits, zero-padded
  bbl: string;  // concatenated "boroughblocklot", e.g. "1012340056"
}

/** Parsed / normalized property address */
export interface PropertyAddress {
  rawInput: string;
  normalizedAddress: string;
  streetNumber: string;
  streetName: string;
  borough: Borough;
  boroughCode: BoroughCode;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

/** Primary property identifier used throughout the platform */
export interface Property {
  id: string; // UUID
  address: PropertyAddress;
  bbl: BBL;
  taxLotAddress?: string;
  condo?: boolean;
  condoNumber?: string;
  createdAt: string; // ISO-8601
  updatedAt: string;
}

// ─── Search / Workflow ───────────────────────────────────────────────────────

export type SearchStatus =
  | 'PENDING'         // Created, not yet started
  | 'RUNNING'         // Fetching datasets
  | 'PARTIAL'         // Some datasets failed
  | 'COMPLETE'        // All done, ready for review
  | 'REVIEW_IN_PROGRESS' // Human reviewing
  | 'APPROVED'        // Human signed off
  | 'REJECTED'        // Human rejected / needs re-run
  | 'FAILED';        // Catastrophic failure

export type SearchPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface InternalFileNumber {
  id: string; // UUID
  prefix: string; // e.g. "NYC-PR"
  sequence: number;
  display: string; // e.g. "NYC-PR-2026-001234"
  year: number;
  createdAt: string;
}

export interface Search {
  id: string; // UUID
  internalFileNumber: InternalFileNumber;
  property: Property;
  status: SearchStatus;
  priority: SearchPriority;
  requestedBy: string; // user ID
  requestedAt: string;
  startedAt?: string;
  completedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes: string[];
  datasetsQueried: string[]; // dataset IDs
  datasetsSucceeded: string[];
  datasetsFailed: string[];
  errorMessage?: string;
  resultCount: number;
  confidenceScore: ConfidenceScore;
  createdAt: string;
  updatedAt: string;
}

export interface SearchCreateInput {
  address: string;
  borough: Borough;
  priority?: SearchPriority;
  requestedBy: string;
  notes?: string[];
}

// ─── Dataset / Results ───────────────────────────────────────────────────────

export type DatasetId =
  // DOB (Buildings)
  | 'DOB_DOBViolations'
  | 'DOB_DOB NOWECB'
  | 'DOB_DOBJobsMain'
  | 'DOB_DOBPermitApplication'
  | 'DOB_DOBFacadeCompliance'
  // HPD
  | 'HPD_HPDViolations'
  | 'HPD_HPDHousingLitigations'
  | 'HPD_HPDCaregiverIncome'
  | 'HPD_HPDRegistration'
  // ECB / Environmental
  | 'ECB_ECBViolations'
  | 'DEP_DEPEnforcement'
  | 'DEP_DEPAirQuality'
  | 'DEP_DEPWastewater'
  // Fire
  | 'FDNY_FDNYInspections'
  | 'FDNY_FDNYViolations'
  | 'FDNY_FDNYIncidents'
  // Tax
  | 'DOF_DOFTaxLot'
  | 'DOF_DOFTaxHistory'
  | 'DOF_DOFCondominium'
  // Water
  | 'NYCWater_BillingAccount'
  | 'NYCWater_BillingCharges'
  | 'NYCWater_Consumption'
  // Housing
  | 'HPD_HPDComplaints'
  | 'HPD_HPDRepairOrders'
  | 'HPD_HPDVacateOrders'
  // Landmarks
  | 'LPC_LandmarkDesignations'
  | 'LPC_LandmarkPermits'
  // Zoning
  | 'NYCPlanning_ZoningMap'
  | 'NYCPlanning_LandUse'
  | 'NYCPlanning_Geocoding'
  // ACRIS (property conveyance)
  | 'ACRIS_RealPropertyLegals'
  | 'ACRIS_RealPropertyParties'
  | 'ACRIS_RealPropertyConveyances'
  | 'ACRIS_UCCCollateral'
  // LIS-Pendens / Court
  | 'COURT_LISPenens'
  | 'COURT_CivilCourt'
  | 'COURT_SupremeCourt'
  // OATH / Tribunal
  | 'OATH_OATHHearings'
  | 'OATH_OATHOrders'
  // DOF Property-shared
  | 'DOF_PropertyMaster'
  | 'DOF_PropertyAddress'
  | 'DOF_PropertyValue'
  // Misc
  | 'NYCGeoC_API'
  | 'NYC_OAO'
  | 'NYC_DCAS'
  | 'NYC_BridgeReports'
  | 'NYC_DOT_Infrastructure';

export type DatasetCategory =
  | 'BUILDINGS'
  | 'HOUSING'
  | 'ENVIRONMENTAL'
  | 'FIRE'
  | 'TAX'
  | 'WATER'
  | 'LAND_RECORDS'
  | 'COURT'
  | 'ZONING'
  | 'LANDMARKS'
  | 'INFRASTRUCTURE'
  | 'GEOCODING';

export type DataSource = 'SOCRATA' | 'ARCGIS' | 'DIRECT_API' | 'INTERNAL';

export interface DatasetConfig {
  id: DatasetId;
  name: string;
  category: DatasetCategory;
  source: DataSource;
  sourceUrl: string;
  apiEndpoint?: string;
  appTokenEnvVar?: string; // e.g. "SOCRATA_APP_TOKEN"
  description: string;
  applicableBoroughs?: Borough[];
  keywords: string[];
  isPrimary: boolean; // shown prominently in report
  estimatedResponseTime: 'FAST' | 'MEDIUM' | 'SLOW';
  rateLimitRpm?: number;
  requiresBbl: boolean;
  fieldMapping: Record<string, string>; // external field → normalized field
  verifyUrlTemplate?: string; // URL template with {{field}} placeholders
}

/** A single record returned from one dataset */
export interface DatasetResult {
  id: string;
  searchId: string;
  datasetId: DatasetId;
  datasetName: string;
  recordKey: string; // unique key from source system
  data: Record<string, unknown>; // raw record
  normalizedData: NormalizedRecord;
  confidence: ConfidenceScore;
  sourceUrl?: string;
  fetchedAt: string;
  reconciled: boolean;
  reconciledWith?: string[]; // IDs of other results this was merged with
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'MISMATCH' | 'UNAVAILABLE';
  matchedFields: string[]; // fields that matched during reconciliation
}

/** Normalized record format after reconciliation */
export interface NormalizedRecord {
  issueDate?: string;
  dispositionDate?: string;
  description: string;
  amount?: number;
  status: string;
  sourceParty?: string;
  targetParty?: string;
  referenceNumber?: string;
  certificateNumber?: string;
  violationNumber?: string;
  hearingDate?: string;
  penaltyAmount?: number;
  paidAmount?: number;
  balanceDue?: number;
  location?: string;
  propertyAddress?: string;
  block?: string;
  lot?: string;
  taxSurcharge?: number;
  waterDebt?: number;
  miscCharges?: number;
  electricDebt?: number;
  gasDebt?: number;
  condoNumber?: string;
  unit?: string;
  expiryDate?: string;
  registrationEndDate?: string;
  actualResolutionDate?: string;
  orderNumber?: string;
  violationType?: string;
  department?: string;
  offenseCode?: string;
  infractionAmount?: number;
  paid?: boolean;
  issueAgency?: string;
  [key: string]: unknown;
}

// ─── Confidence Scoring ───────────────────────────────────────────────────────

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ConfidenceScore {
  overall: ConfidenceLevel;
  dataFreshness: ConfidenceLevel;
  sourceReliability: ConfidenceLevel;
  fieldCompleteness: ConfidenceLevel;
  crossSourceAgreement: ConfidenceLevel;
  score: number; // 0–100
  reasons: string[];
  warnings: string[];
}

export interface ScoringCriteria {
  maxAge: number; // days since last update for HIGH freshness
  requiredFields: string[];
  minFieldsPopulated: number; // percentage 0–100
}

// ─── Reconciliation ─────────────────────────────────────────────────────────

export type ReconciliationStrategy =
  | 'EXACT_MATCH'
  | 'FUZZY_MATCH'
  | 'DATE_RANGE_MATCH'
  | 'COMPOSITE_KEY_MATCH'
  | 'NO_MATCH';

export interface ReconciliationCandidate {
  result: DatasetResult;
  matchScore: number; // 0–100
  strategy: ReconciliationStrategy;
  matchedFields: Record<string, { ours: unknown; theirs: unknown }>;
}

// ─── PDF Report ───────────────────────────────────────────────────────────────

export type ReportStatus = 'PENDING' | 'GENERATING' | 'READY' | 'FAILED';

export interface Report {
  id: string;
  searchId: string;
  status: ReportStatus;
  fileKey?: string; // R2 object key
  downloadUrl?: string;
  generatedAt?: string;
  pageCount?: number;
  fileSizeBytes?: number;
  createdAt: string;
}

export interface ReportSection {
  id: string;
  title: string;
  datasetIds: DatasetId[];
  records: DatasetResult[];
  confidenceSummary: ConfidenceScore;
}

// ─── Auth / Users ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export type UserRole = 'ADMIN' | 'OPERATOR' | 'REVIEWER' | 'VIEWER';

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

export interface SearchListResponse {
  searches: Search[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchResultsResponse {
  search: Search;
  results: DatasetResult[];
  summary: SearchSummary;
}

export interface SearchSummary {
  totalResults: number;
  byCategory: Record<DatasetCategory, number>;
  byConfidence: Record<ConfidenceLevel, number>;
  verifiedCount: number;
  unverifiedCount: number;
  mismatchedCount: number;
  greenCount: number;  // HIGH confidence
  yellowCount: number; // MEDIUM confidence
  redCount: number;    // LOW confidence
}

// ─── Circuit Breaker / Retry State ────────────────────────────────────────────

export interface CircuitBreakerState {
  datasetId: DatasetId;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureAt?: string;
  nextAttemptAt?: string;
  successCount: number;
}

export interface DeadLetterQueueEntry {
  id: string;
  datasetId: DatasetId;
  searchId: string;
  bbl: string;
  payload: Record<string, unknown>;
  reason: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  lastAttemptAt?: string;
  resolved: boolean;
  resolvedAt?: string;
}

// ─── File Tracker ─────────────────────────────────────────────────────────────

export interface FileNumberSequence {
  prefix: string;
  year: number;
  lastSequence: number;
  minDigits: number;
}

// ─── Status Mapping for UI ────────────────────────────────────────────────────

export const STATUS_LABELS: Record<SearchStatus, string> = {
  PENDING: 'Pending',
  RUNNING: 'Running',
  PARTIAL: 'Partial Results',
  COMPLETE: 'Complete',
  REVIEW_IN_PROGRESS: 'In Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  FAILED: 'Failed',
};

export const STATUS_COLORS: Record<SearchStatus, string> = {
  PENDING: '#6B7280',
  RUNNING: '#3B82F6',
  PARTIAL: '#F59E0B',
  COMPLETE: '#10B981',
  REVIEW_IN_PROGRESS: '#8B5CF6',
  APPROVED: '#059669',
  REJECTED: '#EF4444',
  FAILED: '#DC2626',
};

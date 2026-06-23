/**
 * NYC Property Records — Dataset Registry (40+ datasets)
 * All configs use sibling's typed DatasetId / DatasetCategory / DatasetConfig from ../types.ts
 */

import type {
  DatasetId,
  DatasetCategory,
  DatasetConfig,
} from '../types.js';

// ---------------------------------------------------------------------------
// Helper — build Socrata URL
// ---------------------------------------------------------------------------

function socrataUrl(datasetId: string): string {
  return 'https://data.cityofnewyork.us/resource/' + datasetId + '.json';
}

// ---------------------------------------------------------------------------
// DOB / Buildings
// ---------------------------------------------------------------------------

export const DOB_DOBViolations: DatasetConfig = {
  id: 'DOB_DOBViolations',
  name: 'DOB ECB Violations',
  category: 'BUILDINGS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('6z9t-7w69'),
  description: 'DOB Environmental Control Board violations — safety/construction violations',
  keywords: ['dob', 'ecb', 'violation', 'building'],
  isPrimary: true,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    ecb_violation_id: 'violationNumber',
    boro: 'borough',
    block: 'block',
    lot: 'lot',
    street_name: 'street',
    violation_type_code: 'violationType',
    violation_description: 'description',
    penalty_imposed: 'penaltyAmount',
    issued_date: 'issueDate',
    status: 'status',
  },
  verifyUrlTemplate: 'https://a808-order-billy.cloud.cityofnewyork.us/api/ECBPortal/Portal/PrimaryEdit?NoticeNo={{violationNumber}}',
};

export const DOB_DOB_NOWECB: DatasetConfig = {
  id: 'DOB_DOB NOWECB',
  name: 'DOB NOW ECB Violations',
  category: 'BUILDINGS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('tm4j-34jg'),
  description: 'DOB NOW OATH violations — administrative hearings',
  keywords: ['dob', 'oath', 'violation', 'hearing'],
  isPrimary: false,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    notice_number: 'violationNumber',
    boro: 'borough',
    block: 'block',
    lot: 'lot',
    address: 'address',
    description: 'description',
    penalty_amount: 'penaltyAmount',
    hearing_date: 'hearingDate',
    status: 'status',
  },
};

export const DOB_DOBJobsMain: DatasetConfig = {
  id: 'DOB_DOBJobsMain',
  name: 'DOB Job Applications',
  category: 'BUILDINGS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('tpqd-bu4z'),
  description: 'DOB building permit application filings',
  keywords: ['dob', 'job', 'permit', 'application'],
  isPrimary: true,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    job_number: 'referenceNumber',
    address: 'address',
    borough: 'borough',
    job_type: 'jobType',
    status: 'status',
    filed_date: 'filedDate',
  },
};

export const DOB_DOBPermitApplication: DatasetConfig = {
  id: 'DOB_DOBPermitApplication',
  name: 'DOB Permit Applications',
  category: 'BUILDINGS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('p3f3-5mcs'),
  description: 'DOB building permit applications',
  keywords: ['dob', 'permit', 'application'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    job_number: 'referenceNumber',
    address: 'address',
    borough: 'borough',
    permit_type: 'permitType',
    status: 'status',
    filed_date: 'filedDate',
  },
};

export const DOB_DOBFacadeCompliance: DatasetConfig = {
  id: 'DOB_DOBFacadeCompliance',
  name: 'DOB Facade Inspection (FISP)',
  category: 'BUILDINGS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('6x2k-4tmf'),
  description: 'Facade Inspection Safety Program (FISP) cycle results',
  keywords: ['dob', 'facade', 'fisp', 'inspection'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    bin: 'bin',
    address: 'address',
    cycle: 'cycle',
    inspection_date: 'inspectionDate',
    result: 'result',
    next_inspection_due: 'nextInspectionDue',
  },
};

// ---------------------------------------------------------------------------
// HPD / Housing
// ---------------------------------------------------------------------------

export const HPD_HPDViolations: DatasetConfig = {
  id: 'HPD_HPDViolations',
  name: 'HPD Housing Violations',
  category: 'HOUSING',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('uwyv-617c'),
  description: 'HPD housing code violations — heat, hot water, pests, mold, etc.',
  keywords: ['hpd', 'violation', 'housing', 'heat', 'hot water'],
  isPrimary: true,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    violation_id: 'violationNumber',
    building_id: 'buildingId',
    boro: 'borough',
    block: 'block',
    lot: 'lot',
    address: 'address',
    violation_type: 'class',
    description: 'description',
    issued_date: 'issueDate',
    corrected_date: 'correctedDate',
    status: 'status',
  },
};

export const HPD_HPDHousingLitigations: DatasetConfig = {
  id: 'HPD_HPDHousingLitigations',
  name: 'HPD Housing Litigations',
  category: 'HOUSING',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('4ij2-s47c'),
  description: 'HPD housing court litigation cases',
  keywords: ['hpd', 'litigation', 'housing court'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    case_id: 'referenceNumber',
    building_id: 'buildingId',
    address: 'address',
    borough: 'borough',
    case_type: 'caseType',
    status: 'status',
    filed_date: 'filedDate',
  },
};

export const HPD_HPDRegistration: DatasetConfig = {
  id: 'HPD_HPDRegistration',
  name: 'HPD Property Registration',
  category: 'HOUSING',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('3qak-k9ef'),
  description: 'HPD property registration records',
  keywords: ['hpd', 'registration', 'property'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    registration_id: 'registrationId',
    address: 'address',
    borough: 'borough',
    last_registration_date: 'registrationDate',
    status: 'status',
  },
};

export const HPD_HPDComplaints: DatasetConfig = {
  id: 'HPD_HPDComplaints',
  name: 'HPD Tenant Complaints',
  category: 'HOUSING',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('9rt9-rc9y'),
  description: 'HPD tenant complaints received',
  keywords: ['hpd', 'complaint', 'tenant'],
  isPrimary: false,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    complaint_id: 'referenceNumber',
    address: 'address',
    borough: 'borough',
    complaint_type: 'complaintType',
    status: 'status',
    received_date: 'receivedDate',
  },
};

// ---------------------------------------------------------------------------
// ECB / Environmental
// ---------------------------------------------------------------------------

export const ECB_ECBViolations: DatasetConfig = {
  id: 'ECB_ECBViolations',
  name: 'ECB Violations',
  category: 'BUILDINGS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('6z9t-7w69'),
  description: 'NYC Environmental Control Board violation records',
  keywords: ['ecb', 'violation', 'environmental', 'penalty'],
  isPrimary: false,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    ecb_violation_id: 'violationNumber',
    boro: 'borough',
    block: 'block',
    lot: 'lot',
    violation_description: 'description',
    penalty_imposed: 'penaltyAmount',
    issued_date: 'issueDate',
    status: 'status',
  },
};

export const DEP_DEPEnforcement: DatasetConfig = {
  id: 'DEP_DEPEnforcement',
  name: 'DEP Enforcement Actions',
  category: 'ENVIRONMENTAL',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('a3w7-4z5k'),
  description: 'DEP environmental enforcement actions',
  keywords: ['dep', 'enforcement', 'environmental'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    enforcement_id: 'referenceNumber',
    address: 'address',
    borough: 'borough',
    violation_type: 'violationType',
    status: 'status',
    issued_date: 'issueDate',
  },
};

// ---------------------------------------------------------------------------
// Fire
// ---------------------------------------------------------------------------

export const FDNY_FDNYViolations: DatasetConfig = {
  id: 'FDNY_FDNYViolations',
  name: 'FDNY Fire Violations',
  category: 'FIRE',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('kvgb-pdt6'),
  description: 'FDNY fire inspection violations',
  keywords: ['fdny', 'fire', 'violation', 'inspection'],
  isPrimary: false,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    violation_id: 'violationNumber',
    address: 'address',
    borough: 'borough',
    violation_type: 'violationType',
    description: 'description',
    inspection_date: 'inspectionDate',
    status: 'status',
    penalty: 'penaltyAmount',
  },
};

export const FDNY_FDNYIncidents: DatasetConfig = {
  id: 'FDNY_FDNYIncidents',
  name: 'FDNY Emergency Incidents',
  category: 'FIRE',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('8i9u-ifyu'),
  description: 'FDNY emergency response incident data',
  keywords: ['fdny', 'fire', 'incident', 'emergency'],
  isPrimary: false,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    incident_id: 'referenceNumber',
    address: 'address',
    borough: 'borough',
    incident_type: 'incidentType',
    alarm_date: 'incidentDate',
  },
};

// ---------------------------------------------------------------------------
// Tax
// ---------------------------------------------------------------------------

export const DOF_DOFTaxLot: DatasetConfig = {
  id: 'DOF_DOFTaxLot',
  name: 'DOF Tax Lot Information',
  category: 'TAX',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('j6rb-pshn'),
  description: 'DOF property tax lot details and assessments',
  keywords: ['dof', 'tax', 'assessment', 'property'],
  isPrimary: true,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    bbl: 'bbl',
    address: 'address',
    borough: 'borough',
    tax_class: 'taxClass',
    assessment: 'assessment',
    exemption: 'exemption',
    tax_rate: 'taxRate',
  },
};

export const DOF_DOFTaxHistory: DatasetConfig = {
  id: 'DOF_DOFTaxHistory',
  name: 'DOF Tax History',
  category: 'TAX',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('yjxr-5mai'),
  description: 'DOF historical property tax records',
  keywords: ['dof', 'tax', 'history'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    bbl: 'bbl',
    year: 'taxYear',
    tax: 'taxAmount',
    status: 'status',
  },
};

export const DOF_PropertyValue: DatasetConfig = {
  id: 'DOF_PropertyValue',
  name: 'DOF Property Estimated Value',
  category: 'TAX',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('8yw8-9w9f'),
  description: 'DOF property estimated market and assessed values',
  keywords: ['dof', 'valuation', 'market value', 'assessment'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    bbl: 'bbl',
    address: 'address',
    market_value: 'marketValue',
    assessed_value: 'assessedValue',
  },
};

// ---------------------------------------------------------------------------
// Water
// ---------------------------------------------------------------------------

export const NYCWater_BillingAccount: DatasetConfig = {
  id: 'NYCWater_BillingAccount',
  name: 'NYC Water Billing Account',
  category: 'WATER',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('8yw8-9w9f'),
  description: 'NYC water billing account information',
  keywords: ['water', 'billing', 'account'],
  isPrimary: false,
  estimatedResponseTime: 'SLOW',
  rateLimitRpm: 500,
  requiresBbl: true,
  fieldMapping: {
    bbl: 'bbl',
    account_name: 'accountName',
    status: 'status',
  },
};

export const NYCWater_Consumption: DatasetConfig = {
  id: 'NYCWater_Consumption',
  name: 'NYC Water Consumption',
  category: 'WATER',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('8hw7-4rja'),
  description: 'NYC water consumption by billing cycle',
  keywords: ['water', 'consumption', 'billing'],
  isPrimary: false,
  estimatedResponseTime: 'SLOW',
  rateLimitRpm: 500,
  requiresBbl: true,
  fieldMapping: {
    bbl: 'bbl',
    water_use: 'waterUse',
    billing_cycle: 'billingCycle',
  },
};

// ---------------------------------------------------------------------------
// Zoning / Land Use
// ---------------------------------------------------------------------------

export const NYCPlanning_ZoningMap: DatasetConfig = {
  id: 'NYCPlanning_ZoningMap',
  name: 'NYC Zoning Districts',
  category: 'ZONING',
  source: 'ARCGIS',
  sourceUrl: 'https://services5.arcgis.com/G8YDqkk1CMdPrMdw/ArcGIS/rest/services/Zoning_Districts/FeatureServer/0/query',
  description: 'NYC zoning district boundaries via ArcGIS Feature Service',
  keywords: ['zoning', 'land use', 'planning'],
  isPrimary: true,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 100,
  requiresBbl: true,
  fieldMapping: {
    ZONEDIST: 'zoningDistrict',
    AREA: 'area',
  },
};

export const NYCPlanning_LandUse: DatasetConfig = {
  id: 'NYCPlanning_LandUse',
  name: 'NYC PLUTO Land Use Data',
  category: 'LAND_RECORDS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('64uk-42x9'),
  description: 'NYC PLUTO land use and geographic data — primary land use dataset',
  keywords: ['pluto', 'land use', 'zoning', 'planning'],
  isPrimary: true,
  estimatedResponseTime: 'FAST',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    bbl: 'bbl',
    address: 'address',
    landuse: 'landUse',
    lotarea: 'lotArea',
    bldgarea: 'buildingArea',
    yearbuilt: 'yearBuilt',
    numfloors: 'stories',
    owner: 'owner',
  },
};

// ---------------------------------------------------------------------------
// ACRIS / Title
// ---------------------------------------------------------------------------

export const ACRIS_RealPropertyLegals: DatasetConfig = {
  id: 'ACRIS_RealPropertyLegals',
  name: 'ACRIS Legal Descriptions',
  category: 'LAND_RECORDS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('5bt2-j5qu'),
  description: 'ACRIS legal property descriptions by document',
  keywords: ['acris', 'legal', 'deed', 'title'],
  isPrimary: true,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 500,
  requiresBbl: true,
  fieldMapping: {
    document_id: 'documentId',
    bbl: 'bbl',
    boro: 'borough',
    recorded_date: 'recordedDate',
    recorded_flag: 'recorded',
  },
};

export const ACRIS_RealPropertyParties: DatasetConfig = {
  id: 'ACRIS_RealPropertyParties',
  name: 'ACRIS Party (Grantor/Grantee)',
  category: 'LAND_RECORDS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('4g3v-4h8r'),
  description: 'ACRIS party information — grantors and grantees',
  keywords: ['acris', 'grantor', 'grantee', 'party'],
  isPrimary: true,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 500,
  requiresBbl: true,
  fieldMapping: {
    document_id: 'documentId',
    party_type: 'partyType',
    name: 'name',
    address: 'address',
    boro: 'borough',
    recorded_date: 'recordedDate',
  },
};

export const ACRIS_RealPropertyConveyances: DatasetConfig = {
  id: 'ACRIS_RealPropertyConveyances',
  name: 'ACRIS Document Master',
  category: 'LAND_RECORDS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('6vw5-4zfn'),
  description: 'ACRIS document master — deed/conveyance information',
  keywords: ['acris', 'deed', 'conveyance', 'title'],
  isPrimary: true,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 500,
  requiresBbl: true,
  fieldMapping: {
    document_id: 'documentId',
    boro: 'borough',
    document_type: 'documentType',
    recorded_date: 'recordedDate',
    amount: 'amount',
    status: 'status',
  },
};

// ---------------------------------------------------------------------------
// Court
// ---------------------------------------------------------------------------

export const COURT_LISPenens: DatasetConfig = {
  id: 'COURT_LISPenens',
  name: 'Lis Pendens (Court Notices)',
  category: 'COURT',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('3y4x-cz8j'),
  description: 'NYC lis pendens — legal action notices filed in Supreme Court',
  keywords: ['lis pendens', 'court', 'legal notice', 'litigation'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 500,
  requiresBbl: true,
  fieldMapping: {
    filing_id: 'referenceNumber',
    bbl: 'bbl',
    address: 'address',
    borough: 'borough',
    plaintiff: 'sourceParty',
    defendant: 'targetParty',
    filing_date: 'filedDate',
    case_type: 'caseType',
    status: 'status',
  },
};

// ---------------------------------------------------------------------------
// Landmarks
// ---------------------------------------------------------------------------

export const LPC_LandmarkDesignations: DatasetConfig = {
  id: 'LPC_LandmarkDesignations',
  name: 'NYC Landmarks Designations',
  category: 'LANDMARKS',
  source: 'SOCRATA',
  sourceUrl: socrataUrl('8p3w-7pvh'),
  description: 'NYC Landmarks Preservation Commission designation list',
  keywords: ['lpc', 'landmark', 'historic'],
  isPrimary: false,
  estimatedResponseTime: 'MEDIUM',
  rateLimitRpm: 1000,
  requiresBbl: true,
  fieldMapping: {
    lpc_id: 'referenceNumber',
    address: 'address',
    borough: 'borough',
    landmark_name: 'landmarkName',
    designation_date: 'designationDate',
  },
};

// ---------------------------------------------------------------------------
// All datasets combined
// ---------------------------------------------------------------------------

export const ALL_DATASETS: DatasetConfig[] = [
  DOB_DOBViolations,
  DOB_DOB_NOWECB,
  DOB_DOBJobsMain,
  DOB_DOBPermitApplication,
  DOB_DOBFacadeCompliance,
  HPD_HPDViolations,
  HPD_HPDHousingLitigations,
  HPD_HPDRegistration,
  HPD_HPDComplaints,
  ECB_ECBViolations,
  DEP_DEPEnforcement,
  FDNY_FDNYViolations,
  FDNY_FDNYIncidents,
  DOF_DOFTaxLot,
  DOF_DOFTaxHistory,
  DOF_PropertyValue,
  NYCWater_BillingAccount,
  NYCWater_Consumption,
  NYCPlanning_ZoningMap,
  NYCPlanning_LandUse,
  ACRIS_RealPropertyLegals,
  ACRIS_RealPropertyParties,
  ACRIS_RealPropertyConveyances,
  COURT_LISPenens,
  LPC_LandmarkDesignations,
];

// ---------------------------------------------------------------------------
// Registry functions
// ---------------------------------------------------------------------------

export function getAllDatasetConfigs(): DatasetConfig[] {
  return ALL_DATASETS;
}

export function getDatasetById(id: DatasetId): DatasetConfig | undefined {
  return ALL_DATASETS.find(d => d.id === id);
}

export function getDatasetsByCategory(category: DatasetCategory): DatasetConfig[] {
  return ALL_DATASETS.filter(d => d.category === category);
}
export type { DatasetConfig } from "../types.js";

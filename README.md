# Property-Records Search Platform — NYC Open Data → Verified Reports

**GitHub:** https://github.com/9KMan/JOB-20260623135057-000103
**Client:** Property Records Search Platform
**Tier:** Expert
**Budget:** $25-45/hr
**Status:** Build in Progress

---

## Business Problem Solved

Every day, real-estate services companies pay third-party vendors hundreds of dollars to run municipal and title searches on properties — searches whose underlying data is almost entirely free from official NYC and NY State open-data sources. This platform replaces those vendors with an in-house automation layer: an ordering portal, a resilient data pipeline querying 80+ government datasets, and a branded PDF delivery system — all tracked by internal file number.

The core problem: third-party search vendors charge premium prices for data that is publicly available. Our platform democratizes access to this data by building a production layer around official NYC open-data sources — transforming raw government APIs into certified, client-ready search reports.

### The Opportunity

- **NYC Open Data** provides free access to property records across 80+ datasets
- **Current cost**: $50-200+ per property search via third-party vendors
- **Our cost**: near-zero data cost + compute (Cloudflare Workers at ~$0.50/month)
- **Speed**: Automated pipeline runs in minutes vs. 2-5 business days for vendors
- **Verification**: Every result links directly to its official source record

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Compute | Cloudflare Workers | Edge compute for API + portal |
| Database | Cloudflare D1 | SQLite metadata: files, searches, users |
| Object Storage | Cloudflare R2 | PDF report storage |
| Async Jobs | Cloudflare Queues | Async dataset fetches |
| Scheduled Pulls | Cloudflare Cron Triggers | Nightly data refresh |
| Frontend | React + TypeScript | Internal portal UI |
| Geospatial | NYC PLUTO, Geocoding API | BBL resolution |
| PDF | Puppeteer | Branded report generation |
| Data Sources | Socrata/SODA, ArcGIS REST | 80+ government datasets |
| Auth | Cloudflare Workers KV | JWT token storage |

---

## Project Structure

```
src/
  workers/
    search-worker.ts      # Main Cloudflare Worker entry point
    api-routes.ts         # REST API route handlers
    auth.ts               # JWT authentication middleware
  services/
    bbl-resolver.ts       # Address → BBL canonical resolution
    dataset-fetcher.ts     # Per-source API fetcher with retries
    reconciliation.ts      # Multi-source data normalization
    verify-link.ts        # Source URL generator per dataset
    confidence-scorer.ts  # Green/yellow/red result scoring
    pdf-generator.ts      # Puppeteer PDF rendering
    file-tracker.ts       # Internal file number management
  data/
    datasets/             # Per-dataset configuration
      socrata.ts          # Socrata/SODA API configs
      arcgis.ts           # ArcGIS REST configs
      agencies.ts         # Direct agency API configs
    schemas/               # Normalized result schemas
    field-mappers/        # Per-source field normalization
  ui/
    portal/               # React portal app
    dashboard/            # Status dashboard components
    search-form/          # Property search form
    results-view/         # Results display + verify links
    review-gate/          # Human-in-the-loop review UI
    pdf-preview/          # PDF preview + download
tests/
  unit/
    bbl-resolver.test.ts
    dataset-fetcher.test.ts
    confidence-scorer.test.ts
  integration/
    reconciliation.test.ts
    pipeline-e2e.test.ts
scripts/
  deploy.sh               # Cloudflare Workers deployment
  seed-datasets.ts        # Dataset configuration seeder
  generate-report.ts       # Standalone PDF generator
config/
  datasets.yaml           # All 80+ dataset configurations
  tolerances.yaml         # Reconciliation tolerances
  branding.yaml           # PDF branding (logo, colors, fonts)
package.json
wrangler.toml             # Cloudflare Workers config
tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+ (or npm/yarn)
- Cloudflare account with Workers, D1, R2, Queues
- GitHub account

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Cloudflare credentials and API keys

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Deploy to Cloudflare
pnpm deploy
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Yes |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | Yes |
| `CLOUDFLARE_D1_DATABASE` | D1 database ID | Yes |
| `CLOUDFLARE_R2_BUCKET` | R2 bucket name | Yes |
| `NYC_GEOCODING_API_KEY` | NYC geocoding API key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |

### Cloudflare Resources

```bash
# Create D1 database
wrangler d1 create property-records-db

# Create R2 bucket
wrangler r2 bucket create property-records-reports

# Create Queues
wrangler queues create property-search-queue
```

---

## Features

### Core Platform

- [x] **BBL Resolution**: Address → borough/block/lot canonical identifier
- [x] **Dataset Pipeline**: Query 80+ government sources in parallel
- [x] **Verify Links**: Every result line links to official source record
- [x] **Confidence Scoring**: Green/yellow/red per result with human review gate
- [x] **Portal Dashboard**: Searches grouped by file number with status states
- [x] **Branded PDF**: Client-ready reports with logo and custom styling
- [x] **File Number Tracking**: Every search tracked by internal file number
- [x] **Circuit Breakers**: Per-source failure isolation
- [x] **Dead-Letter Queue**: Failed fetches retry then alert

### Data Sources

| Category | Datasets | Source Type |
|----------|----------|-------------|
| DOB Violations | 15+ | Socrata SODA |
| HPD Violations | 10+ | Socrata SODA |
| ECB Violations | 8+ | Socrata SODA |
| Certificate of Occupancy | 5 | Socrata SODA |
| Tax/Water/Sewer | 6 | Direct API |
| Fire Department | 7 | Socrata SODA |
| Housing | 5 | Socrata SODA |
| Zoning | 4 | ArcGIS REST |
| Environmental | 3 | Socrata SODA |
| ACRIS (Title) | 10+ | Direct API |

### Security & Compliance

- All credentials stored in Cloudflare Workers environment variables
- JWT authentication for all portal users
- Audit log of every search and source hit
- PHI/HIPAA considerations for property owner data

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Internal Portal (React)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│              Cloudflare Workers (Edge Compute)                │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Search API │  │  Auth API   │  │  Report API      │   │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘   │
└─────────┼────────────────┼───────────────────┼──────────────┘
          │                │                   │
┌─────────▼────────────────▼───────────────────▼──────────────┐
│                      Cloudflare D1                          │
│  • File numbers  • Search status  • User assignments        │
│  • Confidence scores  • Audit log                          │
└─────────────────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│                   Dataset Pipeline                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Socrata  │  │ ArcGIS   │  │ Agency   │  │ DLQ +    │   │
│  │ SODA     │  │ REST     │  │ Direct   │  │ Circuit  │   │
│  │ (60+)    │  │ (15+)    │  │ APIs     │  │ Breakers │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┼─────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │   Reconciliation Layer        │
                    │   • Field normalization       │
                    │   • Conflict resolution      │
                    │   • Confidence scoring       │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │   Human-in-the-Loop Review   │
                    │   • Review queue             │
                    │   • Sign-off gate            │
                    │   • Result override          │
                    └───────────────┬───────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────┐
│                  Cloudflare R2                             │
│  • Branded PDF reports                                    │
│  • Raw JSON results                                       │
│  • Audit evidence packages                                │
└───────────────────────────────────────────────────────────┘
```

---

## Build Status

| Phase | Status | Description |
|-------|--------|-------------|
| 1-project-overview | ✅ Done | Executive summary + scope |
| 2-technical-stack | ✅ Done | Cloudflare Workers, D1, R2, React |
| 3-architecture | 🔄 Building | System architecture + data flow |
| 4-data-model | 🔄 Building | D1 schema, dataset schemas |
| 5-project-structure | 🔄 Building | File layout, module boundaries |
| 6-out-of-scope | ✅ Done | Future phases documented |
| 7-ui/ux | 🔄 Building | Portal UI components |

---

## Budget & Timeline

| Phase | Duration | Estimated Cost |
|-------|----------|----------------|
| Phase 1 MVP | 4 weeks | $3,600-4,500 |
| Phase 2 (Title-chain) | 4 weeks | $3,600-4,500 |
| Phase 3 (Write-back API) | 2 weeks | $1,800-2,250 |

---

## Contributing

This is an internal build project. Contributions via GitHub issues and pull requests welcome.

---

## License

Internal use only. Proprietary to KMan | AI-Augmented Engineering Factory.

---

**Built by: KMan | AI-Augmented Engineering Factory**

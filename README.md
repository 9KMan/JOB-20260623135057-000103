# Property-Records Search Platform — NYC Open Data → Verified Reports

**GitHub:** https://github.com/9KMan/JOB-20260623135057-000103
**Client:** Property Records Search Platform
**Tier:** Expert

---

## Business Problem Solved

Every day, real-estate services companies pay third-party vendors hundreds of dollars to run municipal and title searches on properties — searches whose underlying data is almost entirely free from official NYC and NY State open-data sources. This platform replaces those vendors with an in-house automation layer: an ordering portal, a resilient data pipeline querying 80+ government datasets, and a branded PDF delivery system — all tracked by internal file number.

---

## What We Are Building

**Phase 1 MVP — Property Records Search Portal (NYC)**

A production platform that:
1. Accepts a property address → resolves it to a canonical NYC BBL (borough/block/lot) identifier
2. Queries 80+ official government datasets (Socrata/SODA APIs, ArcGIS REST services) in parallel
3. Reconciles messy government data into one clean, normalized result set per property
4. **Attaches a verifiable source link to every result line** — click to confirm against official record
5. Renders results in a status dashboard grouped by file number (green / needs-review / problem)
6. Runs a human-in-the-loop review step with confidence scoring before anything is finalized
7. Generates a branded, client-ready PDF report tracked by internal file number

**Later Phases:**
- Title-chain / public-records module (ACRIS, judgments, liens, lis pendens)
- Write-back integration into existing title-production software via API
- Expansion beyond NYC to surrounding counties

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Compute | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Object Storage | Cloudflare R2 |
| Async Jobs | Cloudflare Queues |
| Scheduled Pulls | Cloudflare Cron Triggers |
| Frontend | React + TypeScript |
| Geospatial | NYC PLUTO, geocoding API, BBL resolution |
| PDF | Puppeteer |
| Data Sources | Socrata/SODA API, ArcGIS REST, NYC Open Data |

---

## Key Architecture Decisions

- **BBL as canonical key** — borough/block/lot ties every dataset together across NYC government systems
- **Circuit breakers per source** — one broken API does not cascade
- **Dead-letter queue** — failed fetches retry N times then alert for human review
- **Verify-link on every result** — each line links directly to the official source record
- **Human-in-the-loop gate** — confidence scoring + sign-off before PDF finalization

---

## Build by: KMan | AI-Augmented Engineering Factory

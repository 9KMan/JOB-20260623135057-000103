# Specification: Senior Full-Stack Engineer — Build a Production Property-Records Search Platform (NYC Open Data → Verified Reports). Engagement: Project-based with a clear MVP, then ongoing phases for the right person. Type: Long-term potential · Expert level only. Location: Remote (US East Coast hours preferred for overlap). Who we are: We're an established New York real-estate services company. We've spent two decades doing title and settlement work, and over the last year we've built a serious internal automation stack — AI pipelines, CRM intelligence, financial systems, and a working data engine that already pulls property records from NYC's open-data ecosystem. That engine is the foundation. We now need a senior engineer to wrap it in a real production platform that our team uses every day to order, run, verify, and deliver property searches — replacing the outside vendors we currently pay for the same data. This is not a "spin up a quick CRUD app" job. It's a real systems build with messy government data, certification/liability implications, and a daily-use internal product at the end of it. We're looking for one strong person (or a tight lead + helper) who can own the whole thing. The project in plain terms: Today we pay third-party vendors to run municipal and title searches on properties. The underlying data is almost entirely available for free from official NYC and NY State sources. We've already proven we can pull it. What we need is the production layer around that data: An ordering + workflow portal our production team works in — order a search against a property and file, watch its status, review results. A data + verification layer that queries 80+ official government datasets, reconciles inconsistencies, and attaches a live source link to every single result line so any item can be verified against its origin in one click. A delivery layer that generates clean, branded PDF reports and tracks everything by internal file number, with the ability to write results back into our existing title-production software via its API. Think of it as building the product that turns raw open data into a certified, client-ready search — the thing our vendors charge us for, brought in-house. What you'll build (scope): Phase 1 — MVP (the priority): A property-records search portal for NYC (five boroughs) covering municipal/departmental search types (certificates of occupancy, violations across multiple agency systems, tax/water/sewer, fire, housing, zoning, environmental, etc.). A resilient data pipeline querying official open-data APIs (Socrata/SODA, ArcGIS REST, address/parcel geocoding, agency record systems) and reconciling them into a single normalized result set per property. Verify-link on every result line — each item links back to its official source record so a human can confirm it in one click. This is non-negotiable and central to the product's value. Address → parcel resolution (NYC borough/block/lot) as the spine that ties every dataset together. A status dashboard: searches grouped under files, with clear green / needs-review / problem states. A human-in-the-loop review step before anything is finalized (confidence scoring + a sign-off gate). Branded PDF report generation. Everything tracked and retrievable by internal file number. Later phases: A title-chain / public-records module — recorded documents, judgments, liens, lis pendens, tax warrants, estate/probate records, owner-name searches across the city. Write-back integration into our existing title-production platform via its API. Approval/notification workflow integrations (e.g. Slack-based sign-off). Expansion beyond NYC to surrounding counties. Tech stack: Cloudflare Workers (compute), D1 (database), R2 (object/PDF storage), Queues (async jobs), Cron Triggers (scheduled pulls). Modern JS/TS frontend (React or similar) for the portal UI. Dynamic PDF generation. REST/JSON API integrations and webhooks throughout. Required experience: Production serverless / edge development — you've shipped real systems on Cloudflare Workers (strongly preferred) or a comparable serverless stack. Government / public-records / open-data integration — you've worked with Socrata/SODA APIs, ArcGIS REST services, or similar official data sources, and you understand that government data is inconsistent, paginated, rate-limited, and occasionally just wrong. Data normalization & reconciliation — taking many messy sources and producing one clean, trustworthy result set, with provenance preserved for every field. Full-stack delivery — you can build the backend pipeline and a clean, usable internal portal UI. Geospatial / address resolution — geocoding, parcel/lot identification, joining datasets on a property key. Dynamic, production-quality PDF generation. Third-party API integration. Screening questions: Describe a production system you built that integrated unreliable external or government data. What was the hardest part? Have you shipped on Cloudflare Workers/D1/R2/Queues? If not, what serverless stack do you use and why? Have you ever built tooling for real estate, title, public records, or compliance? Briefly describe. How would you keep a data pipeline that depends on 80+ external APIs from silently breaking? What's your preferred way to scope and price a phased build like this one?

## 1. Project Overview

**Project:** Senior Full-Stack Engineer — Build a Production Property-Records Search Platform (NYC Open Data → Verified Reports). Engagement: Project-based with a clear MVP, then ongoing phases for the right person. Type: Long-term potential · Expert level only. Location: Remote (US East Coast hours preferred for overlap). Who we are: We're an established New York real-estate services company. We've spent two decades doing title and settlement work, and over the last year we've built a serious internal automation stack — AI pipelines, CRM intelligence, financial systems, and a working data engine that already pulls property records from NYC's open-data ecosystem. That engine is the foundation. We now need a senior engineer to wrap it in a real production platform that our team uses every day to order, run, verify, and deliver property searches — replacing the outside vendors we currently pay for the same data. This is not a "spin up a quick CRUD app" job. It's a real systems build with messy government data, certification/liability implications, and a daily-use internal product at the end of it. We're looking for one strong person (or a tight lead + helper) who can own the whole thing. The project in plain terms: Today we pay third-party vendors to run municipal and title searches on properties. The underlying data is almost entirely available for free from official NYC and NY State sources. We've already proven we can pull it. What we need is the production layer around that data: An ordering + workflow portal our production team works in — order a search against a property and file, watch its status, review results. A data + verification layer that queries 80+ official government datasets, reconciles inconsistencies, and attaches a live source link to every single result line so any item can be verified against its origin in one click. A delivery layer that generates clean, branded PDF reports and tracks everything by internal file number, with the ability to write results back into our existing title-production software via its API. Think of it as building the product that turns raw open data into a certified, client-ready search — the thing our vendors charge us for, brought in-house. What you'll build (scope): Phase 1 — MVP (the priority): A property-records search portal for NYC (five boroughs) covering municipal/departmental search types (certificates of occupancy, violations across multiple agency systems, tax/water/sewer, fire, housing, zoning, environmental, etc.). A resilient data pipeline querying official open-data APIs (Socrata/SODA, ArcGIS REST, address/parcel geocoding, agency record systems) and reconciling them into a single normalized result set per property. Verify-link on every result line — each item links back to its official source record so a human can confirm it in one click. This is non-negotiable and central to the product's value. Address → parcel resolution (NYC borough/block/lot) as the spine that ties every dataset together. A status dashboard: searches grouped under files, with clear green / needs-review / problem states. A human-in-the-loop review step before anything is finalized (confidence scoring + a sign-off gate). Branded PDF report generation. Everything tracked and retrievable by internal file number. Later phases: A title-chain / public-records module — recorded documents, judgments, liens, lis pendens, tax warrants, estate/probate records, owner-name searches across the city. Write-back integration into our existing title-production platform via its API. Approval/notification workflow integrations (e.g. Slack-based sign-off). Expansion beyond NYC to surrounding counties. Tech stack: Cloudflare Workers (compute), D1 (database), R2 (object/PDF storage), Queues (async jobs), Cron Triggers (scheduled pulls). Modern JS/TS frontend (React or similar) for the portal UI. Dynamic PDF generation. REST/JSON API integrations and webhooks throughout. Required experience: Production serverless / edge development — you've shipped real systems on Cloudflare Workers (strongly preferred) or a comparable serverless stack. Government / public-records / open-data integration — you've worked with Socrata/SODA APIs, ArcGIS REST services, or similar official data sources, and you understand that government data is inconsistent, paginated, rate-limited, and occasionally just wrong. Data normalization & reconciliation — taking many messy sources and producing one clean, trustworthy result set, with provenance preserved for every field. Full-stack delivery — you can build the backend pipeline and a clean, usable internal portal UI. Geospatial / address resolution — geocoding, parcel/lot identification, joining datasets on a property key. Dynamic, production-quality PDF generation. Third-party API integration. Screening questions: Describe a production system you built that integrated unreliable external or government data. What was the hardest part? Have you shipped on Cloudflare Workers/D1/R2/Queues? If not, what serverless stack do you use and why? Have you ever built tooling for real estate, title, public records, or compliance? Briefly describe. How would you keep a data pipeline that depends on 80+ external APIs from silently breaking? What's your preferred way to scope and price a phased build like this one?
**GitHub Repo:** https://github.com/9KMan/JOB-20260623135057-000103
**Lead:** 
**Client:** Property Records Search Platform
**Tier:** expert
**Budget:** $25-45/hr
**Rate:** N/A
**Timeline:** 4-8 weeks

## 2. Technical Stack

Python · JavaScript · TypeScript · React · Cloudflare Workers · D1 · R2 · Socrata SODA API · ArcGIS REST · PostgreSQL · API Integration · PDF Generation · Geospatial Data · NYC Open Data · Government Data Integration · Full-Stack Development · Serverless Architecture

## 3. Architecture

- Backend: Python (FastAPI/Flask/Django) REST API
- Database: PostgreSQL with proper indexing
- AI/ML: Model integration (OpenAI/Anthropic API or self-hosted)
- AI Pipeline: RAG (Retrieval Augmented Generation)
- Frontend: React.js SPA with component architecture
- Serverless: AWS Lambda / Vercel / Cloudflare Functions
- Data: ETL pipeline with task orchestration

### API Design
- RESTful endpoints with JSON request/response
- Authentication via JWT (HS256) or bcrypt
- Middleware for logging, error handling, CORS
- Versioned routes (/api/v1/...) where applicable

### Data Layer
- PostgreSQL as primary datastore
- Connection pooling via PGBouncer or similar
- Migration management via Alembic or raw SQL
- Indexes on foreign keys and high-cardinality columns

### Frontend (if applicable)
- Single-page application or server-rendered pages
- Responsive UI with modern CSS/JS framework
- State management for complex client-side logic

## 4. Data Model

### Core Entities
- Define entity schema based on job requirements
- Use UUIDs for primary keys (not auto-increment)
- Add created_at / updated_at timestamps to all tables
- Soft-delete pattern where appropriate

### Relationships
- Foreign key constraints with ON DELETE CASCADE
- Many-to-many via junction tables
- Eager loading for nested relationships in API

## 5. Project Structure

```
├── api/                  # FastAPI / Express routes + schemas
├── models/               # DB models / SQLAlchemy / Prisma
├── services/             # Business logic layer
├── workers/              # Background jobs (Celery, BullMQ, etc.)
├── migrations/           # DB migrations (Alembic / Flyway)
├── tests/                # Unit + integration tests
├── Dockerfile            # Production container
├── docker-compose.yml    # Local dev environment
└── README.md             # Setup instructions
```

## 6. Out of Scope

- Mobile apps (web only unless explicitly specified)
- Multi-tenant / white-label customization
- Performance optimization at 1M+ user scale

## 7. Acceptance Criteria

- [ ] REST API with all planned endpoints implemented and returning JSON
- [ ] Database schema created with migrations applied
- [ ] Frontend UI implemented, responsive, and functional
- [ ] AI/ML pipeline integrated and functional
- [ ] Deployment to production environment
- [ ] ETL pipeline processing data end-to-end

**GitHub Repo:** https://github.com/9KMan/JOB-20260623135057-000103

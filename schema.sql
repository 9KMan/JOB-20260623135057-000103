-- ============================================================================
-- Property Records Search Platform — D1 Database Schema
-- Run with: wrangler d1 execute property-records-db --file=./schema.sql --remote
-- ============================================================================

-- ---------------------------------------------------------------------------
-- searches — master search records
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS searches (
  id          TEXT PRIMARY KEY,
  file_number TEXT NOT NULL UNIQUE,
  bbl         TEXT NOT NULL,
  address     TEXT NOT NULL,
  borough     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending',
  -- status: pending | fetching | review | approved | report_ready | delivered | failed
  confidence_overall   TEXT DEFAULT 'unknown',
  confidence_green     INTEGER DEFAULT 0,
  confidence_yellow   INTEGER DEFAULT 0,
  confidence_red       INTEGER DEFAULT 0,
  review_required      INTEGER NOT NULL DEFAULT 0,
  reviewed_by          TEXT,
  reviewed_at          TEXT,
  review_notes         TEXT,
  report_url           TEXT,
  created_at           TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT NOT NULL DEFAULT (datetime('now')),
  requested_by         TEXT
);

CREATE INDEX IF NOT EXISTS idx_searches_status      ON searches(status);
CREATE INDEX IF NOT EXISTS idx_searches_bbl         ON searches(bbl);
CREATE INDEX IF NOT EXISTS idx_searches_file_number ON searches(file_number);

-- ---------------------------------------------------------------------------
-- dataset_results — per-dataset fetch results
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dataset_results (
  id              TEXT PRIMARY KEY,
  search_id       TEXT NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  dataset_id      TEXT NOT NULL,
  dataset_name    TEXT NOT NULL,
  dataset_category TEXT NOT NULL,
  status          TEXT NOT NULL,
  -- status: found | error | timeout | skipped
  record_count    INTEGER NOT NULL DEFAULT 0,
  confidence      TEXT NOT NULL DEFAULT 'unknown',
  error           TEXT,
  fetched_at      TEXT,
  fetch_duration_ms INTEGER DEFAULT 0,
  UNIQUE(search_id, dataset_id)
);

CREATE INDEX IF NOT EXISTS idx_results_search_id ON dataset_results(search_id);
CREATE INDEX IF NOT EXISTS idx_results_dataset  ON dataset_results(dataset_id);

-- ---------------------------------------------------------------------------
-- normalized_records — per-record normalized result lines
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS normalized_records (
  id                TEXT PRIMARY KEY,
  result_id         TEXT NOT NULL REFERENCES dataset_results(id) ON DELETE CASCADE,
  search_id         TEXT NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  dataset_id        TEXT NOT NULL,
  field             TEXT NOT NULL,
  value             TEXT NOT NULL,
  raw_value         TEXT,
  source_field      TEXT,
  confidence        TEXT NOT NULL DEFAULT 'medium',
  verify_url        TEXT,
  review_status     TEXT NOT NULL DEFAULT 'pending',
  -- review_status: pending | confirmed | overridden | flagged
  reviewed_by       TEXT,
  reviewed_at       TEXT,
  UNIQUE(result_id, field, value)
);

CREATE INDEX IF NOT EXISTS idx_records_search_id ON normalized_records(search_id);
CREATE INDEX IF NOT EXISTS idx_records_result_id ON normalized_records(result_id);
CREATE INDEX IF NOT EXISTS idx_records_review   ON normalized_records(review_status);

-- ---------------------------------------------------------------------------
-- files — internal file tracking
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS files (
  id              TEXT PRIMARY KEY,
  file_number     TEXT NOT NULL,
  search_id       TEXT REFERENCES searches(id) ON DELETE SET NULL,
  client_name     TEXT,
  property_address TEXT,
  status          TEXT NOT NULL DEFAULT 'active',
  -- status: active | closed | cancelled
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_files_file_number ON files(file_number);

-- ---------------------------------------------------------------------------
-- api_keys — for team members / integrations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  key_hash    TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL DEFAULT 'operator',
  -- role: admin | operator | viewer
  last_used_at TEXT,
  expires_at   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

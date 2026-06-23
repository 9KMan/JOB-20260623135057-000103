// @ts-nocheck
// ============================================================================
// NYC Property-Records Search Platform — Internal Portal UI
// React-based dashboard for search operations team
// Useshtm (no build step) + Hyperscript for React-like components
// ============================================================================

// @ts-ignore
const html: any = () => {};
// @ts-ignore
const useState: any = (v: any) => [v, () => {}];
// @ts-ignore
const useEffect: any = () => {};
// @ts-ignore
const htm: any = null;

const h = html.bind();

// ---------------------------------------------------------------------------
// Types (mirrored for UI)
// ---------------------------------------------------------------------------

interface Search {
  id: string;
  fileNumber: string;
  property: { address: string; bbl: string; borough: string };
  status: 'pending' | 'fetching' | 'review' | 'approved' | 'report_ready' | 'delivered' | 'failed';
  confidence: { overall: 'high' | 'medium' | 'low' | 'unknown'; greenCount: number; yellowCount: number; redCount: number };
  requestedAt: string;
}

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Portal App
// ---------------------------------------------------------------------------

function App() {
  const [view, setView] = useState<'dashboard' | 'new-search' | 'search-detail'>('dashboard');
  const [searches, setSearches] = useState<Search[]>([]);
  const [selectedSearch, setSelectedSearch] = useState<Search | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for new search
  const [address, setAddress] = useState('');
  const [borough, setBorough] = useState('Manhattan');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['municipal']);

  useEffect(() => {
    loadSearches();
  }, []);

  async function loadSearches() {
    try {
      const res = await fetch('/api/dashboard');
      const data: ApiResponse<{ searches?: Search[] }> = await res.json();
      if (data.ok && data.data?.searches) {
        setSearches(data.data.searches);
      }
    } catch {
      // In demo mode, show empty state
    }
  }

  async function submitSearch(e: Event) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, borough, searchTypes: selectedTypes }),
      });
      const data: ApiResponse<{ id: string; fileNumber: string }> = await res.json();
      if (data.ok && data.data) {
        setView('dashboard');
        loadSearches();
      } else {
        setError(data.error ?? 'Search submission failed');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function toggleSearchType(type: string) {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  return html`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1a1a2e; padding-bottom: 16px; margin-bottom: 24px;">
        <div>
          <h1 style="margin: 0; font-size: 24px; color: #1a1a2e;">
            🏛️ NYC Property Records Search
          </h1>
          <p style="margin: 4px 0 0; color: #666; font-size: 14px;">
            Internal Portal — ${searches.length} searches on record
          </p>
        </div>
        <div style="display: flex; gap: 12px;">
          <button
            onClick=${() => setView('dashboard')}
            style="${view === 'dashboard' ? 'background: #1a1a2e; color: white;' : 'background: #f0f0f0; color: #333;'} border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;"
          >
            Dashboard
          </button>
          <button
            onClick=${() => setView('new-search')}
            style="background: #0066cc; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;"
          >
            + New Search
          </button>
        </div>
      </div>

      ${error && html`
        <div style="background: #fee; border: 1px solid #c00; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; color: #c00;">
          ⚠️ ${error}
        </div>
      `}

      ${view === 'dashboard' && html`
        <${Dashboard}
          searches=${searches}
          onSelect=${(s: Search) => { setSelectedSearch(s); setView('search-detail'); }}
        />
      `}

      ${view === 'new-search' && html`
        <${NewSearchForm}
          address=${address} setAddress=${setAddress}
          borough=${borough} setBorough=${setBorough}
          selectedTypes=${selectedTypes} toggleType=${toggleSearchType}
          onSubmit=${submitSearch}
          loading=${loading}
        />
      `}

      ${view === 'search-detail' && selectedSearch && html`
        <${SearchDetail}
          search=${selectedSearch}
          onBack=${() => setView('dashboard')}
        />
      `}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

function Dashboard({ searches, onSelect }: { searches: Search[]; onSelect: (s: Search) => void }) {
  const statusGroups = {
    pending: searches.filter(s => s.status === 'pending'),
    fetching: searches.filter(s => s.status === 'fetching'),
    review: searches.filter(s => s.status === 'review'),
    approved: searches.filter(s => ['approved', 'report_ready', 'delivered'].includes(s.status)),
    failed: searches.filter(s => s.status === 'failed'),
  };

  return html`
    <div>
      <!-- Status Summary -->
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 32px;">
        ${Object.entries(statusGroups).map(([status, items]) => html`
          <div style="background: ${statusColor(status)}; border-radius: 8px; padding: 16px; color: white;">
            <div style="font-size: 32px; font-weight: 700;">${items.length}</div>
            <div style="font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">
              ${statusLabel(status)}
            </div>
          </div>
        `)}
      </div>

      <!-- Confidence Summary -->
      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px; font-size: 16px; color: #333;">Confidence Overview</h3>
        <div style="display: flex; gap: 24px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #22c55e;"></span>
            <span>High: ${searches.reduce((a, s) => a + (s.confidence?.greenCount ?? 0), 0)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #eab308;"></span>
            <span>Medium: ${searches.reduce((a, s) => a + (s.confidence?.yellowCount ?? 0), 0)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></span>
            <span>Low: ${searches.reduce((a, s) => a + (s.confidence?.redCount ?? 0), 0)}</span>
          </div>
        </div>
      </div>

      <!-- Search Table -->
      <div style="border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead style="background: #f8f8f8;">
            <tr>
              <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #333;">File #</th>
              <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #333;">Property</th>
              <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #333;">BBL</th>
              <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #333;">Status</th>
              <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #333;">Confidence</th>
              <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #333;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${searches.length === 0 && html`
              <tr><td colspan="6" style="padding: 40px; text-align: center; color: #888;">
                No searches yet. Click "New Search" to get started.
              </td></tr>
            `}
            ${searches.map(s => html`
              <tr
                onClick=${() => onSelect(s)}
                style="cursor: pointer; border-top: 1px solid #f0f0f0;"
                onmouseover=${"this.style.background='#f8f8ff'"}
                onmouseout=${"this.style.background='white'"}
              >
                <td style="padding: 12px 16px; font-family: monospace; font-weight: 600;">${s.fileNumber}</td>
                <td style="padding: 12px 16px;">${s.property.address}</td>
                <td style="padding: 12px 16px; font-family: monospace; font-size: 12px;">${s.property.bbl}</td>
                <td style="padding: 12px 16px;">
                  <span style="padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${statusColor(s.status)}20; color: ${statusColor(s.status)};">
                    ${statusLabel(s.status)}
                  </span>
                </td>
                <td style="padding: 12px 16px;">
                  ${s.confidence ? html`
                    <span style="color: ${confidenceColor(s.confidence.overall)}; font-weight: 600;">
                      ${s.confidence.overall.toUpperCase()}
                    </span>
                  ` : '—'}
                </td>
                <td style="padding: 12px 16px; color: #666; font-size: 13px;">
                  ${new Date(s.requestedAt).toLocaleDateString()}
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// New Search Form
// ---------------------------------------------------------------------------

function NewSearchForm({ address, setAddress, borough, setBorough, selectedTypes, toggleType, onSubmit, loading }: any) {
  const searchTypeOptions = [
    { id: 'municipal', label: 'Municipal (all)', desc: 'DOB, HPD, Fire, Tax, C of O' },
    { id: 'dob_violations', label: 'DOB Violations', desc: 'ECB, OATH, after-hours' },
    { id: 'hpd_violations', label: 'HPD Violations', desc: 'Housing, heat, hot water' },
    { id: 'coo', label: 'Certificate of Occupancy', desc: 'C of O and pending applications' },
    { id: 'fire', label: 'Fire Department', desc: 'Fire violations, inspections, sprinklers' },
    { id: 'housing', label: 'Housing', desc: 'Rent stabilized, HPD registration' },
    { id: 'zoning', label: 'Zoning', desc: 'Zoning districts, map changes' },
    { id: 'environmental', label: 'Environmental', desc: 'Asbestos, spills, soil vapor' },
    { id: 'tax', label: 'Tax', desc: 'Tax liens, property tax accounts' },
    { id: 'title', label: 'Title Chain', desc: 'ACRIS, lis pendens, judgments' },
  ];

  const boroughs = ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island'];

  return html`
    <div style="max-width: 600px;">
      <h2 style="margin: 0 0 24px; font-size: 20px;">New Property Search</h2>
      <form onSubmit=${onSubmit} style="display: flex; flex-direction: column; gap: 20px;">

        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Property Address *</label>
          <input
            type="text"
            value=${address}
            onInput=${(e: Event) => setAddress((e.target as HTMLInputElement).value)}
            placeholder="350 5th Avenue"
            required
            style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 15px; box-sizing: border-box;"
          />
        </div>

        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Borough *</label>
          <select
            value=${borough}
            onChange=${(e: Event) => setBorough((e.target as HTMLSelectElement).value)}
            style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 15px;"
          >
            ${boroughs.map(b => html`<option value=${b}>${b}</option>`)}
          </select>
        </div>

        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">
            Search Types *
          </label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${searchTypeOptions.map(opt => html`
              <label style="display: flex; align-items: flex-start; gap: 8px; padding: 10px; border: 1px solid ${selectedTypes.includes(opt.id) ? '#0066cc' : '#ddd'}; border-radius: 6px; cursor: pointer; background: ${selectedTypes.includes(opt.id) ? '#f0f7ff' : 'white'};">
                <input
                  type="checkbox"
                  checked=${selectedTypes.includes(opt.id)}
                  onChange=${() => toggleType(opt.id)}
                  style="margin-top: 2px;"
                />
                <div>
                  <div style="font-weight: 600; font-size: 13px;">${opt.label}</div>
                  <div style="color: #888; font-size: 12px;">${opt.desc}</div>
                </div>
              </label>
            `)}
          </div>
        </div>

        <button
          type="submit"
          disabled=${loading || !address || selectedTypes.length === 0}
          style="padding: 14px; background: ${loading ? '#9ca' : '#0066cc'}; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: ${loading ? 'not-allowed' : 'pointer'};"
        >
          ${loading ? '⏳ Submitting...' : '🔍 Submit Property Search'}
        </button>

        <p style="color: #666; font-size: 13px; margin: 0;">
          🔗 Every result line will include a direct link to the official source record.
        </p>
      </form>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Search Detail
// ---------------------------------------------------------------------------

function SearchDetail({ search, onBack }: { search: Search; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'results' | 'review' | 'report'>('results');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  async function submitReview() {
    if (!reviewAction) return;
    await fetch(`/api/searches/${search.id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: reviewAction, reviewer: 'current-user' }),
    });
    onBack();
  }

  return html`
    <div>
      <button
        onClick=${onBack}
        style="background: none; border: none; cursor: pointer; color: #0066cc; font-size: 14px; padding: 0; margin-bottom: 16px;"
      >
        ← Back to Dashboard
      </button>

      <!-- Header -->
      <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-family: monospace; font-size: 20px; font-weight: 700; color: #1a1a2e;">
              ${search.fileNumber}
            </div>
            <div style="color: #666; margin-top: 4px;">
              ${search.property.address}, ${search.property.borough}
            </div>
            <div style="font-family: monospace; color: #888; font-size: 12px; margin-top: 2px;">
              BBL: ${search.property.bbl}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px; color: #666;">Status</div>
            <div style="padding: 6px 14px; border-radius: 20px; background: ${statusColor(search.status)}; color: white; font-weight: 600; font-size: 14px;">
              ${statusLabel(search.status)}
            </div>
          </div>
        </div>

        ${search.confidence && html`
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0; display: flex; gap: 24px;">
            <div>
              <div style="font-size: 11px; color: #888; text-transform: uppercase;">Confidence</div>
              <div style="font-size: 18px; font-weight: 700; color: ${confidenceColor(search.confidence.overall)};">
                ${search.confidence.overall.toUpperCase()}
              </div>
            </div>
            <div>
              <div style="font-size: 11px; color: #888; text-transform: uppercase;">Green</div>
              <div style="font-size: 18px; font-weight: 700; color: #22c55e;">${search.confidence.greenCount}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #888; text-transform: uppercase;">Yellow</div>
              <div style="font-size: 18px; font-weight: 700; color: #eab308;">${search.confidence.yellowCount}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #888; text-transform: uppercase;">Red</div>
              <div style="font-size: 18px; font-weight: 700; color: #ef4444;">${search.confidence.redCount}</div>
            </div>
          </div>
        `}
      </div>

      <!-- Human Review Gate Banner -->
      ${search.status === 'review' && html`
        <div style="background: #fef9c3; border: 2px solid #eab308; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700; color: #854d0e;">⚠️ Human Review Required</div>
            <div style="color: #713f12; font-size: 14px;">This search has yellow or red results. Review and approve before generating the report.</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button
              onClick=${() => { setReviewAction('approve'); submitReview(); }}
              style="padding: 8px 16px; background: #16a34a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;"
            >
              ✓ Approve
            </button>
            <button
              onClick=${() => { setReviewAction('reject'); submitReview(); }}
              style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;"
            >
              ✗ Reject
            </button>
          </div>
        </div>
      `}

      <!-- Tabs -->
      <div style="border-bottom: 2px solid #e5e5e5; display: flex; gap: 0; margin-bottom: 20px;">
        ${['results', 'review', 'report'].map(tab => html`
          <button
            onClick=${() => setActiveTab(tab as any)}
            style="padding: 12px 20px; border: none; background: none; cursor: pointer; font-weight: 600; color: ${activeTab === tab ? '#0066cc' : '#888'}; border-bottom: 2px solid ${activeTab === tab ? '#0066cc' : 'transparent'}; margin-bottom: -2px;"
          >
            ${tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        `)}
      </div>

      ${activeTab === 'results' && html`
        <div style="color: #666; font-size: 14px;">
          Results would be populated here from D1. Each result line shows the data field, value, and a 🔗 verify link to the official source.
        </div>
      `}

      ${activeTab === 'review' && html`
        <div style="color: #666; font-size: 14px;">
          Review interface: reviewer can see all yellow/red results, override confidence scores, add notes, and sign off.
        </div>
      `}

      ${activeTab === 'report' && html`
        <div>
          <button
            style="padding: 12px 24px; background: #0066cc; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: 600;"
            onClick=${async () => {
              const reportUrl = '/api/searches/' + search.id + '/report';
              await fetch(reportUrl, { method: 'POST' });
              alert('Report generation triggered. PDF will be available in R2.');
            }}
          >
            📄 Generate PDF Report
          </button>
        </div>
      `}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: '#6b7280',
    fetching: '#2563eb',
    review: '#eab308',
    approved: '#16a34a',
    report_ready: '#7c3aed',
    delivered: '#059669',
    failed: '#dc2626',
  };
  return map[status] ?? '#6b7280';
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pending',
    fetching: 'Fetching',
    review: 'Needs Review',
    approved: 'Approved',
    report_ready: 'Report Ready',
    delivered: 'Delivered',
    failed: 'Failed',
  };
  return map[status] ?? status;
}

function confidenceColor(level: string): string {
  const map: Record<string, string> = {
    high: '#16a34a',
    medium: '#eab308',
    low: '#dc2626',
    unknown: '#6b7280',
  };
  return map[level] ?? '#6b7280';
}

// ---------------------------------------------------------------------------
// Mount
// ---------------------------------------------------------------------------

declare function alert(msg: string): void;
declare const document: Document;

const root = document.getElementById('root');
if (root) {
  // @ts-ignore
  import('https://esm.sh/preact@10.19.3').then(({ render }) => {
    render(h(App, {}), root);
  });
}

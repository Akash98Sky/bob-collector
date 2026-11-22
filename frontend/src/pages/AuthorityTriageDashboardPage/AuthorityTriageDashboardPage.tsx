import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Issue, IssueStatus } from '../../models/issue';
import {
  getTriageStats,
  getTriageIssues,
  updateIssueStatus,
} from '../../services/issueService';
import { CategoryChip } from '../../components/CategoryChip/CategoryChip';
import { relativeTime } from '../../utils/time';
import styles from './AuthorityTriageDashboardPage.module.css';

type SortMode = 'upvotes' | 'newest' | 'oldest';
type FilterCat = 'all' | 'pothole' | 'garbage' | 'streetlight';

const WARDS = [
  'Ward 112 - Indiranagar East',
  'Ward 113 - Indiranagar West',
  'Ward 114 - Domlur Sector B',
  'Ward 115 - Halasuru Central',
];

const CREWS = [
  'Crew #1 (Electrical)',
  'Crew #2 (Sanitation)',
  'Crew #3 (Water Works)',
  'Crew #4 (Paving)',
  'Crew #5 (General)',
];

export function AuthorityTriageDashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getTriageStats>> | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('upvotes');
  const [filterCat, setFilterCat] = useState<FilterCat>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWard, setSelectedWard] = useState(WARDS[0]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [s, i] = await Promise.all([getTriageStats(), getTriageIssues()]);
      if (!cancelled) {
        setStats(s);
        setIssues(i);
        setLoading(false);
      }
    }
    Promise.resolve().then(() => { if (!cancelled) setLoading(true); });
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleStatusChange(issueId: string, status: IssueStatus) {
    const updated = await updateIssueStatus(issueId, status);
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  }

  const filtered = issues
    .filter((i) => filterCat === 'all' || i.category === filterCat)
    .filter((i) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return i.id.toLowerCase().includes(q) || i.location.address.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortMode === 'upvotes') return b.upvotes - a.upvotes;
      if (sortMode === 'newest') return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
    });

  return (
    <div className={styles.page}>
      {/* Auth banner */}
      <div className={styles.authBanner}>
        <div className={styles.authLeft}>
          <div className={styles.authIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified_user</span>
          </div>
          <div>
            <div className={styles.authTitle}>
              <span className={styles.authSession}>BOB COLLECTOR OPERATOR SESSION</span>
              <span className={styles.dot}>·</span>
              <span>Command Center (PIN Verified: <span className={styles.pin}>#••••</span>)</span>
            </div>
            <p className={styles.authSub}>
              Logged Operator: <strong>Eng. R. Sharma</strong> (Roads &amp; Sanitation Division)
              <span className={styles.shiftDot} />
              <span className={styles.shiftLabel}>Shift Active (08:00 - 18:00)</span>
            </p>
          </div>
        </div>
        <div className={styles.authActions}>
          <button className={styles.switchBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>switch_account</span>
            Switch Desk
          </button>
          <button className={styles.lockBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
            Lock Session
          </button>
        </div>
      </div>

      <div className={styles.inner}>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageEyebrow}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>tune</span>
              Bob Collector Fast Intake &amp; Triage Engine
            </div>
            <h1 className={styles.pageTitle}>Authority Dispatch Workspace</h1>
            <p className={styles.pageSubtitle}>
              Prioritize citizen submissions, coordinate maintenance squads, and mandate photo-proof signoffs.
            </p>
          </div>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            <span>Live Influx Synced</span>
            <span className={styles.divider}>|</span>
            <button className={styles.refreshBtn} onClick={() => window.location.reload()}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
              Refresh Queue
            </button>
          </div>
        </div>

        {/* KPI strip */}
        {stats && (
          <div className={styles.kpiGrid}>
            {/* Total active */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiDecor} />
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>Total Active Queue</span>
                <span className={styles.kpiBadge}>Live Influx</span>
              </div>
              <div className={styles.kpiValue}>
                <span className={`${styles.kpiNumber} ${styles.kpiPrimary}`}>{stats.totalActive}</span>
                <span className={styles.kpiUnit}>Pending field resolution</span>
              </div>
              <div className={styles.kpiBar}>
                <div className={styles.kpiBarLabel}>
                  <span>Breakdown:</span>
                  <span className={styles.kpiBarStat}>12 Potholes · 14 Waste · 8 Lights</span>
                </div>
                <div className={styles.segBar}>
                  <div className={styles.segPothole} style={{ width: '35.3%' }} />
                  <div className={styles.segGarbage} style={{ width: '41.2%' }} />
                  <div className={styles.segLight} style={{ width: '23.5%' }} />
                </div>
              </div>
            </div>

            {/* Resolved today */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiDecor} />
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>Resolved Today</span>
                <span className={styles.kpiBadgeGreen}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>trending_up</span>
                  ↑ {stats.resolvedTrend}% vs y&apos;day
                </span>
              </div>
              <div className={styles.kpiValue}>
                <span className={`${styles.kpiNumber} ${styles.kpiSecondary}`}>{stats.resolvedToday}</span>
                <span className={styles.kpiUnit}>Tickets verified closed</span>
              </div>
              <div className={styles.kpiBar}>
                <div className={styles.kpiTurnRow}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-secondary)' }}>pace</span>
                  <span className={styles.kpiTurnLabel}>Avg Turnaround:</span>
                  <span className={styles.kpiTurnValue}>{stats.avgTurnaroundHours}h</span>
                </div>
              </div>
            </div>

            {/* Urgent */}
            <div className={`${styles.kpiCard} ${styles.kpiUrgent}`}>
              <div className={`${styles.kpiDecor} ${styles.kpiDecorError}`} />
              <div className={styles.kpiTop}>
                <span className={`${styles.kpiLabel} ${styles.kpiLabelError}`}>High Crowd Priority</span>
                <span className={styles.kpiBadgeError}>ACTION REQ.</span>
              </div>
              <div className={styles.kpiValue}>
                <span className={`${styles.kpiNumber} ${styles.kpiError}`}>{stats.urgentCount} Urgent</span>
                <span className={styles.kpiUnit}>(5+ Citizen Upvotes)</span>
              </div>
              <div className={styles.kpiBar}>
                <div className={styles.urgentRow}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-error)' }}>emergency</span>
                  <span className={styles.urgentText}>Immediate dispatch protocol active</span>
                  <span className={styles.crewCount}>{stats.activeCrews} Crews Out</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            {/* Ward selector */}
            <div className={styles.selectWrap}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-primary)' }}>location_city</span>
              <label className={styles.selectLabel}>Ward:</label>
              <select
                className={styles.select}
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
              >
                {WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {/* Sort selector */}
            <div className={styles.selectWrap}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-secondary)' }}>sort</span>
              <label className={styles.selectLabel}>Sort By:</label>
              <select
                className={styles.select}
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="upvotes">Most Upvotes First</option>
                <option value="newest">Newest Submissions</option>
                <option value="oldest">Oldest / SLA At Risk</option>
              </select>
            </div>

            {/* Category chips */}
            <div className={styles.catChips}>
              {(['all', 'pothole', 'garbage', 'streetlight'] as const).map((cat) => (
                <button
                  key={cat}
                  className={`${styles.catChip} ${filterCat === cat ? styles.catChipActive : ''}`}
                  onClick={() => setFilterCat(cat)}
                >
                  {cat === 'all' ? `All (${issues.length})` : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className={styles.toolbarRight}>
            <div className={styles.searchWrap}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--color-outline)' }}>search</span>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search ticket # or road…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Triage list */}
        <div className={styles.triageList}>
          <div className={styles.listHeader}>
            <span className={styles.listTitle}>Critical Triage List</span>
            <span className={styles.listMeta}>
              Showing {filtered.length} actionable ticket{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading && (
            <div className={styles.loading}>
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>hourglass_empty</span>
              Loading triage queue…
            </div>
          )}

          {!loading && filtered.map((issue) => (
            <TriageRow
              key={issue.id}
              issue={issue}
              onStatusChange={handleStatusChange}
            />
          ))}

          {!loading && filtered.length === 0 && (
            <div className={styles.empty}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.2 }}>check_circle</span>
              <p>No issues match the current filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Triage Row sub-component ──────────────────────────────────────────────

interface TriageRowProps {
  issue: Issue;
  onStatusChange: (id: string, status: IssueStatus) => Promise<void>;
}

function TriageRow({ issue, onStatusChange }: TriageRowProps) {
  const isUrgent = issue.upvotes >= 30;
  const [assignedCrew, setAssignedCrew] = useState(issue.assignedCrew ?? '');
  const [changingStatus, setChangingStatus] = useState(false);

  async function handleStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    setChangingStatus(true);
    await onStatusChange(issue.id, e.target.value as IssueStatus);
    setChangingStatus(false);
  }

  return (
    <div className={`${styles.triageRow} ${isUrgent ? styles.triageRowUrgent : ''}`}>
      {/* Priority strip */}
      <div className={`${styles.priorityStrip} ${
        issue.status === 'open' ? styles.stripOpen :
        issue.status === 'in_progress' ? styles.stripInProgress : styles.stripResolved
      }`} />

      <div className={styles.rowInner}>
        {/* Thumbnail */}
        {issue.citizenPhoto && (
          <div className={styles.thumb}>
            <img src={issue.citizenPhoto.url} alt={issue.title} />
            <span className={styles.thumbInspect}>Inspect</span>
          </div>
        )}
        {!issue.citizenPhoto && (
          <div className={`${styles.thumb} ${styles.thumbEmpty}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.3 }}>image_not_supported</span>
          </div>
        )}

        {/* Identity */}
        <div className={styles.rowDetails}>
          <div className={styles.rowMeta}>
            <span className={styles.ticketId}>{issue.id}</span>
            {isUrgent && (
              <span className={styles.urgentBadge}>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>local_fire_department</span>
                {issue.upvotes} Upvotes · High Priority
              </span>
            )}
            <CategoryChip category={issue.category} />
            <span className={styles.reportedTime}>· Reported {relativeTime(issue.reportedAt)}</span>
          </div>
          <h2 className={styles.rowTitle}>{issue.title}</h2>
          <div className={styles.rowLocation}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-secondary)' }}>near_me</span>
            {issue.location.address}
            <a
              href={`https://maps.google.com/?q=${issue.location.lat},${issue.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapsLink}
            >
              Open in Maps
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>
            </a>
          </div>
          <p className={styles.rowDesc}>{issue.description}</p>
        </div>

        {/* Actions */}
        <div className={styles.rowActions}>
          {/* Status dropdown */}
          <div className={styles.actionGroup}>
            <span className={styles.actionLabel}>Status Override</span>
            <div className={styles.statusSelectWrap}>
              <select
                className={`${styles.statusSelect} ${
                  issue.status === 'open' ? styles.selectOpen :
                  issue.status === 'in_progress' ? styles.selectInProgress : styles.selectResolved
                }`}
                value={issue.status}
                onChange={handleStatus}
                disabled={changingStatus}
              >
                <option value="open">● Open (Unresolved)</option>
                <option value="in_progress">● In Progress</option>
                <option value="resolved">● Resolved (Requires Proof)</option>
              </select>
              <span className="material-symbols-outlined" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>expand_more</span>
            </div>
          </div>

          {/* Crew assignment */}
          <div className={styles.actionGroup}>
            <span className={styles.actionLabel}>Assigned Squad</span>
            <select
              className={styles.crewSelect}
              value={assignedCrew}
              onChange={(e) => setAssignedCrew(e.target.value)}
            >
              <option value="">Unassigned</option>
              {CREWS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Photo proof upload */}
          <div className={styles.actionGroup}>
            <span className={styles.actionLabel}>Required For Resolution</span>
            <Link to={`/issues/${issue.id}`} className={styles.proofBtn}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_a_photo</span>
              Upload Resolution Photo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

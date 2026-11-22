import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Issue, IssueCategory } from '../../models/issue';
import { getIssues } from '../../services/issueService';
import { IssueCard } from '../../components/IssueCard/IssueCard';
import styles from './PublicIssueFeedPage.module.css';

type ViewMode = 'list' | 'map';

const FILTER_PILLS: { label: string; value: IssueCategory | 'all'; dot: string }[] = [
  { label: 'All',         value: 'all',         dot: '' },
  { label: 'Pothole',     value: 'pothole',     dot: 'var(--color-error)' },
  { label: 'Garbage',     value: 'garbage',     dot: 'var(--color-on-tertiary-container)' },
  { label: 'Streetlight', value: 'streetlight', dot: 'var(--color-secondary)' },
  { label: 'Drainage',    value: 'drainage',    dot: 'var(--color-primary-container)' },
  { label: 'Tree Fall',   value: 'tree_fall',   dot: 'var(--color-secondary-container)' },
];

export function PublicIssueFeedPage() {
  const [view, setView] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<IssueCategory | 'all'>('all');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await getIssues(activeFilter !== 'all' ? { category: activeFilter } : undefined);
      if (!cancelled) {
        setIssues(data);
        setLoading(false);
      }
    }
    // Reset loading via a microtask to avoid synchronous setState-in-effect
    Promise.resolve().then(() => { if (!cancelled) setLoading(true); });
    load();
    return () => { cancelled = true; };
  }, [activeFilter]);

  const totalCount = issues.length;

  return (
    <div className={styles.page}>
      {/* Live banner */}
      <div className={styles.banner}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerIcon}>
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot} />
              <span>Live Bob Collector Feed</span>
            </div>
            <p className={styles.bannerStat}>847 Resolved this Month · Avg: 18h</p>
          </div>
        </div>
        <div className={styles.slaBadge}>
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>timer</span>
          94.2% SLA
        </div>
      </div>

      {/* Content shell */}
      <div className={styles.shell}>
        {/* View switcher */}
        <div className={styles.viewSwitcher}>
          <button
            className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('list')}
          >
            <span className="material-symbols-outlined">format_list_bulleted</span>
            List View
            <span className={styles.viewCount}>{totalCount}</span>
          </button>
          <button
            className={`${styles.viewBtn} ${view === 'map' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('map')}
          >
            <span className="material-symbols-outlined">map</span>
            Map View
            <span className={styles.urgentDot} />
          </button>
        </div>

        {/* Category filter strip */}
        <div className={`${styles.filterStrip} no-scrollbar`}>
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.value}
              className={`${styles.filterPill} ${activeFilter === pill.value ? styles.filterPillActive : ''}`}
              onClick={() => setActiveFilter(pill.value)}
            >
              {pill.dot && (
                <span
                  className={styles.filterDot}
                  style={{ background: pill.dot }}
                />
              )}
              {pill.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        {view === 'list' ? (
          <div className={styles.list}>
            {loading && (
              <div className={styles.loading}>
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>hourglass_empty</span>
                Loading issues…
              </div>
            )}
            {!loading && issues.length === 0 && (
              <div className={styles.empty}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.3 }}>sentiment_satisfied</span>
                <p>No issues in this category right now.</p>
              </div>
            )}
            {!loading && issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className={styles.mapPlaceholder}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.3 }}>map</span>
            <p>Map view coming soon</p>
            <p style={{ fontSize: 12, opacity: 0.6 }}>Will integrate with a maps provider</p>
          </div>
        )}
      </div>

      {/* Floating report button */}
      <Link to="/report" className={styles.fab} aria-label="Report a new issue">
        <span className="material-symbols-outlined">add</span>
        Report Issue
      </Link>
    </div>
  );
}

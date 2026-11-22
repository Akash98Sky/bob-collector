import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import type { Issue } from '../../models/issue';
import { getIssueById, upvoteIssue } from '../../services/issueService';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { CategoryChip } from '../../components/CategoryChip/CategoryChip';
import { UpvoteButton } from '../../components/UpvoteButton/UpvoteButton';
import { relativeTime } from '../../utils/time';
import styles from './IssueDetailPage.module.css';

export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const justSubmitted = searchParams.get('submitted') === '1';

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sliderPct, setSliderPct] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [copied, setCopied] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const issueId = id;
    let cancelled = false;
    async function load() {
      const found = await getIssueById(issueId);
      if (!cancelled) {
        if (!found) setNotFound(true);
        else setIssue(found);
        setLoading(false);
      }
    }
    Promise.resolve().then(() => { if (!cancelled) setLoading(true); });
    load();
    return () => { cancelled = true; };
  }, [id]);

  /* Slider drag */
  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    e.preventDefault();
  }
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      setSliderPct(pct);
    }
    function onUp() { dragging.current = false; }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove as EventListener);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove as EventListener);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  function copyId() {
    if (!issue) return;
    navigator.clipboard.writeText(issue.id).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleUpvote() {
    if (!issue || upvoting) return;
    setUpvoting(true);
    try {
      const updated = await upvoteIssue(issue.id);
      setIssue(updated);
    } finally {
      setUpvoting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.centred}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, opacity: 0.3 }}>hourglass_empty</span>
        <p>Loading issue…</p>
      </div>
    );
  }

  if (notFound || !issue) {
    return (
      <div className={styles.centred}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.2 }}>search_off</span>
        <p>Issue not found</p>
        <Link to="/" className={styles.backLink}>← Back to Feed</Link>
      </div>
    );
  }

  const hasProof = issue.citizenPhoto && issue.resolutionPhoto;

  return (
    <div className={styles.page}>
      {/* Success toast */}
      {justSubmitted && (
        <div className={styles.successToast}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
          Report submitted! Tracking ID: <strong>{issue.id}</strong>
        </div>
      )}

      <div className={styles.content}>
        {/* Back & audit */}
        <div className={styles.topRow}>
          <Link to="/" className={styles.backLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            Back to Feed
          </Link>
          <div className={styles.auditBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-secondary)' }}>verified_user</span>
            Public Ledger Audit
          </div>
        </div>

        {/* Ticket header */}
        <div className={styles.ticketCard}>
          <div className={styles.ticketTop}>
            <div className={styles.ticketId}>
              <h2>#{issue.id}</h2>
              <button className={styles.copyBtn} onClick={copyId} title="Copy ticket ID">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
            <StatusBadge status={issue.status} />
          </div>
          <div className={styles.ticketMeta}>
            <CategoryChip category={issue.category} size="md" />
            {issue.turnaroundMinutes && (
              <span className={styles.turnaround}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--color-on-tertiary-container)' }}>schedule</span>
                Turnaround: {Math.floor(issue.turnaroundMinutes / 60)}h {issue.turnaroundMinutes % 60}m
              </span>
            )}
          </div>
          <div className={styles.ticketActions}>
            <UpvoteButton
              count={issue.upvotes}
              voted={issue.hasUserUpvoted}
              onToggle={handleUpvote}
              disabled={upvoting}
            />
            <span className={styles.commentCount}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat_bubble_outline</span>
              {issue.commentCount} comments
            </span>
            <span className={styles.reportedAt}>
              Reported {relativeTime(issue.reportedAt)}
            </span>
          </div>
        </div>

        {/* Before / After proof slider */}
        {hasProof && (
          <div className={styles.proofContainer}>
            <div className={styles.proofHeader}>
              <div className={styles.proofTitle}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--color-secondary)' }}>verified</span>
                Verified Proof Inspection
              </div>
              <span className={styles.dualStamp}>Dual Timestamped</span>
            </div>

            <div
              className={styles.slider}
              ref={sliderRef}
              onMouseDown={onMouseDown}
              onTouchStart={() => { dragging.current = true; }}
            >
              {/* Before layer (full) */}
              <div className={styles.beforeLayer}>
                <img src={issue.citizenPhoto!.url} alt="Before" />
                <div className={styles.layerGradient} />
                <div className={styles.layerLabel}>
                  <span className={styles.labelBefore}>CITIZEN REPORT (Before)</span>
                  <span className={styles.labelTime}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                    {issue.citizenPhoto!.timestamp}
                  </span>
                </div>
              </div>

              {/* After layer (clipped) */}
              <div className={styles.afterLayer} style={{ width: `${sliderPct}%` }}>
                <div className={styles.afterInner}>
                  <img src={issue.resolutionPhoto!.url} alt="After" />
                  <div className={styles.layerGradient} />
                  <div className={styles.layerLabel}>
                    <span className={styles.labelAfter}>AUTHORITY FIX (After)</span>
                    <span className={styles.labelTime} style={{ color: 'var(--color-inverse-on-surface)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                      {issue.resolutionPhoto!.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Handle */}
              <div className={styles.handle} style={{ left: `${sliderPct}%` }}>
                <div className={styles.handleCircle}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>drag_indicator</span>
                </div>
              </div>

              <div className={styles.slideHint}>Slide to compare</div>
            </div>

            <div className={styles.verifyRibbon}>
              <span className={styles.verifyLeft}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
                Geotag &amp; Registry Verified
              </span>
              <span className={styles.verifyAccuracy}>Accuracy ±{issue.location.accuracyMeters}m</span>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className={styles.timelineCard}>
          <div className={styles.timelineHeader}>
            <h3>Resolution Timeline</h3>
            {issue.turnaroundMinutes && (
              <span className={styles.completedIn}>
                Completed in {Math.floor(issue.turnaroundMinutes / 60)}h {issue.turnaroundMinutes % 60}m
              </span>
            )}
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineLine} />
            {issue.timeline.map((step, i) => (
              <div key={i} className={`${styles.timelineStep} ${step.completed ? styles.stepDone : step.active ? styles.stepActive : styles.stepPending}`}>
                <div className={styles.stepCircle}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{step.icon}</span>
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
                <span className={styles.stepTime}>{step.timestamp}</span>
                <span className={styles.stepSub}>{step.subLabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location & metadata */}
        <div className={styles.metaCard}>
          <div className={styles.metaLocation}>
            <div className={styles.metaLocationIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>location_on</span>
            </div>
            <div>
              <span className={styles.metaSubLabel}>Exact Location</span>
              <p className={styles.metaAddress}>{issue.location.address}</p>
              <a
                href={`https://maps.google.com/?q=${issue.location.lat},${issue.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapsLink}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Mini map placeholder */}
          <div className={styles.miniMap}>
            <div className={styles.miniMapPin}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>pin_drop</span>
            </div>
            <div className={styles.coordPill}>
              <span className={styles.coordDot} />
              {issue.location.lat}° N, {issue.location.lng}° E
            </div>
          </div>

          {/* Department */}
          {issue.department && (
            <div className={styles.deptRow}>
              <div className={styles.deptIcon}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_balance</span>
              </div>
              <div>
                <span className={styles.metaSubLabel}>Assigned Authority</span>
                <p className={styles.deptName}>{issue.department}</p>
                {issue.workOrderId && (
                  <span className={styles.workOrder}>Road Infrastructure Division · Work Order #{issue.workOrderId}</span>
                )}
              </div>
            </div>
          )}

          {/* Upvotes summary */}
          <div className={styles.supportRow}>
            <div className={styles.avatars}>
              {['RK', 'AM', 'SL'].map((initials) => (
                <div key={initials} className={styles.avatar}>{initials}</div>
              ))}
              <div className={`${styles.avatar} ${styles.avatarMore}`}>+{issue.upvotes - 3}</div>
            </div>
            <div>
              <p className={styles.supportCount}>{issue.upvotes} Citizens</p>
              <p className={styles.supportSub}>Validated this issue</p>
            </div>
            <UpvoteButton
              count={issue.upvotes}
              voted={issue.hasUserUpvoted}
              onToggle={handleUpvote}
              disabled={upvoting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

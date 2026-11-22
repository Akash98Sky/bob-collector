import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Issue } from '../../models/issue';
import { upvoteIssue } from '../../services/issueService';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { CategoryChip } from '../CategoryChip/CategoryChip';
import { UpvoteButton } from '../UpvoteButton/UpvoteButton';
import { relativeTime } from '../../utils/time';
import styles from './IssueCard.module.css';

interface Props {
  issue: Issue;
  onUpvoted?: (updated: Issue) => void;
}

export function IssueCard({ issue, onUpvoted }: Props) {
  const [localIssue, setLocalIssue] = useState(issue);
  const [upvoting, setUpvoting] = useState(false);

  async function handleUpvote() {
    if (upvoting) return;
    setUpvoting(true);
    try {
      const updated = await upvoteIssue(localIssue.id);
      setLocalIssue(updated);
      onUpvoted?.(updated);
    } finally {
      setUpvoting(false);
    }
  }

  const photoUrl = localIssue.citizenPhoto?.url;

  return (
    <article className={styles.card}>
      {/* Header row */}
      <div className={styles.header}>
        <div className={styles.badges}>
          <StatusBadge status={localIssue.status} />
          <CategoryChip category={localIssue.category} />
        </div>
        <span className={styles.time}>
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>schedule</span>
          {relativeTime(localIssue.reportedAt)}
        </span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {photoUrl && (
          <div className={styles.thumb}>
            <img src={photoUrl} alt={localIssue.title} loading="lazy" />
            <span className={styles.geoTag}>GEO-VERIFIED</span>
          </div>
        )}
        <div className={styles.content}>
          <h3 className={styles.title}>{localIssue.title}</h3>
          <p className={styles.desc}>{localIssue.description}</p>
          <div className={styles.location}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-primary)' }}>pin_drop</span>
            <span>{localIssue.location.address}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <UpvoteButton
          count={localIssue.upvotes}
          voted={localIssue.hasUserUpvoted}
          onToggle={handleUpvote}
          disabled={upvoting}
        />
        <div className={styles.footerRight}>
          <span className={styles.comments}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat_bubble_outline</span>
            {localIssue.commentCount}
          </span>
          <Link to={`/issues/${localIssue.id}`} className={styles.detailLink}>
            Details
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

import type { IssueStatus } from '../../models/issue';
import styles from './StatusBadge.module.css';

interface Props {
  status: IssueStatus;
}

const CONFIG: Record<IssueStatus, { label: string; className: string; dot: string }> = {
  open:        { label: 'OPEN',        className: styles.open,       dot: styles.dotPing },
  in_progress: { label: 'IN PROGRESS', className: styles.inProgress, dot: styles.dotSpin },
  resolved:    { label: 'RESOLVED',    className: styles.resolved,   dot: '' },
};

export function StatusBadge({ status }: Props) {
  const { label, className, dot } = CONFIG[status];
  return (
    <span className={`${styles.badge} ${className}`}>
      <span className={`${styles.dot} ${dot}`} />
      {label}
    </span>
  );
}

import styles from './UpvoteButton.module.css';

interface Props {
  count: number;
  voted: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function UpvoteButton({ count, voted, onToggle, disabled }: Props) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${voted ? styles.voted : ''}`}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={voted}
      aria-label={`${count} upvotes`}
    >
      <span className={`${styles.icon} material-symbols-outlined`}>thumb_up</span>
      <span className={`${styles.count} tabular`}>{count} Me Too</span>
    </button>
  );
}

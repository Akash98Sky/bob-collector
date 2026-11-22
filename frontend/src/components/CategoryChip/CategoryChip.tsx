import type { IssueCategory } from '../../models/issue';
import { CATEGORY_META } from '../../utils/categoryMeta';
import styles from './CategoryChip.module.css';

const COLOR_CLASS: Record<IssueCategory, string> = {
  pothole:     styles.pothole,
  garbage:     styles.garbage,
  streetlight: styles.streetlight,
  drainage:    styles.drainage,
  tree_fall:   styles.treeFall,
  other:       styles.other,
};

interface Props {
  category: IssueCategory;
  size?: 'sm' | 'md';
}

export function CategoryChip({ category, size = 'sm' }: Props) {
  const { label, icon } = CATEGORY_META[category];
  const colorClass = COLOR_CLASS[category];
  return (
    <span className={`${styles.chip} ${colorClass} ${size === 'md' ? styles.md : ''}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </span>
  );
}

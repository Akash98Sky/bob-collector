import type { IssueCategory } from '../models/issue';

export const CATEGORY_META: Record<
  IssueCategory,
  { label: string; icon: string }
> = {
  pothole:     { label: 'Pothole',      icon: 'warning'      },
  garbage:     { label: 'Garbage',      icon: 'delete_sweep' },
  streetlight: { label: 'Streetlight',  icon: 'lightbulb'    },
  drainage:    { label: 'Drainage',     icon: 'water_damage' },
  tree_fall:   { label: 'Tree Fall',    icon: 'park'         },
  other:       { label: 'Other',        icon: 'more_horiz'   },
};

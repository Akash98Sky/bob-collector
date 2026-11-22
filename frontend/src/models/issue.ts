// ─── Issue domain model ───────────────────────────────────────────────────

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export type IssueCategory =
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'drainage'
  | 'tree_fall'
  | 'other';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  ward: string;
  accuracyMeters: number;
}

export interface TimelineStep {
  id: string;
  label: string;
  subLabel: string;
  timestamp: string;
  icon: string;
  completed: boolean;
  active: boolean;
}

export interface ProofImage {
  url: string;
  timestamp: string;
  capturedBy: 'citizen' | 'authority';
  label: string;
}

export interface Issue {
  id: string;               // e.g. "CP-4092"
  title: string;
  description: string;
  status: IssueStatus;
  category: IssueCategory;
  location: GeoLocation;
  reportedAt: string;       // ISO date string
  upvotes: number;
  commentCount: number;
  hasUserUpvoted: boolean;
  citizenPhoto?: ProofImage;
  resolutionPhoto?: ProofImage;
  timeline: TimelineStep[];
  assignedCrew?: string;
  wardSla?: string;
  workOrderId?: string;
  department?: string;
  turnaroundMinutes?: number;
}

// ─── Form data for creating a new issue ───────────────────────────────────

export interface ReportIssueFormData {
  photoFile: File | null;
  location: GeoLocation | null;
  category: IssueCategory | null;
  notes: string;
  hazardTags: string[];
}

// ─── Triage entry used in the authority dashboard ─────────────────────────

export interface TriageStats {
  totalActive: number;
  resolvedToday: number;
  avgTurnaroundHours: number;
  resolvedTrend: number;        // % change vs yesterday
  urgentCount: number;
  activeCrews: number;
  breakdown: { category: IssueCategory; count: number }[];
}

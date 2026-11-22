import type { Issue, IssueCategory, IssueStatus } from '../models/issue';

// ─── Seed data ────────────────────────────────────────────────────────────

const MOCK_ISSUES: Issue[] = [
  {
    id: 'CP-4092',
    title: 'Road Cave-in on 12th Main',
    description:
      'Heavy crater forming after rain. Two-wheelers violently skidding during evening rush hour.',
    status: 'resolved',
    category: 'pothole',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Opp. Metro Pillar 84, 12th Main, Ward 112, East Zone',
      ward: 'Ward 112',
      accuracyMeters: 2.4,
    },
    reportedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    upvotes: 42,
    commentCount: 11,
    hasUserUpvoted: false,
    citizenPhoto: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnPXUo5P1GQ0ssP02oRW6eVGeJoa4uyFrKfP4bxup4Js6XHsIwKMx1odfxmLnKD4ab4wC9Rt5ewwIh1qPcr5xYnap-IOtRHlJMmaSEHPtWNJllY17meoJnRaJWhzVN7wCXjGtbsciMRjd0B-8soirkmImWFOzLahc_JOQaZTcHZpyHaiU92Gwtb-s-2hLb6fTIDXSXjnv72RSsjAqIzMAEi8GSDAv4rsZBapVy0f8',
      timestamp: 'May 18, 08:30 AM',
      capturedBy: 'citizen',
      label: 'CITIZEN REPORT (Before)',
    },
    resolutionPhoto: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfvE1SHSQ3GomSx7qLhlFHM6afSHTC8faB20pRiIv0q-HTqiQUxv7lEBodNc7EkY1CSP7y3f6u33W_Dk0mwv8a8tGblT1MFO4qVlRay9P5JSxMWnK2XxQhTfVEIvL-5FocZ9WIA-DL15fyxCx7og4l2zVXs7T9MH8BKXAGtuZ8jnb8WzIxEqpzT4Q5igMPtFb4i_OFd4iHcE2ooJbtz9rW_BOXgMKQAOwRZi7MYNU',
      timestamp: 'May 18, 03:15 PM',
      capturedBy: 'authority',
      label: 'AUTHORITY FIX (After)',
    },
    timeline: [
      { id: '1', label: 'Reported', subLabel: 'Citizen Intake', timestamp: '8:30 AM', icon: 'check', completed: true, active: false },
      { id: '2', label: 'Dispatched', subLabel: 'Crew #4 Arrived', timestamp: '11:15 AM', icon: 'local_shipping', completed: true, active: false },
      { id: '3', label: 'Resolved', subLabel: 'Paved & Tested', timestamp: '3:15 PM', icon: 'task_alt', completed: true, active: false },
    ],
    assignedCrew: 'Crew #4 (Paving)',
    wardSla: '48h',
    workOrderId: 'RD-8842',
    department: 'BBMP / City Municipal Corporation',
    turnaroundMinutes: 405,
  },
  {
    id: 'CP-4095',
    title: 'Garbage Dump Overflow',
    description:
      'Bin spilled onto pedestrian walkway. Stray animals obstructing morning vegetable vendors.',
    status: 'in_progress',
    category: 'garbage',
    location: {
      lat: 12.9718,
      lng: 77.5912,
      address: 'Near City Market South Gate',
      ward: 'Ward 112',
      accuracyMeters: 5,
    },
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    upvotes: 28,
    commentCount: 12,
    hasUserUpvoted: true,
    citizenPhoto: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQxFFN-8XcUbQDFsybgWKHm3iKkNg-6jlpvGvq4plZZL0QJWo5fJU0LOErujyZzNalIDVv3qEytiXtkRNTXAjBGulksCnuSG6x7akvOkaG6lNoV81aqsUQmYHMkKtAfaEbropGDDZ8kryLVZ-u3sjmq41-WNUwSgaAkqsxt7rLT2keKnA90hyvjs4DVJHoP-27RZHEeZjtvsASTFLpvkXcK5Nf4C2UvPxXMV4RWBA',
      timestamp: 'Today, 10:00 AM',
      capturedBy: 'citizen',
      label: 'CITIZEN REPORT',
    },
    timeline: [
      { id: '1', label: 'Reported', subLabel: 'Citizen Intake', timestamp: '10:00 AM', icon: 'check', completed: true, active: false },
      { id: '2', label: 'Dispatched', subLabel: 'Truck En Route', timestamp: '12:30 PM', icon: 'local_shipping', completed: false, active: true },
      { id: '3', label: 'Resolved', subLabel: 'Pending Proof', timestamp: '—', icon: 'task_alt', completed: false, active: false },
    ],
    assignedCrew: 'Compactor Truck #18',
    wardSla: '24h',
    turnaroundMinutes: undefined,
  },
  {
    id: 'CP-4091',
    title: 'Street Light Out — HSR Layout',
    description:
      'Entire stretch of 24th Main dark from 7 PM. Near school zone creates safety hazard.',
    status: 'resolved',
    category: 'streetlight',
    location: {
      lat: 12.9741,
      lng: 77.6383,
      address: '24th Main, HSR Layout Sector 2',
      ward: 'Ward 109',
      accuracyMeters: 8,
    },
    reportedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    upvotes: 17,
    commentCount: 5,
    hasUserUpvoted: false,
    timeline: [
      { id: '1', label: 'Reported', subLabel: 'Citizen Intake', timestamp: 'Yesterday 6 PM', icon: 'check', completed: true, active: false },
      { id: '2', label: 'Dispatched', subLabel: 'Electrician Crew', timestamp: 'Yesterday 9 PM', icon: 'local_shipping', completed: true, active: false },
      { id: '3', label: 'Resolved', subLabel: 'Bulb Replaced', timestamp: 'Yesterday 11 PM', icon: 'task_alt', completed: true, active: false },
    ],
    turnaroundMinutes: 300,
  },
  {
    id: 'CP-4098',
    title: 'Hazardous Deep Asphalt Cavity',
    description:
      'Vehicle suspension damage observed. Two scooter riders fell during evening rainfall. Depth exceeds 14cm with exposed base rock.',
    status: 'open',
    category: 'pothole',
    location: {
      lat: 12.9752,
      lng: 77.5968,
      address: 'Opposite Metro Pillar 84, Indiranagar 100ft Rd',
      ward: 'Ward 112',
      accuracyMeters: 4,
    },
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upvotes: 42,
    commentCount: 7,
    hasUserUpvoted: false,
    citizenPhoto: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP5ZWIdCv3V82_1qpOIL6xZOUtd5OmHJj2-sOHN2s6VGt3JxOXtBKb_b_CBFtvEHUS6uRHsagsBg3RgihuRXevG0UBbZicMXYE2QO2FLZDy1bUduhw0ED0Nt79owKy95X5HM_4SXfDTDO3xbq3HlmHGWC3tpUKN89Bo6Q7UmmlUrM_30OIx2rJMai2vAmAMf--l7qXuhmNPuzcE2TVzeBBUXAZhV7hAOc5Vvk2GSc',
      timestamp: 'Today, 14:22',
      capturedBy: 'citizen',
      label: 'CITIZEN REPORT',
    },
    timeline: [
      { id: '1', label: 'Reported', subLabel: 'Citizen Intake', timestamp: '2h ago', icon: 'check', completed: true, active: false },
      { id: '2', label: 'Dispatched', subLabel: 'Awaiting Crew', timestamp: '—', icon: 'local_shipping', completed: false, active: true },
      { id: '3', label: 'Resolved', subLabel: 'Pending', timestamp: '—', icon: 'task_alt', completed: false, active: false },
    ],
    wardSla: '48h',
  },
  {
    id: 'CP-4096',
    title: 'Broken Drainage Cover',
    description:
      'Open drainage manhole on 5th Cross. No barrier or signage. Risk of falls, especially for cyclists.',
    status: 'open',
    category: 'drainage',
    location: {
      lat: 12.9701,
      lng: 77.5928,
      address: '5th Cross, Indiranagar',
      ward: 'Ward 112',
      accuracyMeters: 6,
    },
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    upvotes: 11,
    commentCount: 3,
    hasUserUpvoted: false,
    timeline: [
      { id: '1', label: 'Reported', subLabel: 'Citizen Intake', timestamp: '6h ago', icon: 'check', completed: true, active: false },
      { id: '2', label: 'Dispatched', subLabel: 'Awaiting Crew', timestamp: '—', icon: 'local_shipping', completed: false, active: false },
      { id: '3', label: 'Resolved', subLabel: 'Pending', timestamp: '—', icon: 'task_alt', completed: false, active: false },
    ],
    wardSla: '48h',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

// ─── API Functions ────────────────────────────────────────────────────────

export async function getIssues(options?: {
  category?: IssueCategory;
  status?: IssueStatus;
  ward?: string;
}): Promise<Issue[]> {
  await delay();
  let results = [...MOCK_ISSUES];
  if (options?.category) results = results.filter((i) => i.category === options.category);
  if (options?.status)   results = results.filter((i) => i.status   === options.status);
  if (options?.ward)     results = results.filter((i) => i.location.ward === options.ward);
  return results;
}

export async function getIssueById(id: string): Promise<Issue | undefined> {
  await delay();
  return MOCK_ISSUES.find((i) => i.id === id);
}

export async function upvoteIssue(id: string): Promise<Issue> {
  await delay(150);
  const issue = MOCK_ISSUES.find((i) => i.id === id);
  if (!issue) throw new Error(`Issue ${id} not found`);
  issue.upvotes += issue.hasUserUpvoted ? -1 : 1;
  issue.hasUserUpvoted = !issue.hasUserUpvoted;
  return { ...issue };
}

export async function updateIssueStatus(
  id: string,
  status: IssueStatus,
): Promise<Issue> {
  await delay(200);
  const issue = MOCK_ISSUES.find((i) => i.id === id);
  if (!issue) throw new Error(`Issue ${id} not found`);
  issue.status = status;
  return { ...issue };
}

export interface SubmitIssuePayload {
  category: string;
  notes: string;
  hazardTags: string[];
  locationAddress: string;
}

export async function submitIssue(
  payload: SubmitIssuePayload,
): Promise<{ id: string }> {
  void payload; // mock — payload will be sent to backend
  await delay(800);
  return { id: 'CP-' + (Math.floor(Math.random() * 1000) + 4100) };
}

export async function getTriageStats() {
  await delay(300);
  return {
    totalActive: 34,
    resolvedToday: 19,
    avgTurnaroundHours: 4.8,
    resolvedTrend: 24,
    urgentCount: 7,
    activeCrews: 4,
    breakdown: [
      { category: 'pothole' as IssueCategory, count: 12 },
      { category: 'garbage' as IssueCategory, count: 14 },
      { category: 'streetlight' as IssueCategory, count: 8 },
    ],
  };
}

export async function getTriageIssues(wardId?: string): Promise<Issue[]> {
  await delay();
  const all = await getIssues();
  const ward = wardId ?? 'Ward 112';
  return all
    .filter((i) => i.location.ward === ward)
    .sort((a, b) => b.upvotes - a.upvotes);
}

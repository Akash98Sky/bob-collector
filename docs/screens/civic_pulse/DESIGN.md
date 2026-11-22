---
name: Bob Collector
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444653'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#4c2e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b4200'
  on-tertiary-container: '#ffa929'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
  numeric-stat:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an approachable civic engagement aesthetic, combining polished modern curves with crisp, balanced data hierarchy for citizen-led reporting. It bridges the gap between everyday community members and municipal administrators through an interface that conveys institutional trustworthiness, operational speed, and clarity.

The visual style blends modern corporate clarity with tactile, card-based utility:
- **Tone:** Civic-minded, accountable, transparent, and encouraging.
- **Audience:** Everyday residents filing geotagged reports, field technicians updating resolution statuses, and municipal staff triaging service queues.
- **Emotional Response:** High confidence that submissions are registered, tracked, and handled with public accountability.

## Colors

The palette is engineered for maximum contrast, civic legitimacy, and instant status comprehension.

- **Primary (`#1E40AF`):** The municipal anchor tone. Used for major actions, active navigation states, primary pins, and brand identification.
- **Secondary (`#0D9488`):** Teal accent for civic agency, community upvotes, and public validation cues.
- **Tertiary (`#F59E0B`):** Warm amber assigned strictly to transitional states, such as "In Progress" or "Under Inspection."
- **Semantic Status Signals:**
  - **Open / Urgent:** `#EF4444` for unaddressed hazards, pothole reports, and critical alerts.
  - **In Progress:** `#F59E0B` for acknowledged tickets with dispatched crews.
  - **Resolved / Verified:** `#10B981` for completed municipal work and verified public resolutions.
- **Neutral Palette:**
  - Background: Crisp off-white (`#F8FAFC`) to minimize glare outdoors.
  - Surface: Pure white (`#FFFFFF`) for elevated cards and triage panels.
  - Borders: Slate neutral outline (`#E2E8F0`).
  - Text Primary: `#0F172A` providing WCAG AAA compliance against white surfaces.
  - Text Muted: `#64748B` for metadata, geotags, and timestamps.

## Typography

Typography balances the warm, modern character of Plus Jakarta Sans in headlines with the structural legibility of Manrope for dense municipal data, street addresses, and issue descriptions.

- All numerical values across upvotes, triage metrics, report counts, and geographic coordinates must use tabular figures (`font-variant-numeric: tabular-nums`) to prevent optical jitter during live filter updates.
- Status badges and taxonomy markers use `label-sm` with slight tracking and all-caps styling for immediate recognition across dense map feeds.

## Layout & Spacing

The layout operates on a standard 8pt spatial grid with responsive column architecture tailored to mobile reporting and high-density desk triage:

- **Mobile (< 768px):** 4-column layout, `1rem` margins, full-bleed interactive map bottom sheets, single-column issue cards.
- **Tablet (768px - 1024px):** 8-column layout, `1.5rem` margins and gutters, split-pane view (50% map / 50% list feed).
- **Desktop (> 1024px):** 12-column layout, maximum container width of `1280px`, anchored left-hand navigation, interactive central triage workspace, and collapsible geographic detail pane.

Component gaps within cards and forms rely on `space-sm` (`0.5rem`) for tightly bound data pairs and `space-md` (`1rem`) for distinct block boundaries.

## Elevation & Depth

Visual hierarchy uses crisp boundaries paired with subtle ambient diffusion, preventing visual clutter while differentiating actionable cards from passive map surfaces.

- **Level 0 (Canvas):** `#F8FAFC` flat base canvas.
- **Level 1 (Cards & Rows):** `#FFFFFF` with a `1px` continuous border in `#E2E8F0` and an ambient drop shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hovered Cards, Dropdowns & Upvote Badges):** `#FFFFFF` with a `1px` border in `#CBD5E1` and elevated shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)`.
- **Level 3 (Modals, Overlays & Map Detail Sheets):** `#FFFFFF` surface accompanied by `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`.
- **Tonal Layering:** Active filters and system feedback bars use surface-tinted variants (e.g., `#1E40AF` at 6% opacity) with matching solid borders.

## Shapes

The design system uses a roundedness level of `2` (`0.5rem` / `8px` baseline radius) to convey modern approachability without compromising tabular and data-dense efficiency.

- **Input Controls, Dropdowns & Standard Buttons:** `0.5rem` (8px).
- **Cards, Image Proof Containers & Bottom Sheets:** `1rem` (16px) for larger containment context.
- **Pills, Upvote Counters & Status Chips:** Full pill radius (`9999px`) to maintain immediate affordance as standalone interactive items.

## Components

### Buttons
- **Primary:** Solid `#1E40AF` background, `#FFFFFF` text, `0.5rem` border radius, bold typography. Focus ring: `3px solid rgba(30, 64, 175, 0.3)`. Minimum tap target of `44px` height.
- **Secondary:** Surface `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`. Active state applies `#F1F5F9`.
- **Destructive / Flagging:** `#FEF2F2` background, `#EF4444` border and text.

### Status Badges & Chips
- Fully rounded pills containing a `6px` solid status circle indicator.
- **Open:** Background `#FEF2F2`, border `#FCA5A5`, text `#B91C1C`.
- **In Progress:** Background `#FFFBEB`, border `#FCD34D`, text `#B45309`.
- **Resolved:** Background `#ECFDF5`, border `#6EE7B7`, text `#047857`.

### Upvote Pill Counter
- Pill-shaped trigger with a split visual structure: chevron icon on the left, tabular vote count on the right.
- Inactive state: `#F1F5F9` background, `#475569` text.
- Active (upvoted): `#EFF6FF` background, `#1E40AF` border, `#1E40AF` text with scale tap feedback.

### Input Fields & Search
- Border `1px solid #CBD5E1`, surface `#FFFFFF`, text `#0F172A`, placeholder `#94A3B8`.
- Focus state: Border shifts to `#1E40AF` with a `3px` light blue glow.
- Location search includes an integrated trailing geolocate button.

### Issue Cards
- Structured layout: Header containing category chip and relative timestamp, body text summarizing the citizen report, footer housing upvote pill, comment count, and status badge.
- Sub-grid containment ensuring fixed heights for consistent triage scrolling.

### Status Timeline Tracker
- Vertical stepped progress tracker connecting initial report, triage review, crew assignment, and completion.
- Node indicators: `24px` circles with checkmarks for past steps, pulsating outer border for active step, neutral outline for pending steps.

### Photo Proof Comparison Container
- Side-by-side or slider component framing "Before" (citizen submission) and "After" (municipal resolution) images.
- Overlaid high-contrast labels in top-left corners with metadata stamps (date, time, GPS accuracy).

### Admin Triage Data Table
- High-density layout using alternate row striping (`#F8FAFC` on hover), sticky column headers, and inline category reassignment dropdowns.
import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { IssueCategory } from '../../models/issue';
import { submitIssue } from '../../services/issueService';
import styles from './ReportIssuePage.module.css';

const CATEGORIES: { value: IssueCategory; label: string; sub: string; icon: string }[] = [
  { value: 'pothole',     label: 'Pothole',       sub: 'Road damage',    icon: 'warning'       },
  { value: 'garbage',     label: 'Open Garbage',  sub: 'Waste / Dump',   icon: 'delete_sweep'  },
  { value: 'streetlight', label: 'Broken Light',  sub: 'Street dark',    icon: 'lightbulb'     },
  { value: 'drainage',    label: 'Drainage',      sub: 'Waterlogging',   icon: 'water_damage'  },
  { value: 'tree_fall',   label: 'Tree Fall',     sub: 'Fallen branch',  icon: 'park'          },
  { value: 'other',       label: 'Other Issue',   sub: 'Civic asset',    icon: 'more_horiz'    },
];

const QUICK_TAGS = [
  '⚠️ Heavy Traffic Risk',
  '🏫 Near School Zone',
  '⚡ Exposed Wire',
  '🌙 Completely Dark',
];

const MOCK_LOCATION = {
  address: '14th Cross, 100ft Road, Indiranagar',
  ward: 'Ward 112 · Operations Zone East',
  coords: '12.9716° N, 77.5946° E',
  accuracy: '±4 meters',
};

export function ReportIssuePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | null>('pothole');
  const [notes, setNotes] = useState('');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [showMap, setShowMap] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
        setNotes((n) => n.replace(` • ${tag}`, '').replace(tag, '').trim());
      } else {
        next.add(tag);
        setNotes((n) => (n ? `${n} • ${tag}` : tag));
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      const result = await submitIssue({
        category: selectedCategory,
        notes,
        hazardTags: Array.from(activeTags),
        locationAddress: MOCK_LOCATION.address,
      });
      navigate(`/issues/${result.id}?submitted=1`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Top nav */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link to="/" className={styles.backLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            Back to Feed
          </Link>
          <div className={styles.fastIntake}>
              <span className={styles.fastDot} />
              <span>Bob Collector Intake</span>
          </div>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Header banner */}
        <div className={styles.banner}>
          <div className={styles.bannerIcon}>
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div>
            <div className={styles.bannerTitle}>
              <h1>Zero-Friction Intake</h1>
              <span className={styles.timeBadge}>Takes ~30s</span>
            </div>
            <p className={styles.bannerSub}>No citizen login required. Instant automated dispatch.</p>
          </div>
        </div>

        {/* 1. Photo */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <label className={styles.sectionLabel}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>add_a_photo</span>
              1. Capture Photo Evidence
            </label>
            <span className={styles.required}>Required</span>
          </div>

          <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            {photoPreview ? (
              <div className={styles.photoPreview}>
                <img src={photoPreview} alt="Preview" />
                <div className={styles.exifPill}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>satellite_alt</span>
                  EXIF Geotag: {MOCK_LOCATION.coords}
                </div>
                <button
                  type="button"
                  className={styles.retakeBtn}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>refresh</span>
                  Retake
                </button>
                <div className={styles.photoMeta}>
                  <span>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-secondary-fixed)' }}>verified</span>
                    Timestamp: Today, 14:22:09
                  </span>
                  <span className={styles.fileSize}>3.8 MB · High Res</span>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.cameraIcon}>
                  <span className="material-symbols-outlined">photo_camera</span>
                </div>
                <p className={styles.emptyTitle}>Tap to Open Camera or Upload Photo</p>
                <p className={styles.emptySub}>Live geo-coordinates will be stamped automatically</p>
              </div>
            )}
          </div>

          <div className={styles.photoFooter}>
            <span className={styles.privacyNote}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-secondary)' }}>security</span>
              Auto-scrubs license plates &amp; bystander faces
            </span>
            <span className={styles.photoCount}>1 / 3 Photos</span>
          </div>
        </section>

        {/* 2. Location */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <label className={styles.sectionLabel}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>near_me</span>
              2. Incident Location
            </label>
            <span className={styles.gpsLocked}>GPS Locked</span>
          </div>

          <div className={styles.locationCard}>
            <div className={styles.locationIcon}>
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div className={styles.locationDetails}>
              <p className={styles.locationAddress}>{MOCK_LOCATION.address}</p>
              <p className={styles.locationWard}>{MOCK_LOCATION.ward}</p>
              <span className={styles.accuracyPill}>
                <span className={styles.accuracyDot} />
                Accuracy: {MOCK_LOCATION.accuracy}
              </span>
            </div>
            <button
              type="button"
              className={styles.adjustBtn}
              onClick={() => setShowMap((s) => !s)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>tune</span>
              {showMap ? 'Hide Map' : 'Adjust Pin'}
            </button>
          </div>

          {showMap && (
            <div className={styles.mapCard}>
              <div className={styles.mapPlaceholder} />
              <div className={styles.crosshair}>
                <div className={styles.crosshairRing} />
                <div className={styles.crosshairDot}>
                  <div className={styles.crosshairCore} />
                </div>
                <span className={styles.crosshairLabel}>Drag map to re-center</span>
              </div>
              <button type="button" className={styles.locateBtn}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>my_location</span>
              </button>
            </div>
          )}
        </section>

        {/* 3. Category */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <label className={styles.sectionLabel}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>category</span>
              3. Issue Category
            </label>
            <span className={styles.tapHint}>Tap to select</span>
          </div>

          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  className={`${styles.categoryCard} ${active ? styles.categoryCardActive : ''}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  <div className={`${styles.catIcon} ${active ? styles.catIconActive : ''}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{cat.icon}</span>
                  </div>
                  <div className={styles.catText}>
                    <p className={`${styles.catLabel} ${active ? styles.catLabelActive : ''}`}>{cat.label}</p>
                    <p className={styles.catSub}>{cat.sub}</p>
                  </div>
                  {active && (
                    <div className={styles.checkBadge}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Notes */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <label className={styles.sectionLabel} htmlFor="report-notes">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>edit_note</span>
              4. Landmark or Note
            </label>
            <span className={styles.optional}>Optional</span>
          </div>

          <div className={styles.textareaWrap}>
            <textarea
              id="report-notes"
              className={styles.textarea}
              rows={3}
              placeholder="e.g., Deep trench opposite the bakery near Metro Pillar 42. Difficult to see after dark."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button type="button" className={styles.micBtn} title="Voice dictation">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mic</span>
            </button>
          </div>

          <div className={styles.tagsSection}>
            <p className={styles.tagsLabel}>Quick hazard tags:</p>
            <div className={styles.tags}>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`${styles.tag} ${activeTags.has(tag) ? styles.tagActive : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy notice */}
        <div className={styles.privacyCard}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--color-secondary)', flexShrink: 0 }}>verified_user</span>
          <div>
            <p className={styles.privacyTitle}>Anonymous Resident Protection</p>
            <p className={styles.privacyText}>
              Your report generates an encrypted ephemeral UUID on this device (
              <code className={styles.code}>uuid-e7f1b</code>
              ). No personal data, email, or telephone is required or exposed to the public registry.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className={styles.submitArea}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || !selectedCategory}
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>hourglass_empty</span>
                Submitting…
              </>
            ) : (
              <>
                Submit Report
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>rocket_launch</span>
              </>
            )}
          </button>
          <p className={styles.routeNote}>
            <span className={styles.routeDot} />
            Instantly routes to the Field Supervisor Desk
          </p>
        </div>

        {/* Footer links */}
        <div className={styles.microLinks}>
          <a href="#">Emergency Protocol</a>
          <span>·</span>
          <a href="#">Ward 112 SLA: 48h</a>
          <span>·</span>
          <a href="#">Citizen Rights Charter</a>
        </div>
      </form>
    </div>
  );
}

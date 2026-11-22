import { NavLink } from 'react-router-dom';
import styles from './AppShell.module.css';

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.brand}>
            <span className="material-symbols-outlined">location_city</span>
            <span>Bob Collector</span>
          </NavLink>

          <nav className={styles.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <span className="material-symbols-outlined">map</span>
              Feed
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <span className="material-symbols-outlined">add_circle</span>
              Report
            </NavLink>
            <NavLink
              to="/triage"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Triage
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>Bob Collector</span>
            <span className={styles.footerBadge}>Verified Collection Network</span>
          </div>
          <p className={styles.footerText}>
            Official collection reporting platform. Rapid intake, transparent dispatch tracking, and publicly auditable resolutions.
          </p>
          <div className={styles.footerLinks}>
            <NavLink to="/">Public Feed</NavLink>
            <NavLink to="/report">Report Issue</NavLink>
            <NavLink to="/triage">Operator Console</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

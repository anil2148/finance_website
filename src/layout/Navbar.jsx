import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/copilot', label: 'AI Copilot' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <NavLink to="/" style={styles.brand} onClick={() => setOpen(false)}>
          FinanceSphere
        </NavLink>

        <button
          type="button"
          style={styles.menuButton}
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>

        <nav style={{ ...styles.nav, ...(open ? styles.navOpen : {}) }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#fff',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  brand: {
    fontWeight: 700,
    color: '#0f172a',
    textDecoration: 'none',
  },
  menuButton: {
    border: '1px solid #cbd5e1',
    background: '#fff',
    borderRadius: '8px',
    padding: '0.35rem 0.55rem',
    cursor: 'pointer',
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
  },
  navOpen: {
    display: 'flex',
  },
  navLink: {
    color: '#334155',
    textDecoration: 'none',
    borderRadius: '8px',
    padding: '0.45rem 0.7rem',
    fontWeight: 500,
  },
  navLinkActive: {
    color: '#0f172a',
    backgroundColor: '#e2e8f0',
  },
};

import { NavLink, Link } from 'react-router-dom'

const LINKS = [
  { to: '/about-us', label: 'About Us' },
  { to: '/faq', label: 'FAQ' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="JSON Online Viewer home">
          <span className="brand-icon">{ }</span>
          <span className="navbar-brand-text">JSON Online Viewer</span>
        </Link>

        <nav className="navbar-links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

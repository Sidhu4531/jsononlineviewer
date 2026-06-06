import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const LINKS = [
  { to: '/faq', label: 'FAQ' },
  { to: '/about-us', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export default function SiteHeader() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button
          className={'site-header-toggle' + (menuOpen ? ' open' : '')}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

        <nav className={'site-header-nav' + (menuOpen ? ' open' : '')} aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => 'site-header-link' + (isActive ? ' active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

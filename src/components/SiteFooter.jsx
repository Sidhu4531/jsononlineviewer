import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/faq', label: 'FAQ' },
  { to: '/about-us', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer site-footer-simple">
      <div className="site-footer-simple-inner">
        <nav className="site-footer-links" aria-label="Footer">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="site-footer-link">
              {l.label}
            </Link>
          ))}
        </nav>
        <span>© {year} JSON Viewer. Free, in-browser JSON tools.</span>
        <span className="site-footer-meta">Built with React</span>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'

const COLS = [
  {
    title: 'Tool',
    links: [
      { to: '/', label: 'JSON Viewer' },
      { to: '/#about', label: 'About the Tool' },
      { to: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about-us', label: 'About Us' },
      { to: '/contact', label: 'Contact Us' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand">
            <span className="brand-icon">{ }</span>
            <span>JSON Online Viewer</span>
          </div>
          <p className="footer-tagline">
            Free, fast, and private JSON formatter, validator and tree explorer — runs
            entirely in your browser.
          </p>
        </div>

        <div className="footer-cols">
          {COLS.map((col) => (
            <div className="footer-col" key={col.title}>
              <h4 className="footer-col-title">{col.title}</h4>
              <ul className="footer-links">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {year} JSON Online Viewer. All rights reserved.</span>
          <span className="footer-meta">Built with React · Hosted on Cloudflare Pages</span>
        </div>
      </div>
    </footer>
  )
}

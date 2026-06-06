import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {year} JSON Online Viewer. All rights reserved.</span>
          <span className="footer-meta">Built with React · Hosted on Cloudflare Pages</span>
        </div>
      </div>
    </footer>
  )
}

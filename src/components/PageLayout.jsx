import { Link } from 'react-router-dom'

export default function PageLayout({ title, subtitle, children, showBack = true }) {
  return (
    <div className="page">
      <div className="page-inner">
        {showBack && (
          <Link to="/" className="page-back" aria-label="Back to JSON Viewer">← Back to JSON Viewer</Link>
        )}
        <header className="page-header">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </header>
        <div className="page-body">{children}</div>
      </div>
    </div>
  )
}

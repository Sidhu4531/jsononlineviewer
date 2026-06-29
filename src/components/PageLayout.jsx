import { Link } from 'react-router-dom'
import { useTheme } from '../lib/ThemeContext.jsx'

export default function PageLayout({ title, subtitle, children, showBack = true }) {
  const { theme, toggle } = useTheme()
  return (
    <div className="page">
      <div className="page-inner">
        {showBack && (
          <Link to="/" className="page-back" aria-label="Back to JSON Viewer">← Back to JSON Viewer</Link>
        )}
        <header className="page-header">
          <div className="theme-toggle-wrap">
            <h1 className="page-title">{title}</h1>
            <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? '\u2600' : '\u263E'}
            </button>
          </div>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </header>
        <div className="page-body">{children}</div>
      </div>
    </div>
  )
}

export default function PageLayout({ title, subtitle, children }) {
  return (
    <div className="page">
      <div className="page-inner">
        <header className="page-header">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </header>
        <div className="page-body">{children}</div>
      </div>
    </div>
  )
}

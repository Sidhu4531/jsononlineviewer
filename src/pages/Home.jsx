import { useState } from 'react'
import ViewerTab from '../components/ViewerTab.jsx'
import AboutJsonTab from '../components/AboutJsonTab.jsx'
import Seo from '../components/Seo.jsx'

const TABS = [
  { id: 'viewer', label: 'JSON Viewer' },
  { id: 'about-json', label: 'About JSON' },
]

export default function Home() {
  const [active, setActive] = useState('viewer')

  return (
    <div className="app">
      <Seo
        title={null}
        description="Free online JSON viewer. Format, validate, minify and explore JSON in a tree view. Color-coded syntax, search, and click-to-inspect — all in your browser, nothing uploaded."
        keywords="json viewer, json formatter, json validator, json beautifier, json tree, online json viewer, json minifier"
        canonical="https://jsononlineviewer.com/"
      />

      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">Online JSON Viewer</h1>
          <p className="app-subtitle">
            Format, validate and explore JSON data in your browser. Nothing is sent to a server.
          </p>
        </div>
      </header>

      <nav className="app-tabs" role="tablist" aria-label="Sections">
        <div className="app-tabs-inner">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              className={'app-tab' + (active === t.id ? ' active' : '')}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="app-main">
        <div className="app-main-inner">
          {active === 'viewer' && <ViewerTab />}
          {active === 'about-json' && <AboutJsonTab />}
        </div>
      </main>
    </div>
  )
}

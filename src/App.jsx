import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Toolbar from './components/Toolbar.jsx'
import TreeView from './components/TreeView.jsx'
import Editor from './components/Editor.jsx'
import StatusBar from './components/StatusBar.jsx'
import { parseJSON, formatJSON, minifyJSON, byteSize, formatBytes, pathToString, countNodes, depthOf, searchInJSON } from './lib/utils.js'
import { SAMPLE_JSON, SAMPLE_LIST } from './lib/samples.js'

const STORAGE_KEY = 'json-viewer:input'
const THEME_KEY = 'json-viewer:theme'

export default function App() {
  const [input, setInput] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || JSON.stringify(SAMPLE_JSON.basic.data, null, 2)
  })
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [indent, setIndent] = useState(2)
  const [view, setView] = useState('tree')
  const [selectedPath, setSelectedPath] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, input)
  }, [input])

  const parsed = useMemo(() => parseJSON(input), [input])

  useEffect(() => {
    setError(parsed.error || null)
  }, [parsed])

  const selectedValue = useMemo(() => {
    if (!parsed.ok || selectedPath.length === 0) return undefined
    let v = parsed.data
    for (const p of selectedPath) {
      if (v == null) return undefined
      v = v[p]
    }
    return v
  }, [parsed, selectedPath])

  const onFormat = useCallback(() => {
    if (!parsed.ok) return
    setInput(formatJSON(parsed.data, indent))
  }, [parsed, indent])

  const onMinify = useCallback(() => {
    if (!parsed.ok) return
    setInput(minifyJSON(parsed.data))
  }, [parsed])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }, [input])

  const onClear = useCallback(() => {
    if (confirm('Clear all input?')) setInput('')
  }, [])

  const onSample = useCallback((key) => {
    const s = SAMPLE_JSON[key]
    if (s) setInput(JSON.stringify(s.data, null, indent))
  }, [indent])

  const onFile = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setInput(String(reader.result || ''))
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  const onEditorChange = useCallback((next) => {
    setInput(next)
  }, [])

  const onNodeClick = useCallback((parts, value) => {
    setSelectedPath(parts)
  }, [])

  const size = byteSize(input)
  const nodeCount = parsed.ok ? countNodes(parsed.data) : 0
  const depth = parsed.ok ? depthOf(parsed.data) : 0
  const matches = useMemo(() => (parsed.ok ? searchInJSON(parsed.data, search) : new Set()), [parsed, search])

  return (
    <div className="app">
      <Toolbar
        view={view}
        onView={setView}
        onFormat={onFormat}
        onMinify={onMinify}
        onCopy={onCopy}
        onClear={onClear}
        onSample={onSample}
        onFile={() => fileInputRef.current?.click()}
        onTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        theme={theme}
        copied={copied}
        samples={SAMPLE_LIST}
        indent={indent}
        onIndent={setIndent}
        search={search}
        onSearch={setSearch}
        typeFilter={typeFilter}
        onTypeFilter={setTypeFilter}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json,.txt"
        style={{ display: 'none' }}
        onChange={onFile}
      />

      <main className="main">
        {view === 'tree' && (
          <div className="panes">
            <div className="pane pane-tree">
              {parsed.empty ? (
                <EmptyState onSample={onSample} samples={SAMPLE_LIST} />
              ) : !parsed.ok ? (
                <div className="error-card">
                  <div className="error-title">⚠ Invalid JSON</div>
                  <div className="error-message">{parsed.error.message}</div>
                  <div className="error-location">
                    Line {parsed.error.line}, column {parsed.error.col}
                  </div>
                </div>
              ) : (
                <TreeView
                  data={parsed.data}
                  selectedPath={selectedPath}
                  onSelect={onNodeClick}
                  search={search}
                  matches={matches}
                  typeFilter={typeFilter}
                />
              )}
            </div>
            <div className="pane pane-detail">
              <div className="detail-card">
                <div className="detail-head">
                  <div className="detail-label">Path</div>
                  <button
                    className="link-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(pathToString(selectedPath))
                    }}
                  >Copy</button>
                </div>
                <div className="detail-path">{pathToString(selectedPath)}</div>
              </div>
              {selectedValue !== undefined && (
                <div className="detail-card">
                  <div className="detail-head">
                    <div className="detail-label">Type</div>
                  </div>
                  <div className={`detail-type type-${kindOf(selectedValue)}`}>{kindOf(selectedValue)}</div>
                </div>
              )}
              {selectedValue !== undefined && (
                <div className="detail-card">
                  <div className="detail-head">
                    <div className="detail-label">Value</div>
                    <button
                      className="link-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(stringifyValue(selectedValue))
                      }}
                    >Copy</button>
                  </div>
                  <pre className="detail-value">{stringifyValue(selectedValue)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
        {view === 'editor' && (
          <Editor value={input} onChange={onEditorChange} error={parsed.error} />
        )}
        {view === 'split' && (
          <div className="panes">
            <div className="pane pane-editor">
              <Editor value={input} onChange={onEditorChange} error={parsed.error} />
            </div>
            <div className="pane pane-tree">
              {parsed.ok ? (
                <TreeView
                  data={parsed.data}
                  selectedPath={selectedPath}
                  onSelect={onNodeClick}
                  search={search}
                  matches={matches}
                  typeFilter={typeFilter}
                />
              ) : (
                <div className="error-card">
                  <div className="error-title">⚠ Invalid JSON</div>
                  <div className="error-message">{parsed.error?.message || ''}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <StatusBar
        valid={parsed.ok}
        empty={parsed.empty}
        size={size}
        sizeText={formatBytes(size)}
        nodes={nodeCount}
        depth={depth}
        lines={input ? input.split('\n').length : 0}
        selectedPath={selectedPath}
        error={error}
      />
    </div>
  )
}

function kindOf(v) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  if (typeof v === 'object') return 'object'
  return typeof v
}

function stringifyValue(v) {
  if (typeof v === 'string') return JSON.stringify(v)
  return JSON.stringify(v, null, 2)
}

function EmptyState({ onSample, samples }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{ }</div>
      <h2>Start by pasting JSON</h2>
      <p>Or load a sample to explore the tool.</p>
      <div className="empty-samples">
        {samples.map((s) => (
          <button key={s.key} className="sample-chip" onClick={() => onSample(s.key)}>
            {s.name}
          </button>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { parseJSON, formatJSON, minifyJSON, byteSize, formatBytes, pathToString, countNodes, depthOf, searchInJSON } from '../lib/utils.js'
import { SAMPLE_JSON, SAMPLE_LIST } from '../lib/samples.js'
import Editor from './Editor.jsx'
import JsonText from './JsonText.jsx'
import JsonTree from './JsonTree.jsx'

const STORAGE_KEY = 'json-viewer:input'

export default function ViewerTab() {
  const [input, setInput] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || JSON.stringify(SAMPLE_JSON.basic.data, null, 4)
  })
  const [indent, setIndent] = useState(4)
  const [view, setView] = useState('text') // 'text' | 'tree'
  const [selectedPath, setSelectedPath] = useState([])
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, input)
  }, [input])

  const parsed = useMemo(() => parseJSON(input), [input])
  const size = byteSize(input)
  const nodeCount = parsed.ok ? countNodes(parsed.data) : 0
  const depth = parsed.ok ? depthOf(parsed.data) : 0
  const matches = useMemo(() => (parsed.ok ? searchInJSON(parsed.data, search) : new Set()), [parsed, search])

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
    if (window.confirm('Clear all input?')) setInput('')
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

  const onEditorChange = useCallback((next) => setInput(next), [])

  const onExpandAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent('json-viewer:expand-all'))
  }, [])
  const onCollapseAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent('json-viewer:collapse-all'))
  }, [])

  return (
    <div className="viewer">
      <div className="viewer-toolbar">
        <div className="viewer-toolbar-row">
          <div className="viewer-tabs" role="tablist" aria-label="Output mode">
            <button
              role="tab"
              className={'viewer-tab' + (view === 'text' ? ' active' : '')}
              onClick={() => setView('text')}
              aria-selected={view === 'text'}
            >JSON Format</button>
            <button
              role="tab"
              className={'viewer-tab' + (view === 'tree' ? ' active' : '')}
              onClick={() => setView('tree')}
              aria-selected={view === 'tree'}
            >Tree</button>
          </div>

          <div className="viewer-actions">
            <button className="btn primary" onClick={onFormat} disabled={!parsed.ok} title="Format / pretty-print">Format</button>
            <button className="btn" onClick={onMinify} disabled={!parsed.ok} title="Minify / compress">Minify</button>
            <button className="btn" onClick={onCopy} title="Copy input">{copied ? 'Copied!' : 'Copy'}</button>
            <button className="btn" onClick={() => fileInputRef.current?.click()} title="Open .json file">Open file</button>
            <select
              className="btn"
              onChange={(e) => { if (e.target.value) onSample(e.target.value) }}
              defaultValue=""
              title="Load sample data"
              aria-label="Load sample data"
            >
              <option value="" disabled>Load sample…</option>
              {SAMPLE_LIST.map((s) => (
                <option key={s.key} value={s.key}>{s.name}</option>
              ))}
            </select>
            <label className="btn btn-label" title="Indent size">
              Indent:
              <select
                className="inline-select"
                value={indent}
                onChange={(e) => setIndent(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="tab">Tab</option>
              </select>
            </label>
            <button className="btn danger" onClick={onClear} title="Clear input">Clear</button>
          </div>
        </div>

        <div className="viewer-toolbar-row">
          <div className="search-wrap">
            <input
              type="search"
              className="search-input"
              placeholder="Search keys or values…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">×</button>
            )}
          </div>
          {view === 'tree' && (
            <div className="viewer-tree-actions">
              <button className="btn small" onClick={onExpandAll}>Expand all</button>
              <button className="btn small" onClick={onCollapseAll}>Collapse all</button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json,.txt"
        style={{ display: 'none' }}
        onChange={onFile}
      />

      <div className="viewer-split">
        <section className="editor-section" aria-label="JSON input">
          <div className="section-head">
            <h2 className="section-title">Input</h2>
            <div className="section-meta">
              {input ? `${input.split('\n').length} lines` : 'Empty'}
            </div>
          </div>
          <Editor value={input} onChange={onEditorChange} error={parsed.ok ? null : parsed.error} />
        </section>

        <section className="output-section" aria-label="JSON output">
          <div className="section-head">
            <h2 className="section-title">Output</h2>
            <div className="section-meta">
              {parsed.ok ? `${nodeCount} node${nodeCount === 1 ? '' : 's'} · depth ${depth}` : '—'}
            </div>
          </div>

          {parsed.empty ? (
            <div className="empty-state">
              <div className="empty-icon">{'{ }'}</div>
              <p>Paste JSON in the input on the left, or load a sample to get started.</p>
            </div>
          ) : !parsed.ok ? (
            <div className="error-card">
              <div className="error-title">⚠ Invalid JSON</div>
              <div className="error-message">{parsed.error.message}</div>
              <div className="error-location">
                Line {parsed.error.line}, column {parsed.error.col}
              </div>
            </div>
          ) : view === 'text' ? (
            <div className="output-pane">
              <JsonText
                data={parsed.data}
                indent={indent}
                search={search}
                onSelect={setSelectedPath}
                selectedPath={selectedPath}
              />
            </div>
          ) : (
            <div className="output-pane">
              <JsonTree
                data={parsed.data}
                selectedPath={selectedPath}
                onSelect={setSelectedPath}
                search={search}
                matches={matches}
              />
            </div>
          )}
        </section>
      </div>

      {parsed.ok && selectedPath.length > 0 && (
        <DetailPanel
          parsed={parsed}
          selectedPath={selectedPath}
          selectedValue={selectedValue}
          onClose={() => setSelectedPath([])}
        />
      )}

      <footer className="statusbar">
        <div className={'status-validity ' + (parsed.empty ? 'muted' : parsed.ok ? 'ok' : 'err')}>
          {parsed.empty ? '○ Empty' : parsed.ok ? '● Valid JSON' : '✕ Invalid JSON'}
        </div>
        {parsed.error && !parsed.empty && (
          <div className="status-error" title={parsed.error.message}>
            Line {parsed.error.line}, col {parsed.error.col}
          </div>
        )}
        <div className="status-spacer" />
        <div className="status-stat">{formatBytes(size)}</div>
        <div className="status-stat">{nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}</div>
        <div className="status-stat">depth {depth}</div>
        {selectedPath.length > 0 && (
          <div className="status-path" title={pathToString(selectedPath)}>
            {pathToString(selectedPath)}
          </div>
        )}
      </footer>
    </div>
  )
}

function DetailPanel({ parsed, selectedPath, selectedValue, onClose }) {
  if (!parsed.ok) return null
  const path = pathToString(selectedPath)
  return (
    <>
      <div className="detail-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="detail-panel" role="dialog" aria-label="Selection details">
        <div className="detail-panel-head">
          <div className="detail-panel-title">Selection</div>
          <button
            className="detail-close"
            onClick={onClose}
            aria-label="Close detail panel"
            title="Close"
          >×</button>
        </div>

        <div className="detail-panel-body">
          <div className="detail-card">
            <div className="detail-head">
              <div className="detail-label">Path</div>
              <button
                className="link-btn"
                onClick={() => navigator.clipboard.writeText(path)}
              >Copy</button>
            </div>
            <div className="detail-path">{path}</div>
          </div>

          {selectedValue !== undefined && (
            <>
              <div className="detail-card">
                <div className="detail-head">
                  <div className="detail-label">Type</div>
                </div>
                <div className={'detail-type type-' + kindOf(selectedValue)}>{kindOf(selectedValue)}</div>
              </div>

              <div className="detail-card">
                <div className="detail-head">
                  <div className="detail-label">Value</div>
                  <button
                    className="link-btn"
                    onClick={() => navigator.clipboard.writeText(stringifyValue(selectedValue))}
                  >Copy</button>
                </div>
                <pre className="detail-value">{stringifyValue(selectedValue)}</pre>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
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

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { parseJSON, formatJSON, minifyJSON, byteSize, formatBytes, pathToString, countNodes, depthOf, computeStats, searchInJSON, generateArrayChunked } from '../lib/utils.js'
import { Generate as generatePayments } from '../lib/generate-payments.js'
import { SAMPLE_JSON, SAMPLE_LIST } from '../lib/samples.js'
import Editor from './Editor.jsx'
import JsonText from './JsonText.jsx'
import JsonTree from './JsonTree.jsx'

const STORAGE_KEY = 'json-viewer:input'
const LARGE_BYTES = 100 * 1024

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && saved.length > LARGE_BYTES) localStorage.removeItem(STORAGE_KEY)
} catch (_) {}

function loadSavedInput() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved.length <= LARGE_BYTES) return saved
  } catch (_) {}
  return JSON.stringify(SAMPLE_JSON.basic.data, null, 4)
}

export default function ViewerTab() {
  const [input, setInput] = useState(loadSavedInput)
  const [indent, setIndent] = useState(4)
  const [view, setView] = useState('text')
  const [selectedPath, setSelectedPath] = useState([])
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const workerRef = useRef(null)
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState(() => parseJSON(loadSavedInput()))
  const [workerStats, setWorkerStats] = useState(null)
  const [wasLarge, setWasLarge] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatingProgress, setGeneratingProgress] = useState(0)
  const [loadingUrl, setLoadingUrl] = useState(false)
  const fileTextRef = useRef('')

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/parseWorker.js', import.meta.url))
    workerRef.current.onmessage = (e) => {
      const { success, data, error, stats } = e.data
      if (success) {
        setParsed({ ok: true, data, error: null, empty: false })
        setWorkerStats(stats)
        setWasLarge(true)
        setView('tree')
      } else {
        setParsed({ ok: false, data: null, error, empty: false })
        setWorkerStats(null)
      }
      setParsing(false)
    }
    return () => workerRef.current?.terminate()
  }, [])

  const lastInputRef = useRef(input)
  useEffect(() => {
    if (input !== lastInputRef.current) {
      lastInputRef.current = input
      if (!input || input.length <= LARGE_BYTES) {
        if (typeof input === 'string' && input.startsWith('//')) return
        setParsed(parseJSON(input))
        setWorkerStats(null)
        setWasLarge(false)
      }
    }
  }, [input])

  useEffect(() => {
    if (input && input.length > LARGE_BYTES) return
    try { localStorage.setItem(STORAGE_KEY, input) } catch (_) {}
  }, [input])

  const size = useMemo(() => {
    if (wasLarge && fileTextRef.current) return fileTextRef.current.length
    return byteSize(input)
  }, [input, wasLarge])

  const inputLineCount = useMemo(() => {
    if (!input) return 0
    if (input.length > LARGE_BYTES) {
      let n = 1
      for (let i = 0; i < input.length; i++) { if (input[i] === '\n') n++ }
      return n
    }
    let n = 1
    for (let i = 0; i < input.length; i++) { if (input[i] === '\n') n++ }
    return n
  }, [input])

  const nodeCount = parsed.ok ? (workerStats?.nodeCount ?? countNodes(parsed.data)) : 0
  const depth = parsed.ok ? (workerStats?.depth ?? depthOf(parsed.data)) : 0
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
    const formatted = formatJSON(parsed.data, indent)
    setInput(formatted)
    setParsed({ ok: true, data: parsed.data, error: null, empty: false })
  }, [parsed, indent])

  const onMinify = useCallback(() => {
    if (!parsed.ok) return
    setInput(minifyJSON(parsed.data))
  }, [parsed])

  const onCopy = useCallback(async () => {
    try {
      const text = wasLarge && fileTextRef.current ? fileTextRef.current : input
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }, [input, wasLarge])

  const onDownload = useCallback(() => {
    const text = wasLarge && fileTextRef.current ? fileTextRef.current : input
    if (!text) return
    const blob = new Blob([text], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [input, wasLarge])

  const onClear = useCallback(() => {
    if (window.confirm('Clear all input?')) {
      setInput('')
      fileTextRef.current = ''
      setWasLarge(false)
    }
  }, [])

  const [showGenerateDialog, setShowGenerateDialog] = useState(false)

  const onGenerateArray = useCallback(() => {
    if (!parsed.ok || wasLarge || generating) return
    setShowGenerateDialog(true)
  }, [parsed, wasLarge, generating])

  const onGenerateConfirm = useCallback((count) => {
    setShowGenerateDialog(false)
    if (!Number.isFinite(count) || count < 1) return

    setGenerating(true)
    setGeneratingProgress(0)

    const PAYMENT_LOWER = ['createpayments', 'capturepayments', 'refundpayments', 'cancelpayment']
    const data = parsed.data
    const hasPaymentArray = data && typeof data === 'object' && !Array.isArray(data) && data.header &&
      Object.keys(data).some(k => PAYMENT_LOWER.includes(k.toLowerCase()) && Array.isArray(data[k]) && data[k].length > 0)
    if (hasPaymentArray) {
      setTimeout(() => {
        const result = generatePayments(JSON.stringify(data), count)
        if (result.error) {
          setGenerating(false)
          return
        }
        const text = JSON.stringify(result, null, indent)
        if (text.length > LARGE_BYTES) {
          fileTextRef.current = text
          setInput(`// Generated ${count} items (${formatBytes(text.length)})\n// Warning: Data too large to display in editor. Showing tree view.\n`)
          setParsed({ ok: true, data: result, error: null, empty: false })
          setWasLarge(true)
          setView('tree')
          requestAnimationFrame(() => setWorkerStats(computeStats(result)))
        } else {
          setInput(text)
        }
        setGenerating(false)
      }, 0)
      return
    }

    const CHUNK_SIZE = count > 10000 ? 2000 : 500

    generateArrayChunked(data, count, CHUNK_SIZE, (done, total) => {
      setGeneratingProgress(Math.round((done / total) * 100))
    }).then((arr) => {
      setTimeout(() => {
        const text = JSON.stringify(arr, null, indent)
        if (text.length > LARGE_BYTES) {
          fileTextRef.current = text
          setInput(`// Generated ${count} items (${formatBytes(text.length)})\n// Warning: Data too large to display in editor. Showing tree view.\n`)
          setParsed({ ok: true, data: arr, error: null, empty: false })
          setWasLarge(true)
          setView('tree')
          requestAnimationFrame(() => {
            setWorkerStats(computeStats(arr))
          })
        } else {
          setInput(text)
        }
        setGenerating(false)
      }, 0)
    })
  }, [parsed, indent, wasLarge, generating])

  const onSample = useCallback((key) => {
    const s = SAMPLE_JSON[key]
    if (s) {
      const text = JSON.stringify(s.data, null, indent)
      fileTextRef.current = ''
      setInput(text)
      setParsed(parseJSON(text))
      setWasLarge(false)
    }
  }, [indent])

  const onFile = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setInput(`// Loading: ${file.name} (${formatBytes(file.size)})\n`)
    setParsing(true)
    setWorkerStats(null)
    setWasLarge(false)
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      if (!text || text.length <= LARGE_BYTES) {
        setInput(text)
        setParsing(false)
        return
      }
      fileTextRef.current = text
      setInput(`// Loaded: ${file.name} (${formatBytes(text.length)})\n// Warning: Large file — showing tree view only.\n`)
      setTimeout(() => {
        const result = parseJSON(text)
        if (result.ok) {
          setInput(`// ${file.name} (${formatBytes(text.length)})\n// Warning: Large file — showing tree view only.\n`)
          setParsed(result)
          setWasLarge(true)
          setView('tree')
          setParsing(false)
          requestAnimationFrame(() => {
            const stats = computeStats(result.data)
            setWorkerStats(stats)
          })
        } else {
          setParsed(result)
          setParsing(false)
        }
      }, 100)
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  const onLoadUrl = useCallback(async () => {
    const url = window.prompt('Enter a URL to load JSON from:')
    if (!url || !url.trim()) return
    setLoadingUrl(true)
    try {
      const res = await fetch(url.trim())
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      const text = await res.text()
      if (!text || !text.trim()) throw new Error('Empty response')
      try { JSON.parse(text) } catch (_) { throw new Error('Response is not valid JSON') }
      fileTextRef.current = ''
      setWasLarge(false)
      setInput(text)
    } catch (e) {
      window.alert(`Failed to load JSON from URL:\n${e.message}`)
    } finally {
      setLoadingUrl(false)
    }
  }, [])

  const onEditorChange = useCallback((next) => {
    fileTextRef.current = ''
    setWasLarge(false)
    setInput(next)
  }, [])

  const onExpandAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent('json-viewer:expand-all'))
  }, [])
  const onCollapseAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent('json-viewer:collapse-all'))
  }, [])

  const isLarge = wasLarge
  const isParsing = parsing
  const isGenerating = generating

  return (
    <div className="viewer">
      <div className="viewer-toolbar">
        <div className="viewer-toolbar-row">
          <div className="viewer-tabs" role="tablist" aria-label="Output mode">
            <button
              role="tab"
              className={'viewer-tab' + (view === 'text' ? ' active' : '') + (isLarge && view === 'text' ? ' warn' : '')}
              onClick={() => setView('text')}
              aria-selected={view === 'text'}
              title={isLarge ? 'Large file — showing first 2000 lines only' : ''}
            >JSON Format</button>
            <button
              role="tab"
              className={'viewer-tab' + (view === 'tree' ? ' active' : '')}
              onClick={() => setView('tree')}
              aria-selected={view === 'tree'}
            >Tree</button>
          </div>

          <div className="viewer-actions">
            <button className="btn primary" onClick={onFormat} disabled={!parsed.ok || isParsing || isLarge} title="Format / pretty-print">Format</button>
            <button className="btn" onClick={onMinify} disabled={!parsed.ok || isParsing || isLarge} title="Minify / compress">Minify</button>
            <button className="btn" onClick={onCopy} title="Copy input">{copied ? 'Copied!' : 'Copy'}</button>
            <button className="btn" onClick={onDownload} disabled={!input} title="Download as .json file">Download</button>
            <button className="btn" onClick={() => fileInputRef.current?.click()} title="Open .json file">Open file</button>
            <button className="btn" onClick={onLoadUrl} disabled={loadingUrl} title={loadingUrl ? 'Loading…' : 'Load JSON from a URL'}>{loadingUrl ? 'Loading…' : 'From URL'}</button>
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
            <button className="btn" onClick={onGenerateArray} disabled={!parsed.ok || isParsing || isLarge || isGenerating} title={isGenerating ? `Generating ${generatingProgress}%…` : 'Generate array from template'}>{isGenerating ? `${generatingProgress}%` : 'Generate'}</button>
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
          {view === 'tree' && parsed.ok && (
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
              {isGenerating ? `${generatingProgress}%` : `${inputLineCount} lines`}
              {isParsing && ' · parsing…'}
            </div>
          </div>
          <Editor value={input} onChange={onEditorChange} error={parsed.ok ? null : parsed.error} />
        </section>

        <section className="output-section" aria-label="JSON output">
          <div className="section-head">
            <h2 className="section-title">Output</h2>
            <div className="section-meta">
              {isParsing ? (
                <span className="parsing-indicator">Parsing large file…</span>
              ) : isGenerating ? (
                <span className="parsing-indicator">Generating {generatingProgress}%…</span>
              ) : parsed.ok ? (
                `${nodeCount} node${nodeCount === 1 ? '' : 's'} · depth ${depth}`
              ) : '—'}
            </div>
          </div>

          {isParsing ? (
            <div className="parsing-overlay">
              <div className="spinner" />
              <div className="parsing-text">
                Parsing {formatBytes(size)} JSON…
              </div>
              <div className="parsing-sub">The editor is ready. View will appear here once parsed.</div>
            </div>
          ) : isGenerating ? (
            <div className="parsing-overlay">
              <div className="spinner" />
              <div className="parsing-text">
                Generating {generatingProgress}%…
              </div>
              <div className="parsing-sub">Building array from template. Please wait…</div>
            </div>
          ) : parsed.empty ? (
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

      {showGenerateDialog && (
        <GenerateDialog
          defaultValue={10}
          onConfirm={onGenerateConfirm}
          onCancel={() => setShowGenerateDialog(false)}
        />
      )}

      <footer className="statusbar">
        <div className={'status-validity ' + (isParsing ? 'muted' : isGenerating ? 'muted' : parsed.empty ? 'muted' : parsed.ok ? 'ok' : 'err')}>
          {isParsing ? '○ Parsing…' : isGenerating ? '○ Generating…' : parsed.empty ? '○ Empty' : parsed.ok ? '● Valid JSON' : '✕ Invalid JSON'}
        </div>
        {!isParsing && !isGenerating && parsed.error && !parsed.empty && (
          <div className="status-error" title={parsed.error.message}>
            Line {parsed.error.line}, col {parsed.error.col}
          </div>
        )}
        <div className="status-spacer" />
        {isParsing && <div className="status-stat">parsing {formatBytes(size)}…</div>}
        {isGenerating && <div className="status-stat">generating {generatingProgress}%…</div>}
        {!isParsing && !isGenerating && <div className="status-stat">{formatBytes(size)}</div>}
        {!isParsing && !isGenerating && <div className="status-stat">{nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}</div>}
        {!isParsing && !isGenerating && <div className="status-stat">depth {depth}</div>}
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

function GenerateDialog({ defaultValue, onConfirm, onCancel }) {
  const [value, setValue] = useState(String(defaultValue))
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const num = parseInt(value, 10)
      if (Number.isFinite(num) && num > 0) onConfirm(num)
    }
    if (e.key === 'Escape') onCancel()
  }

  return (
    <>
      <div className="dialog-backdrop" onClick={onCancel} />
      <div className="dialog" role="dialog" aria-label="Generate items">
        <div className="dialog-head">Generate items</div>
        <div className="dialog-body">
          <label className="dialog-label">Number of items to generate:</label>
          <input
            ref={inputRef}
            type="number"
            className="dialog-input"
            min="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="dialog-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button
            className="btn primary"
            onClick={() => {
              const num = parseInt(value, 10)
              if (Number.isFinite(num) && num > 0) onConfirm(num)
            }}
          >Generate</button>
        </div>
      </div>
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

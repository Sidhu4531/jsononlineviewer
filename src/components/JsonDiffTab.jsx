import { useState, useMemo, useCallback } from 'react'
import { diffJSON, DIFF_SAMPLES } from '../lib/json-diff.js'
import { pathToString } from '../lib/utils.js'
import Editor from './Editor.jsx'
import { useTheme } from '../lib/ThemeContext.jsx'

const FIRST = DIFF_SAMPLES[0]

function deepClone(v) {
  return JSON.parse(JSON.stringify(v))
}

function applyPatch(obj, changes) {
  const out = deepClone(obj)
  for (const c of changes) {
    let parent = out
    for (let i = 0; i < c.path.length - 1; i++) {
      const key = c.path[i]
      if (!(key in parent)) parent[key] = {}
      parent = parent[key]
    }
    const last = c.path[c.path.length - 1]
    if (c.type === 'removed') {
      if (Array.isArray(parent)) {
        parent.splice(last, 1)
      } else {
        delete parent[last]
      }
    } else {
      parent[last] = deepClone(c.newValue)
    }
  }
  return out
}

export default function JsonDiffTab() {
  const { theme, toggle } = useTheme()
  const [inputA, setInputA] = useState(JSON.stringify(FIRST.a, null, 4))
  const [inputB, setInputB] = useState(JSON.stringify(FIRST.b, null, 4))
  const [errorA, setErrorA] = useState(null)
  const [errorB, setErrorB] = useState(null)
  const [parsedA, setParsedA] = useState(() => deepClone(FIRST.a))
  const [parsedB, setParsedB] = useState(() => deepClone(FIRST.b))

  function updateA(text) {
    setInputA(text)
    try {
      setParsedA(JSON.parse(text))
      setErrorA(null)
    } catch (e) {
      setParsedA(null)
      setErrorA(e.message)
    }
  }

  function updateB(text) {
    setInputB(text)
    try {
      setParsedB(JSON.parse(text))
      setErrorB(null)
    } catch (e) {
      setParsedB(null)
      setErrorB(e.message)
    }
  }

  const changes = useMemo(() => {
    if (!parsedA || !parsedB) return null
    return diffJSON(parsedA, parsedB)
  }, [parsedA, parsedB])

  const added = changes?.filter(c => c.type === 'added') || []
  const removed = changes?.filter(c => c.type === 'removed') || []
  const changed = changes?.filter(c => c.type === 'changed') || []

  const onApply = useCallback(() => {
    if (!changes || !parsedA) return
    const patched = applyPatch(parsedA, changes)
    const text = JSON.stringify(patched, null, 4)
    setInputA(text)
    setParsedA(patched)
    setErrorA(null)
  }, [changes, parsedA])

  function loadSample(key) {
    const s = DIFF_SAMPLES.find(s => s.key === key)
    if (!s) return
    setInputA(JSON.stringify(s.a, null, 4))
    setInputB(JSON.stringify(s.b, null, 4))
    setParsedA(deepClone(s.a))
    setParsedB(deepClone(s.b))
    setErrorA(null)
    setErrorB(null)
  }

  function stringifyVal(v) {
    if (v === null) return 'null'
    if (typeof v === 'string') return JSON.stringify(v)
    if (typeof v === 'object') return JSON.stringify(v)
    return String(v)
  }

  return (
    <div className="viewer">
      <div className="viewer-toolbar">
        <div className="viewer-toolbar-row">
          <span className="btn-label">Samples:</span>
          {DIFF_SAMPLES.map(s => (
            <button
              key={s.key}
              className="btn small"
              onClick={() => loadSample(s.key)}
            >{s.name}</button>
          ))}
        </div>
        <div className="viewer-toolbar-row">
          <div className="diff-summary">
            {changes !== null && (
              <>
                <span className="diff-stat added">+{added.length}</span>
                <span className="diff-stat removed">-{removed.length}</span>
                <span className="diff-stat changed">~{changed.length}</span>
                <span className="diff-stat total">{changes.length} change{changes.length === 1 ? '' : 's'}</span>
                {changes.length > 0 && (
                  <button className="btn primary small" onClick={onApply} title="Apply all diff changes to JSON A">
                    Apply changes to A
                  </button>
                )}
              </>
            )}
            {!parsedA && <span className="diff-stat error">JSON A invalid</span>}
            {!parsedB && <span className="diff-stat error">JSON B invalid</span>}
          </div>
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} style={{ marginLeft: 'auto' }}>
            {theme === 'dark' ? '\u2600' : '\u263E'}
          </button>
        </div>
      </div>

      <div className="viewer-split" style={{ flex: '0 0 auto', maxHeight: '45%' }}>
        <section className="editor-section" aria-label="JSON A input">
          <div className="section-head">
            <h2 className="section-title">JSON A</h2>
            <div className="section-meta">{inputA.split('\n').length} lines</div>
          </div>
          <Editor value={inputA} onChange={updateA} error={errorA ? { message: errorA, line: 1, col: 1 } : null} />
        </section>

        <section className="output-section" aria-label="JSON B input">
          <div className="section-head">
            <h2 className="section-title">JSON B</h2>
            <div className="section-meta">{inputB.split('\n').length} lines</div>
          </div>
          <Editor value={inputB} onChange={updateB} error={errorB ? { message: errorB, line: 1, col: 1 } : null} />
        </section>
      </div>

      <div className="output-pane" style={{ borderTop: '1px solid var(--border)' }}>
        {!parsedA || !parsedB ? (
          <div className="empty-state">
            <div className="empty-icon">{'{ }'}</div>
            <p>Fix JSON errors in both inputs to see the diff.</p>
          </div>
        ) : changes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{'=='}</div>
            <p>JSON A and JSON B are identical — no differences found.</p>
          </div>
        ) : (
          <div className="diff-list">
            {changed.map((c, i) => (
              <div key={`ch-${i}`}>
                <div className="diff-line removed">
                  <span className="diff-prefix">-</span>
                  <span className="diff-path">{pathToString(c.path)}</span>
                  <span className="diff-eq">=</span>
                  <span className="diff-old">{stringifyVal(c.oldValue)}</span>
                </div>
                <div className="diff-line added">
                  <span className="diff-prefix">+</span>
                  <span className="diff-path">{pathToString(c.path)}</span>
                  <span className="diff-eq">=</span>
                  <span className="diff-val">{stringifyVal(c.newValue)}</span>
                </div>
              </div>
            ))}
            {removed.map((c, i) => (
              <div key={`rm-${i}`} className="diff-line removed">
                <span className="diff-prefix">-</span>
                <span className="diff-path">{pathToString(c.path)}</span>
                <span className="diff-eq">=</span>
                <span className="diff-old">{stringifyVal(c.oldValue)}</span>
              </div>
            ))}
            {added.map((c, i) => (
              <div key={`add-${i}`} className="diff-line added">
                <span className="diff-prefix">+</span>
                <span className="diff-path">{pathToString(c.path)}</span>
                <span className="diff-eq">=</span>
                <span className="diff-val">{stringifyVal(c.newValue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { generateCSharp, formatCSharpCode } from '../lib/csharp-gen.js'
import { SAMPLE_JSON, SAMPLE_LIST } from '../lib/samples.js'
import Editor from './Editor.jsx'

export default function CSharpGenTab() {
  const [input, setInput] = useState(JSON.stringify(SAMPLE_JSON.basic.data, null, 4))
  const [rootName, setRootName] = useState('RootClass')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const result = useMemo(() => {
    if (!input || !input.trim()) return null
    const gen = generateCSharp(input, rootName.trim() || 'RootClass')
    if (gen.error) {
      setError(gen.error)
      return null
    }
    setError(null)
    return formatCSharpCode(gen.classDefs)
  }, [input, rootName])

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (_) {}
  }

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rootName || 'RootClass'}.cs`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSample = (key) => {
    const s = SAMPLE_JSON[key]
    if (s) setInput(JSON.stringify(s.data, null, 4))
  }

  const inputLineCount = input ? input.split('\n').length : 1
  const classCount = result ? (result.match(/public class/g) || []).length : 0

  return (
    <div className="viewer">
      <div className="viewer-toolbar">
        <div className="viewer-toolbar-row">
          <label className="btn-label">
            Root class:
            <input
              className="csharp-gen-root-input"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="RootClass"
            />
          </label>
          <select
            className="btn"
            onChange={(e) => { if (e.target.value) handleSample(e.target.value) }}
            defaultValue=""
            aria-label="Load sample data"
          >
            <option value="" disabled>Load sample…</option>
            {SAMPLE_LIST.map((s) => (
              <option key={s.key} value={s.key}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="viewer-split">
        <section className="editor-section" aria-label="JSON input">
          <div className="section-head">
            <h2 className="section-title">Input</h2>
            <div className="section-meta">{inputLineCount} lines</div>
          </div>
          <Editor value={input} onChange={setInput} />
        </section>

        <section className="output-section" aria-label="C# class output">
          <div className="section-head">
            <h2 className="section-title">Output</h2>
            <div className="section-meta">
              {classCount ? `${classCount} class${classCount === 1 ? '' : 'es'}` : ''}
            </div>
          </div>

          <div className="output-pane">
            {error ? (
              <div className="error-card">
                <div className="error-title">⚠ Invalid JSON</div>
                <div className="error-message">{error}</div>
              </div>
            ) : !input || !input.trim() ? (
              <div className="empty-state">
                <div className="empty-icon">{'{ }'}</div>
                <p>Paste JSON in the input to generate C# classes.</p>
              </div>
            ) : result ? (
              <pre className="csharp-gen-code">{result}</pre>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">{'{ }'}</div>
                <p>Waiting for valid JSON input…</p>
              </div>
            )}
          </div>

          {result && (
            <div className="viewer-toolbar" style={{ borderTop: '1px solid var(--border)', borderBottom: 'none' }}>
              <div className="viewer-toolbar-row">
                <button className="btn primary" onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button className="btn" onClick={handleDownload}>
                  Download
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

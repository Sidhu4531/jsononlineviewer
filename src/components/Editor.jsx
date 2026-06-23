import { useEffect, useRef } from 'react'

const MAX_LINE_GUTTER = 2000

export default function Editor({ value, onChange, error }) {
  const taRef = useRef(null)
  const totalLines = value ? value.split('\n').length : 1
  const showLines = Math.min(totalLines, MAX_LINE_GUTTER)
  const overflow = totalLines > MAX_LINE_GUTTER

  useEffect(() => {
    if (!taRef.current || !error) return
    try {
      const lines = taRef.current.value.split('\n').slice(0, Math.max(0, error.line - 1)).join('\n')
      const pos = Math.min(lines.length + (error.col || 1), taRef.current.value.length)
      taRef.current.focus()
      taRef.current.setSelectionRange(pos, pos)
    } catch (_) {}
  }, [error])

  return (
    <div className="editor">
      <div className="editor-gutter" aria-hidden="true">
        {Array.from({ length: showLines }, (_, i) => (
          <div key={i} className="gutter-line">{i + 1}</div>
        ))}
        {overflow && <div className="gutter-line gutter-overflow">&#8230;</div>}
      </div>
      <textarea
        ref={taRef}
        className="editor-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder='Paste or type JSON here, e.g. {"hello":"world"}'
      />
    </div>
  )
}

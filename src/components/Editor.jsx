import { useEffect, useRef } from 'react'

export default function Editor({ value, onChange, error }) {
  const taRef = useRef(null)
  const lineCount = value ? value.split('\n').length : 1

  useEffect(() => {
    if (!taRef.current || !error) return
    const lines = taRef.current.value.split('\n').slice(0, error.line - 1).join('\n')
    const pos = lines.length + error.col
    taRef.current.focus()
    taRef.current.setSelectionRange(pos, pos)
  }, [error])

  return (
    <div className="editor">
      <div className="editor-gutter" aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="gutter-line">{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        className="editor-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Paste or type JSON here…"
      />
    </div>
  )
}

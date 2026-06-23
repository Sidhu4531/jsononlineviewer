import { useState, useCallback, useMemo, useEffect } from 'react'
import { pathToString } from '../lib/utils.js'

const MAX_DISPLAY_LINES = 2000
const LARGE_TREE_WARN = 50000

function estimateNodeCount(data) {
  if (!data || typeof data !== 'object') return 1
  if (Array.isArray(data)) return data.length > LARGE_TREE_WARN ? data.length : 0
  const keys = Object.keys(data)
  return keys.length > LARGE_TREE_WARN ? keys.length : 0
}

export default function JsonText({ data, indent = 4, search = '', onSelect, selectedPath }) {
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [copied, setCopied] = useState(false)
  const indentStr = indent === 'tab' ? '\t' : ' '.repeat(indent)

  const isTooLarge = estimateNodeCount(data)

  useEffect(() => {
    const onExpandAll = () => setCollapsed(new Set())
    const onCollapseAll = () => {
      if (isTooLarge) {
        setCollapsed(new Set(['__root__']))
        return
      }
      const next = new Set()
      walkCollapseIds(data, [], next)
      setCollapsed(next)
    }
    window.addEventListener('json-viewer:expand-all', onExpandAll)
    window.addEventListener('json-viewer:collapse-all', onCollapseAll)
    return () => {
      window.removeEventListener('json-viewer:expand-all', onExpandAll)
      window.removeEventListener('json-viewer:collapse-all', onCollapseAll)
    }
  }, [data, isTooLarge])

  const onToggle = useCallback((id) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const onCopy = useCallback(async () => {
    if (isTooLarge) return
    try {
      const out = stringify(data, 0, indentStr, collapsed, [])
      await navigator.clipboard.writeText(out)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) { /* noop */ }
  }, [data, indentStr, collapsed, isTooLarge])

  const onExpandAll = useCallback(() => setCollapsed(new Set()), [])
  const onCollapseAll = useCallback(() => {
    if (isTooLarge) {
      setCollapsed(new Set(['__root__']))
      return
    }
    const next = new Set()
    walkCollapseIds(data, [], next)
    setCollapsed(next)
  }, [data, isTooLarge])

  const lines = useMemo(() => {
    const out = []
    let count = 0
    buildLines(data, 0, [], out, collapsed, () => count++ < MAX_DISPLAY_LINES)
    return out
  }, [data, indentStr, collapsed])

  const truncated = lines.length >= MAX_DISPLAY_LINES

  return (
    <div className="json-text">
      <div className="json-text-toolbar">
        <span className="json-text-info">
          {isTooLarge ? `${isTooLarge.toLocaleString()}+ items` : `${countAll(data)} value${countAll(data) === 1 ? '' : 's'}`}
        </span>
        <div className="json-text-actions">
          {isTooLarge && <span className="json-text-warn" title="File too large for all actions">&#9888; large file</span>}
          <button className="btn small" onClick={onExpandAll}>Expand all</button>
          <button className="btn small" onClick={onCollapseAll}>Collapse all</button>
          <button className="btn small" onClick={onCopy} disabled={isTooLarge}>{copied ? 'Copied!' : 'Copy'}</button>
        </div>
      </div>
      {truncated && (
        <div className="json-text-truncated">
          Showing first {MAX_DISPLAY_LINES.toLocaleString()} lines. Switch to <strong>Tree</strong> view for full exploration.
        </div>
      )}
      <pre className="json-text-body">
        {lines.map((line, i) => (
          <Line
            key={i}
            line={line}
            search={search}
            onSelect={onSelect}
            selectedPath={selectedPath}
            onToggle={onToggle}
          />
        ))}
      </pre>
    </div>
  )
}

function Line({ line, search, onSelect, selectedPath, onToggle }) {
  const path = line.parts
  const isSelected = path && selectedPath && pathToString(path) === pathToString(selectedPath)
  const isMatch = path && search && (
    pathToString(path).toLowerCase().includes(search) ||
    (line.valueText && line.valueText.toLowerCase().includes(search))
  )

  const onClick = () => {
    if (line.kind === 'open' && line.collapsible) onToggle(pathToString(path))
    else if (line.kind === 'collapsed') onToggle(pathToString(path))
    else if (onSelect) onSelect(path)
  }

  const padStyle = { paddingLeft: line.depth * 18 }
  const cls = 'jt-line' + (isSelected ? ' selected' : '') + (isMatch ? ' match' : '') + (line.kind === 'open' && line.collapsible ? ' collapsible' : '')

  const keyEl = line.key !== undefined && (
    line.keyType === 'array'
      ? <span className="jt-array-key">[{line.key}]</span>
      : <><span className="jt-key">"{line.key}"</span><span className="jt-sym">: </span></>
  )

  if (line.kind === 'open') {
    return (
      <div className={cls} onClick={onClick} style={padStyle}>
        <span className="jt-toggle">{line.collapsible ? '▾' : ' '}</span>
        {keyEl}
        <span className={'jt-bracket ' + (line.type === 'array' ? 'jt-bracket-array' : 'jt-bracket-object')}>
          {line.type === 'array' ? '[' : '{'}
        </span>
      </div>
    )
  }

  if (line.kind === 'collapsed') {
    return (
      <div className={'jt-line collapsible' + (isSelected ? ' selected' : '') + (isMatch ? ' match' : '')} onClick={onClick} style={padStyle}>
        <span className="jt-toggle">▸</span>
        {keyEl}
        <span className={'jt-bracket ' + (line.type === 'array' ? 'jt-bracket-array' : 'jt-bracket-object')}>
          {line.type === 'array' ? '[' : '{'}
        </span>
        <span className="jt-collapsed-meta"> ... {line.summary} </span>
        <span className={'jt-bracket ' + (line.type === 'array' ? 'jt-bracket-array' : 'jt-bracket-object')}>
          {line.type === 'array' ? ']' : '}'}
        </span>
        {line.comma && <span className="jt-sym">,</span>}
      </div>
    )
  }

  if (line.kind === 'close') {
    return (
      <div className="jt-line" style={padStyle}>
        <span className="jt-toggle"> </span>
        <span className={'jt-bracket ' + (line.type === 'array' ? 'jt-bracket-array' : 'jt-bracket-object')}>
          {line.type === 'array' ? ']' : '}'}
        </span>
        {line.comma && <span className="jt-sym">,</span>}
      </div>
    )
  }

  return (
    <div className={cls} onClick={onClick} style={padStyle}>
      <span className="jt-toggle"> </span>
      {keyEl}
      <span className={'jt-value jt-' + valueTypeClass(line.valueText)}>{line.valueText}</span>
      {line.comma && <span className="jt-sym">,</span>}
    </div>
  )
}

function buildLines(value, depth, parts, out, collapsed, canAdd) {
  if (!canAdd()) return

  if (value === null) {
    out.push({ kind: 'value', valueText: 'null', depth, parts })
    return
  }
  if (typeof value === 'string') {
    out.push({ kind: 'value', valueText: JSON.stringify(value), depth, parts })
    return
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    out.push({ kind: 'value', valueText: String(value), depth, parts })
    return
  }
  if (Array.isArray(value) || typeof value === 'object') {
    const isArray = Array.isArray(value)
    const keys = Object.keys(value)
    const id = pathToString(parts)
    const isCollapsed = parts.length > 0 && collapsed.has(id)
    const summary = isArray
      ? keys.length + ' item' + (keys.length === 1 ? '' : 's')
      : keys.length + ' key' + (keys.length === 1 ? '' : 's')

    if (isCollapsed) {
      out.push({ kind: 'collapsed', type: isArray ? 'array' : 'object', depth, parts, summary })
      return
    }

    out.push({
      kind: 'open',
      type: isArray ? 'array' : 'object',
      depth,
      parts,
      collapsible: keys.length > 0
    })

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      const numericKey = isArray ? Number(k) : (Number.isNaN(Number(k)) ? k : Number(k))
      const childParts = [...parts, numericKey]
      if (!canAdd()) {
        out[out.length - 1].collapsible = false
        if (i < keys.length - 1) {
          out.push({ kind: 'collapsed', type: isArray ? 'array' : 'object', depth, parts, summary: (keys.length - i) + ' more items' })
        }
        return
      }
      buildLines(value[k], depth + 1, childParts, out, collapsed, canAdd)
      if (out.length > 0) {
        const last = out[out.length - 1]
        if (last) {
          last.key = k
          last.keyType = isArray ? 'array' : 'object'
          last.comma = true
        }
      }
    }

    if (canAdd()) {
      const last = out[out.length - 1]
      if (last) last.comma = false
      out.push({ kind: 'close', type: isArray ? 'array' : 'object', depth, parts })
    }
  }
}

function stringify(value, depth, indentStr, collapsed, parts) {
  const pad = indentStr.repeat(depth)
  const padInner = indentStr.repeat(depth + 1)
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    if (parts.length > 0 && collapsed.has(pathToString(parts))) return '[ ... ]'
    return '[\n' + value.map((v, i) => padInner + stringify(v, depth + 1, indentStr, collapsed, [...parts, i])).join(',\n') + '\n' + pad + ']'
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    if (parts.length > 0 && collapsed.has(pathToString(parts))) return '{ ... }'
    return '{\n' + entries.map(([k, v]) => padInner + JSON.stringify(k) + ': ' + stringify(v, depth + 1, indentStr, collapsed, [...parts, k])).join(',\n') + '\n' + pad + '}'
  }
  return String(value)
}

function walkCollapseIds(value, parts, out) {
  if (value !== null && typeof value === 'object') {
    if (parts.length > 0) out.add(pathToString(parts))
    const keys = Object.keys(value)
    for (let i = 0; i < keys.length; i++) {
      if (out.size > MAX_DISPLAY_LINES) return
      walkCollapseIds(value[keys[i]], [...parts, Number.isNaN(Number(keys[i])) ? keys[i] : Number(keys[i])], out)
    }
  }
}

function countAll(value) {
  let n = 0
  const w = (v) => {
    if (n > MAX_DISPLAY_LINES) return
    n++
    if (v && typeof v === 'object') {
      for (const k of Object.keys(v)) w(v[k])
    }
  }
  w(value)
  return n
}

function valueTypeClass(text) {
  if (text === 'null') return 'null'
  if (text === 'true' || text === 'false') return 'boolean'
  if (text.startsWith('"') && text.endsWith('"')) return 'string'
  if (text !== '' && !isNaN(Number(text))) return 'number'
  return 'value'
}

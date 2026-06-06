import { useState, useCallback, useEffect } from 'react'
import { pathToString } from '../lib/utils.js'

export default function JsonTree({ data, selectedPath, onSelect, search, matches }) {
  const [expanded, setExpanded] = useState(() => new Set(['']))

  useEffect(() => {
    const onExpandAll = () => setExpanded(new Set(['__all__']))
    const onCollapseAll = () => setExpanded(new Set(['']))
    window.addEventListener('json-viewer:expand-all', onExpandAll)
    window.addEventListener('json-viewer:collapse-all', onCollapseAll)
    return () => {
      window.removeEventListener('json-viewer:expand-all', onExpandAll)
      window.removeEventListener('json-viewer:collapse-all', onCollapseAll)
    }
  }, [])

  useEffect(() => {
    if (search) {
      const next = new Set([''])
      const visit = (v, parts) => {
        const path = pathToString(parts)
        if (matches.has(path) || parts.length === 0) {
          for (let i = 0; i < parts.length; i++) {
            next.add(pathToString(parts.slice(0, i + 1)))
          }
        }
        if (v && typeof v === 'object') {
          for (const [k, child] of Object.entries(v)) {
            visit(child, [...parts, Number.isNaN(Number(k)) ? k : Number(k)])
          }
        }
      }
      visit(data, [])
      setExpanded(next)
    }
  }, [search, matches, data])

  const toggle = useCallback((path) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has('__all__')) {
        // when fully expanded, toggling collapses only this path
        next.delete(path)
        next.delete('__all__')
        return next
      }
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  const allExpanded = expanded.has('__all__')

  return (
    <div className="tree" role="tree">
      <Node
        value={data}
        parts={[]}
        label="$"
        isRoot
        expanded={expanded}
        allExpanded={allExpanded}
        onToggle={toggle}
        onSelect={onSelect}
        selectedPath={selectedPath}
        search={search}
        matches={matches}
      />
    </div>
  )
}

function Node({ value, parts, label, isRoot, expanded, allExpanded, onToggle, onSelect, selectedPath, search, matches }) {
  const kind = kindOf(value)
  const isContainer = kind === 'object' || kind === 'array'
  const path = pathToString(parts)
  const isOpen = allExpanded || expanded.has(path) || isRoot
  const isMatch = matches.has(path)
  const isSelected = selectedPath && path === pathToString(selectedPath)

  const onClick = () => {
    if (isContainer) onSelect(parts, value)
    else onSelect(parts, value)
  }

  const childEntries = isContainer ? Object.entries(value) : []

  return (
    <div className={'kv-row' + (isSelected ? ' selected' : '') + (isMatch ? ' match' : '')}>
      <div className="kv-line" onClick={onClick} role="treeitem" aria-selected={isSelected}>
        {isContainer ? (
          <button
            className="caret"
            onClick={(e) => { e.stopPropagation(); onToggle(path) }}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >{isOpen ? '▾' : '▸'}</button>
        ) : (
          <span className="caret-spacer" />
        )}
        {!isRoot && (
          <span className="kv-key">
            {kind === 'array' && /^\d+$/.test(String(label)) ? `[${label}]` : `"${label}"`}
            <span className="kv-colon">: </span>
          </span>
        )}
        {renderValue(value, kind, isOpen)}
      </div>
      {isContainer && isOpen && (
        <div className="kv-children">
          {childEntries.length === 0 ? (
            <div className="kv-empty">{kind === 'array' ? '[]' : '{}'}</div>
          ) : (
            childEntries.map(([k, v]) => (
              <Node
                key={k}
                value={v}
                parts={[...parts, Number.isNaN(Number(k)) ? k : Number(k)]}
                label={k}
                expanded={expanded}
                allExpanded={allExpanded}
                onToggle={onToggle}
                onSelect={onSelect}
                selectedPath={selectedPath}
                search={search}
                matches={matches}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function renderValue(value, kind, isOpen) {
  if (kind === 'null') return <span className="kv-value type-null">null</span>
  if (kind === 'string') return <span className="kv-value type-string">"{value}"</span>
  if (kind === 'number') return <span className="kv-value type-number">{String(value)}</span>
  if (kind === 'boolean') return <span className="kv-value type-boolean">{String(value)}</span>
  if (kind === 'array') {
    return (
      <span className="kv-meta-inline">
        <span className="kv-meta">Array({value.length})</span>
        {!isOpen && <span className="kv-brace">[…]</span>}
      </span>
    )
  }
  if (kind === 'object') {
    return (
      <span className="kv-meta-inline">
        <span className="kv-meta">Object({Object.keys(value).length})</span>
        {!isOpen && <span className="kv-brace">{'{…}'}</span>}
      </span>
    )
  }
  return null
}

function kindOf(v) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  if (typeof v === 'object') return 'object'
  return typeof v
}

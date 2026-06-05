import { useState, useEffect, useCallback } from 'react'
import { nodeKind, pathToString } from '../lib/utils.js'

export default function TreeView({ data, selectedPath, onSelect, search, matches, typeFilter }) {
  const [expanded, setExpanded] = useState(() => new Set(['']))
  const [expandAllTrigger, setExpandAllTrigger] = useState(0)

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
            visit(child, [...parts, isNaN(k) ? k : Number(k)])
          }
        }
      }
      visit(data, [])
      setExpanded(next)
    }
  }, [search, matches, data, expandAllTrigger])

  const toggle = useCallback((path) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  return (
    <div className="tree" role="tree">
      <Node
        value={data}
        parts={[]}
        label="$"
        isRoot
        expanded={expanded}
        onToggle={toggle}
        onSelect={onSelect}
        selectedPath={selectedPath}
        search={search}
        matches={matches}
        typeFilter={typeFilter}
      />
    </div>
  )
}

function Node({ value, parts, label, isRoot, expanded, onToggle, onSelect, selectedPath, search, matches, typeFilter }) {
  const selected = selectedPath && pathToString(parts) === pathToString(selectedPath)
  const path = pathToString(parts)
  const kind = nodeKind(value)
  const isContainer = kind === 'object' || kind === 'array'
  const isOpen = expanded.has(path) || isRoot
  const isMatch = matches.has(path)
  const matchesFilter = typeFilter === 'all' || typeFilter === kind

  if (!matchesFilter && !isContainer) {
    return null
  }

  const isSelected = selected
  const childEntries = isContainer ? Object.entries(value) : []

  const renderValue = () => {
    if (kind === 'null') return <span className="kv-value type-null">null</span>
    if (kind === 'string') return <span className="kv-value type-string">"{value}"</span>
    if (kind === 'number') return <span className="kv-value type-number">{String(value)}</span>
    if (kind === 'boolean') return <span className="kv-value type-boolean">{String(value)}</span>
    if (kind === 'array') return <span className="kv-meta">Array({value.length})</span>
    if (kind === 'object') return <span className="kv-meta">Object({Object.keys(value).length})</span>
    return null
  }

  return (
    <div className={isSelected ? 'kv-row selected' : isMatch ? 'kv-row match' : 'kv-row'}>
      <div className="kv-line" onClick={() => onSelect(parts, value)} role="treeitem" aria-selected={isSelected}>
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
          <span className="kv-key">{isContainer && /^\d+$/.test(label) ? `[${label}]` : label}:</span>
        )}
        {isContainer ? (
          <span className="kv-meta-inline">
            {renderValue()}
            {isOpen ? '' : <span className="kv-brace">{kind === 'array' ? '[…]' : '{…}'}</span>}
          </span>
        ) : (
          renderValue()
        )}
      </div>
      {isContainer && isOpen && (
        <div className="kv-children">
          {childEntries.length === 0 ? (
            <div className="kv-empty">{kind === 'array' ? '[]' : '{}'}</div>
          ) : (
            childEntries.map(([k, v]) => {
              const childParts = [...parts, isNaN(k) ? k : Number(k)]
              if (typeFilter !== 'all') {
                const childKind = nodeKind(v)
                if (childKind !== typeFilter && !(childKind === 'object' || childKind === 'array')) return null
              }
              return (
                <Node
                  key={k}
                  value={v}
                  parts={childParts}
                  label={k}
                  expanded={expanded}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  selectedPath={selectedPath}
                  search={search}
                  matches={matches}
                  typeFilter={typeFilter}
                />
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

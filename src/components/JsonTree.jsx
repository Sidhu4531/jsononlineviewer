import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { pathToString } from '../lib/utils.js'

const CHUNK_STEP = 50
const SEARCH_CHUNK = 200

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
          if (Array.isArray(v)) {
            for (let i = 0; i < v.length; i++) {
              visit(v[i], [...parts, i])
            }
          } else {
            const keys = Object.keys(v)
            for (let i = 0; i < keys.length; i++) {
              const k = keys[i]
              visit(v[k], [...parts, Number.isNaN(Number(k)) ? k : Number(k)])
            }
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
        key={allExpanded ? 'all' : 'partial'}
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

  const [visibleCount, setVisibleCount] = useState(CHUNK_STEP)

  const isArray = Array.isArray(value)

  const childCount = useMemo(() => {
    if (!isContainer) return 0
    if (isArray) return value.length
    return Object.keys(value).length
  }, [isContainer, isArray, value])

  const objectKeys = useMemo(() => {
    if (isArray || !isContainer) return null
    return Object.keys(value)
  }, [isContainer, isArray, value])

  const hasSearch = search && matches.size > 0
  const maxVisible = isOpen ? (
    allExpanded ? childCount : Math.max(visibleCount, hasSearch ? SEARCH_CHUNK : 0)
  ) : 0

  const visibleEnd = Math.min(maxVisible, childCount)
  const remaining = childCount - visibleEnd

  const onClick = () => {
    onSelect(parts, value)
  }

  const children = useMemo(() => {
    if (!isContainer || !isOpen || childCount === 0) return null
    const elems = []
    if (isArray) {
      for (let i = 0; i < visibleEnd; i++) {
        elems.push(
          <Node
            key={i}
            value={value[i]}
            parts={[...parts, i]}
            label={String(i)}
            expanded={expanded}
            allExpanded={allExpanded}
            onToggle={onToggle}
            onSelect={onSelect}
            selectedPath={selectedPath}
            search={search}
            matches={matches}
          />
        )
      }
    } else if (objectKeys) {
      for (let i = 0; i < visibleEnd; i++) {
        const k = objectKeys[i]
        elems.push(
          <Node
            key={k}
            value={value[k]}
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
        )
      }
    }
    if (remaining > 0) {
      elems.push(
        <SentinelTrigger
          key="__sentinel__"
          onShow={() => setVisibleCount((c) => c + CHUNK_STEP)}
          remaining={remaining}
        />
      )
    }
    return elems
  }, [isContainer, isOpen, childCount, isArray, objectKeys, value, visibleEnd, remaining, expanded, allExpanded, onToggle, onSelect, selectedPath, search, matches, parts])

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
            {isArray && /^\d+$/.test(String(label)) ? `[${label}]` : `"${label}"`}
            <span className="kv-colon">: </span>
          </span>
        )}
        {renderValue(value, kind, isOpen, childCount)}
      </div>
      {children && (
        <div className="kv-children">
          {children}
        </div>
      )}
    </div>
  )
}

function renderValue(value, kind, isOpen, childCount) {
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
        <span className="kv-meta">Object({childCount})</span>
        {!isOpen && <span className="kv-brace">{'{…}'}</span>}
      </span>
    )
  }
  return null
}

function SentinelTrigger({ onShow, remaining }) {
  const ref = useRef(null)
  const pendingRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || remaining <= 0) return
    pendingRef.current = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pendingRef.current) {
          pendingRef.current = true
          onShow()
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onShow, remaining])

  if (remaining <= 0) return null

  return <div ref={ref} className="tree-sentinel" />
}

function kindOf(v) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  if (typeof v === 'object') return 'object'
  return typeof v
}

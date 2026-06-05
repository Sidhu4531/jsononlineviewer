export function parseJSON(text) {
  if (!text || !text.trim()) {
    return { ok: false, data: null, error: null, empty: true }
  }
  try {
    const data = JSON.parse(text)
    return { ok: true, data, error: null, empty: false }
  } catch (e) {
    const msg = String(e?.message || e)
    const m = msg.match(/position\s+(\d+)/i)
    let line = 1
    let col = 1
    if (m) {
      const pos = parseInt(m[1], 10)
      const before = text.slice(0, pos)
      const lines = before.split('\n')
      line = lines.length
      col = lines[lines.length - 1].length + 1
    }
    return {
      ok: false,
      data: null,
      error: { message: msg, line, col },
      empty: false
    }
  }
}

export function formatJSON(data, indent = 2) {
  return JSON.stringify(data, null, indent)
}

export function minifyJSON(data) {
  return JSON.stringify(data)
}

export function byteSize(text) {
  return new Blob([text]).size
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

export function typeOf(v) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

export function nodeKind(v) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  if (typeof v === 'object') return 'object'
  if (typeof v === 'string') return 'string'
  if (typeof v === 'number') return 'number'
  if (typeof v === 'boolean') return 'boolean'
  return 'unknown'
}

export function pathToString(parts) {
  if (!parts || parts.length === 0) return '$'
  let out = '$'
  for (const p of parts) {
    if (typeof p === 'number') out += `[${p}]`
    else if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(p)) out += `.${p}`
    else out += `[${JSON.stringify(p)}]`
  }
  return out
}

export function countNodes(data) {
  let count = 0
  function walk(v) {
    count++
    if (v && typeof v === 'object') {
      for (const key of Object.keys(v)) walk(v[key])
    }
  }
  walk(data)
  return count
}

export function depthOf(data) {
  if (data === null || typeof data !== 'object') return 0
  let max = 0
  function walk(v, d) {
    if (v && typeof v === 'object') {
      const cur = d + 1
      if (cur > max) max = cur
      for (const key of Object.keys(v)) walk(v[key], cur)
    }
  }
  walk(data, 0)
  return max
}

export function searchInJSON(data, query) {
  if (!query) return new Set()
  const q = query.toLowerCase()
  const matches = new Set()
  function walk(v, parts) {
    const path = pathToString(parts).toLowerCase()
    if (path.includes(q)) matches.add(path)
    if (v !== null && typeof v === 'object') {
      for (const [k, child] of Object.entries(v)) {
        walk(child, [...parts, isNaN(k) ? k : Number(k)])
        if (typeof child === 'string' && child.toLowerCase().includes(q)) {
          matches.add(pathToString([...parts, isNaN(k) ? k : Number(k)]))
        } else if (typeof child !== 'object' && child !== null && String(child).toLowerCase().includes(q)) {
          matches.add(pathToString([...parts, isNaN(k) ? k : Number(k)]))
        }
      }
    } else {
      if (typeof v === 'string' && v.toLowerCase().includes(q)) {
        matches.add(path)
      } else if (typeof v !== 'object' && v !== null && String(v).toLowerCase().includes(q)) {
        matches.add(path)
      }
    }
  }
  walk(data, [])
  return matches
}

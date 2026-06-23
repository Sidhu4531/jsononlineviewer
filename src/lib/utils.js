export function parseJSON(text) {
  if (!text || !text.trim()) {
    return { ok: false, data: null, error: null, empty: true }
  }
  try {
    const data = JSON.parse(text)
    return { ok: true, data, error: null, empty: false }
  } catch (e) {
    const msg = String(e?.message || e)
    const pos = locateErrorPosition(text, msg)
    let line = 1
    let col = 1
    if (pos >= 0 && pos <= text.length) {
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

function locateErrorPosition(text, msg) {
  // 1. Older V8 format: "at position N"
  const m = msg.match(/position\s+(\d+)/i)
  if (m) return parseInt(m[1], 10)

  // 2. Newer V8 "Unexpected end of JSON input"
  if (/Unexpected end of JSON input/i.test(msg)) return text.length

  // 3. Newer V8 "Unexpected token X, "..." is not valid JSON"
  const tokenMatch = msg.match(/Unexpected token ([\s\S]*?), "([\s\S]*?)" is not valid JSON/)
  if (tokenMatch) {
    const token = tokenMatch[1].replace(/^['"`]+|['"`]+$/g, '')
    if (token) {
      const idx = text.lastIndexOf(token)
      if (idx >= 0) return idx
    }
  }

  // 4. Fallback: end of input
  return text.length
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
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) walk(v[i])
      } else {
        const keys = Object.keys(v)
        for (let i = 0; i < keys.length; i++) walk(v[keys[i]])
      }
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
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) walk(v[i], cur)
      } else {
        const keys = Object.keys(v)
        for (let i = 0; i < keys.length; i++) walk(v[keys[i]], cur)
      }
    }
  }
  walk(data, 0)
  return max
}

export function computeStats(data) {
  let nodeCount = 0
  let maxDepth = 0
  function walk(v, depth) {
    nodeCount++
    if (depth > maxDepth) maxDepth = depth
    if (v && typeof v === 'object') {
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) walk(v[i], depth + 1)
      } else {
        const keys = Object.keys(v)
        for (let i = 0; i < keys.length; i++) walk(v[keys[i]], depth + 1)
      }
    }
  }
  walk(data, 0)
  return { nodeCount, depth: maxDepth }
}

export function generateArrayFromTemplate(template, count) {
  if (count < 1) return []
  let tpl = template
  if (Array.isArray(template)) {
    tpl = template.length > 0 ? template[0] : null
  }
  if (tpl === null || typeof tpl !== 'object' || Array.isArray(tpl)) {
    return Array.from({ length: count }, () => deepGenerate(tpl, 0, count))
  }
  return Array.from({ length: count }, (_, i) => deepGenerate(tpl, i, count))
}

export function generateArrayChunked(template, count, chunkSize, onProgress) {
  return new Promise((resolve) => {
    let tpl = template
    if (Array.isArray(template)) {
      tpl = template.length > 0 ? template[0] : null
    }
    const result = []
    let generated = 0
    let lastUpdate = 0
    const useIndex = tpl !== null && typeof tpl === 'object' && !Array.isArray(tpl)

    function processChunk() {
      const end = Math.min(generated + chunkSize, count)
      for (let i = generated; i < end; i++) {
        result.push(useIndex ? deepGenerate(tpl, i, count) : deepGenerate(tpl, 0, count))
      }
      generated = end

      const now = Date.now()
      if (onProgress && now - lastUpdate > 100) {
        onProgress(generated, count)
        lastUpdate = now
      }

      if (generated < count) {
        setTimeout(processChunk, 0)
      } else {
        if (onProgress) onProgress(count, count)
        resolve(result)
      }
    }

    setTimeout(processChunk, 0)
  })
}

function deepGenerate(template, index, total) {
  if (template === null || template === undefined) return null

  if (typeof template === 'string') {
    return generateString(template, index)
  }

  if (typeof template === 'number') {
    const range = Math.max(Math.abs(template) * 0.3, 1)
    return Math.round((template + (Math.random() - 0.5) * range) * 100) / 100
  }

  if (typeof template === 'boolean') {
    return Math.random() > 0.5
  }

  if (Array.isArray(template)) {
    return template.map((item) => deepGenerate(item, index, total))
  }

  if (typeof template === 'object') {
    const result = {}
    for (const key of Object.keys(template)) {
      result[key] = deepGenerate(template[key], index, total)
    }
    return result
  }

  return template
}

function generateString(template, index) {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(template)) {
    return cryptoRandom()
  }
  const emailMatch = template.match(/^(.+)@(.+)$/)
  if (emailMatch) {
    return `${emailMatch[1]}${index + 1}@${emailMatch[2]}`
  }
  if (/\d+/.test(template)) {
    return template.replace(/(\d+)/, (m) => String(Number(m) + index))
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(template)) {
    const d = new Date(template)
    if (!isNaN(d.getTime())) {
      const nd = new Date(d)
      nd.setDate(d.getDate() + index)
      return nd.toISOString().replace('Z', '')
    }
  }
  return `${template} ${index + 1}`
}

function cryptoRandom() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export function searchInJSON(data, query) {
  if (!query) return new Set()
  const q = query.toLowerCase()
  const matches = new Set()
  function walk(v, parts) {
    if (v !== null && typeof v === 'object') {
      for (const [k, child] of Object.entries(v)) {
        const isNumericKey = !Number.isNaN(Number(k))
        const newParts = [...parts, isNumericKey ? Number(k) : k]
        if (!isNumericKey && k.toLowerCase().includes(q)) {
          matches.add(pathToString(newParts))
        }
        walk(child, newParts)
        matchValue(child, newParts)
      }
    } else {
      matchValue(v, parts)
    }
  }
  function matchValue(v, parts) {
    const path = pathToString(parts)
    if (v === null) {
      if ('null'.includes(q)) matches.add(path)
    } else if (typeof v === 'string') {
      if (v.toLowerCase().includes(q)) matches.add(path)
    } else if (typeof v !== 'object') {
      if (String(v).toLowerCase().includes(q)) matches.add(path)
    }
  }
  walk(data, [])
  return matches
}

self.onmessage = function (e) {
  const { text } = e.data
  try {
    const data = JSON.parse(text)
    const stats = computeStats(data)
    self.postMessage({ success: true, data, stats })
  } catch (err) {
    const msg = String(err?.message || err)
    const pos = locateErrorPosition(text, msg)
    let line = 1
    let col = 1
    if (pos >= 0 && pos <= text.length) {
      const before = text.slice(0, pos)
      const lines = before.split('\n')
      line = lines.length
      col = lines[lines.length - 1].length + 1
    }
    self.postMessage({
      success: false,
      error: { message: msg, line, col },
    })
  }
}

function computeStats(data) {
  let nodeCount = 0
  function walk(v, depth) {
    nodeCount++
    if (v && typeof v === 'object') {
      const keys = Object.keys(v)
      for (let i = 0; i < keys.length; i++) walk(v[keys[i]], depth + 1)
    }
  }
  walk(data, 0)
  const depth = depthOf(data)
  return { nodeCount, depth }
}

function depthOf(data) {
  if (data === null || typeof data !== 'object') return 0
  let max = 0
  function walk(v, d) {
    if (v && typeof v === 'object') {
      const cur = d + 1
      if (cur > max) max = cur
      const keys = Object.keys(v)
      for (let i = 0; i < keys.length; i++) walk(v[keys[i]], cur)
    }
  }
  walk(data, 0)
  return max
}

function locateErrorPosition(text, msg) {
  const m = msg.match(/position\s+(\d+)/i)
  if (m) return parseInt(m[1], 10)
  if (/Unexpected end of JSON input/i.test(msg)) return text.length
  const tokenMatch = msg.match(/Unexpected token ([\s\S]*?), "([\s\S]*?)" is not valid JSON/)
  if (tokenMatch) {
    const token = tokenMatch[1].replace(/^['"`]+|['"`]+$/g, '')
    if (token) {
      const idx = text.lastIndexOf(token)
      if (idx >= 0) return idx
    }
  }
  return text.length
}

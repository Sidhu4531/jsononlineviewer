export function diffJSON(a, b) {
  const changes = []

  function walk(aVal, bVal, path) {
    if (aVal === bVal) return

    const aType = aVal === null ? 'null' : Array.isArray(aVal) ? 'array' : typeof aVal
    const bType = bVal === null ? 'null' : Array.isArray(bVal) ? 'array' : typeof bVal

    if (aType !== bType) {
      changes.push({ type: 'changed', path: [...path], oldValue: aVal, newValue: bVal })
      return
    }

    if (aType !== 'object' && aType !== 'array') {
      changes.push({ type: 'changed', path: [...path], oldValue: aVal, newValue: bVal })
      return
    }

    if (aType === 'array') {
      const maxLen = Math.max(aVal.length, bVal.length)
      for (let i = 0; i < maxLen; i++) {
        const newPath = [...path, i]
        if (i >= aVal.length) {
          changes.push({ type: 'added', path: newPath, newValue: bVal[i] })
        } else if (i >= bVal.length) {
          changes.push({ type: 'removed', path: newPath, oldValue: aVal[i] })
        } else {
          walk(aVal[i], bVal[i], newPath)
        }
      }
      return
    }

    const keys = new Set([...Object.keys(aVal), ...Object.keys(bVal)])
    for (const key of keys) {
      const newPath = [...path, key]
      if (!(key in aVal)) {
        changes.push({ type: 'added', path: newPath, newValue: bVal[key] })
      } else if (!(key in bVal)) {
        changes.push({ type: 'removed', path: newPath, oldValue: aVal[key] })
      } else {
        walk(aVal[key], bVal[key], newPath)
      }
    }
  }

  walk(a, b, [])
  return changes
}

export const DIFF_SAMPLES = [
  {
    key: 'basic',
    name: 'Basic change',
    a: { name: 'Alice', age: 30, active: true, roles: ['admin'] },
    b: { name: 'Alice', age: 31, active: false, email: 'alice@test.com' }
  },
  {
    key: 'nested',
    name: 'Nested change',
    a: {
      user: { id: 1, name: 'Alice', address: { city: 'NYC' } },
      posts: [{ id: 1, title: 'Hello' }]
    },
    b: {
      user: { id: 1, name: 'Bob', address: { city: 'NYC', zip: '10001' } },
      posts: [{ id: 1, title: 'Hi' }, { id: 2, title: 'World' }]
    }
  },
  {
    key: 'array',
    name: 'Array diff',
    a: { tags: ['a', 'b', 'c'], scores: [10, 20] },
    b: { tags: ['a', 'x', 'c', 'd'], scores: [10, 25] }
  }
]

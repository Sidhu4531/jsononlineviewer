const CSHARP_KEYWORDS = new Set([
  'abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked',
  'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else',
  'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for',
  'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock',
  'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params',
  'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed',
  'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw',
  'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using',
  'virtual', 'void', 'volatile', 'while'
])

function toPascalCase(str) {
  const pascal = str
    .replace(/[^a-zA-Z0-9_]/g, ' ')
    .split(/[\s_]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')

  if (!pascal || /^\d/.test(pascal)) return '_' + (pascal || 'Value')
  return pascal
}

function toValidPropName(str) {
  const name = toPascalCase(str)
  if (CSHARP_KEYWORDS.has(name)) return '@' + name
  return name
}

function singularize(word) {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y'
  if (word.endsWith('ses') || word.endsWith('xes') || word.endsWith('ches') || word.endsWith('shes')) return word.slice(0, -2)
  if (word.endsWith('s') && word.length > 3) return word.slice(0, -1)
  return word
}

function mergeObjects(objects) {
  const keys = new Set()
  for (const obj of objects) {
    if (obj && typeof obj === 'object') {
      for (const k of Object.keys(obj)) keys.add(k)
    }
  }
  const merged = {}
  for (const k of keys) {
    for (const obj of objects) {
      if (obj && typeof obj === 'object' && k in obj && obj[k] !== null && obj[k] !== undefined) {
        merged[k] = obj[k]
        break
      }
    }
    if (!(k in merged)) merged[k] = null
  }
  return merged
}

export function generateCSharp(jsonString, rootClassName = 'RootClass') {
  let data
  try {
    data = JSON.parse(jsonString)
  } catch (e) {
    return { error: `Invalid JSON: ${e.message}` }
  }

  const classDefs = []
  const seen = new Map()

  function inferType(value, resolveObject) {
    if (value === null || value === undefined) return 'object?'
    if (typeof value === 'string') return 'string'
    if (typeof value === 'boolean') return 'bool'
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        if (value >= -2147483648 && value <= 2147483647) return 'int'
        return 'long'
      }
      return 'double'
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<object>'
      const nonNull = value.filter(v => v != null)
      if (nonNull.length === 0) return 'List<object?>'

      const allObjects = nonNull.every(v => typeof v === 'object' && !Array.isArray(v))
      if (allObjects) {
        const merged = mergeObjects(nonNull)
        const className = resolveObject(merged)
        return `List<${className}>`
      }

      const first = nonNull[0]
      const elemType = inferType(first, resolveObject)
      return `List<${elemType}>`
    }
    if (typeof value === 'object') {
      return resolveObject(value)
    }
    return 'object'
  }

  function resolveClass(obj, suggestedName) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return 'object'

    const key = Object.keys(obj).sort().join('|')
    if (seen.has(key)) return seen.get(key)

    let name = suggestedName || toPascalCase(Object.keys(obj)[0]) || 'Item'
    if (!name || /^\d/.test(name)) name = 'Item'

    const existingNames = new Set(classDefs.map(c => c.className))
    let finalName = name
    let counter = 1
    while (existingNames.has(finalName)) {
      finalName = `${name}${counter++}`
    }

    seen.set(key, finalName)

    const properties = Object.entries(obj).map(([k, v]) => ({
      name: toValidPropName(k),
      type: inferType(v, (nestedObj) => resolveClass(nestedObj, singularize(toPascalCase(k)))),
      originalKey: k
    }))

    classDefs.push({ className: finalName, properties })
    return finalName
  }

  if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    resolveClass(data, rootClassName)
  } else if (Array.isArray(data)) {
    if (data.length > 0) {
      const nonNull = data.filter(v => v != null)
      if (nonNull.length > 0) {
        const allObjects = nonNull.every(v => typeof v === 'object' && !Array.isArray(v))
        if (allObjects) {
          const merged = mergeObjects(nonNull)
          resolveClass(merged, rootClassName)
        } else {
          classDefs.push({
            className: rootClassName,
            properties: [{ name: 'Items', type: 'List<object>', originalKey: '' }]
          })
        }
      }
    }
    if (classDefs.length === 0) {
      classDefs.push({
        className: rootClassName,
        properties: []
      })
    }
  } else {
    classDefs.push({
      className: rootClassName,
      properties: [{ name: 'Value', type: inferType(data, () => 'object'), originalKey: '' }]
    })
  }

  return { classDefs, error: null }
}

export function formatCSharpCode(classDefs) {
  let code = 'using System;\n'
  code += 'using System.Collections.Generic;\n'
  code += 'using System.Text.Json.Serialization;\n\n'
  code += 'namespace JsonToCsharp\n'
  code += '{\n'
  for (let i = 0; i < classDefs.length; i++) {
    const cls = classDefs[i]
    code += `    public class ${cls.className}\n`
    code += '    {\n'
    for (const prop of cls.properties) {
      const attr = prop.originalKey
        ? `        [JsonPropertyName("${prop.originalKey}")]\n`
        : ''
      code += attr
      code += `        public ${prop.type} ${prop.name} { get; set; }\n\n`
    }
    code = code.replace(/\n\n$/, '\n')
    code += '    }\n'
    if (i < classDefs.length - 1) code += '\n'
  }
  code += '}\n'
  return code
}

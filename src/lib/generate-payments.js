const PAYMENT_ARRAYS = ['CreatePayments', 'CapturePayments', 'RefundPayments', 'CancelPayment']
const PAYMENT_NAMES_LOWER = new Map(
  PAYMENT_ARRAYS.map(name => [name.toLowerCase(), name])
)

export function Generate(jsonString, count = 3) {
  let data
  try {
    data = JSON.parse(jsonString)
  } catch {
    return { error: 'Invalid JSON input' }
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { error: 'Input must be a JSON object' }
  }

  if (!data.header) {
    return { error: 'Input must have a "header" field' }
  }

  const result = {
    header: { ...data.header, itemCount: count },
  }

  let found = false
  for (const key of Object.keys(data)) {
    const lower = key.toLowerCase()
    if (PAYMENT_NAMES_LOWER.has(lower) && Array.isArray(data[key]) && data[key].length > 0) {
      found = true
      const outKey = PAYMENT_NAMES_LOWER.get(lower)
      result[outKey] = []
      const template = data[key][0]
      for (let i = 0; i < count; i++) {
        result[outKey].push(JSON.parse(JSON.stringify(template)))
      }
    }
  }

  if (!found) {
    return { error: 'Input must have at least one payment array (CreatePayments, CapturePayments, RefundPayments, or CancelPayment) with at least one entry' }
  }

  return result
}

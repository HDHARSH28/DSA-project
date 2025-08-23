export function normalizeData(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      type: 'Array',
      values: [],
      metrics: { opTimeMs: 0, morphCount: 0 },
      logs: []
    }
  }
  const type = raw.type || 'Array'
  const values = Array.isArray(raw.values) ? raw.values : []
  const metrics = raw.metrics || { opTimeMs: 0, morphCount: 0 }
  const logs = Array.isArray(raw.logs) ? raw.logs : []
  return { type, values, metrics, logs }
}

export function toBSTTree(values) {
  // Build a BST from values for demo; assumes numbers
  if (!Array.isArray(values) || values.length === 0) return null
  const insert = (node, val) => {
    if (!node) return { name: String(val) }
    const nval = Number(node.name)
    if (val < nval) node.children = [insert(node.children?.[0], val), node.children?.[1]].filter(Boolean)
    else node.children = [node.children?.[0], insert(node.children?.[1], val)].filter(Boolean)
    return node
  }
  return values.reduce((root, v) => insert(root, Number(v)), null)
}

export const DS_TYPES = ['Array', 'LinkedList', 'BST', 'HashMap']

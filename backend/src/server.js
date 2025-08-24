import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load env
dotenv.config()

// Helpers
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')
const LOG_FILE = path.join(DATA_DIR, 'history.log')

// Ensure data dir exists
fs.mkdirSync(DATA_DIR, { recursive: true })

// Data Structures
class ArrayDS {
  constructor(items = []) { this.items = items.slice() }
  insert(v) { this.items.push(v); return true }
  delete(v) {
    const i = this.items.indexOf(v)
    if (i >= 0) { this.items.splice(i, 1); return true }
    return false
  }
  find(v) { return this.items.includes(v) }
  display() { return this.items.slice() }
}

class LLNode { constructor(v, next = null) { this.v = v; this.next = next } }
class LinkedListDS {
  constructor(items = []) { this.head = null; for (const v of items) this.insert(v) }
  insert(v) {
    if (!this.head) { this.head = new LLNode(v); return true }
    let cur = this.head; while (cur.next) cur = cur.next; cur.next = new LLNode(v); return true
  }
  delete(v) {
    let cur = this.head, prev = null
    while (cur) { if (cur.v === v) { if (prev) prev.next = cur.next; else this.head = cur.next; return true } prev = cur; cur = cur.next }
    return false
  }
  find(v) { let c = this.head; while (c) { if (c.v === v) return true; c = c.next } return false }
  display() { const out = []; let c = this.head; while (c) { out.push(c.v); c = c.next } return out }
}

class BSTNode { constructor(v) { this.v = v; this.left = null; this.right = null } }
class BSTDS {
  constructor(items = []) { this.root = null; for (const v of items) this.insert(v) }
  insert(v) {
    const node = new BSTNode(v)
    if (!this.root) { this.root = node; return true }
    let cur = this.root
    while (true) {
      if (v < cur.v) { if (!cur.left) { cur.left = node; return true } cur = cur.left }
      else { if (!cur.right) { cur.right = node; return true } cur = cur.right }
    }
  }
  delete(v) {
    const del = (node, v) => {
      if (!node) return [null, false]
      if (v < node.v) { const [l, ok] = del(node.left, v); node.left = l; return [node, ok] }
      if (v > node.v) { const [r, ok] = del(node.right, v); node.right = r; return [node, ok] }
      // found
      if (!node.left) return [node.right, true]
      if (!node.right) return [node.left, true]
      // two children: find inorder successor
      let p = node, s = node.right
      while (s.left) { p = s; s = s.left }
      node.v = s.v
      if (p.left === s) p.left = s.right; else p.right = s.right
      return [node, true]
    }
    const [nr, ok] = del(this.root, v); this.root = nr; return ok
  }
  find(v) { let c = this.root; while (c) { if (v === c.v) return true; c = v < c.v ? c.left : c.right } return false }
  inorder(node = this.root, out = []) { if (!node) return out; this.inorder(node.left, out); out.push(node.v); this.inorder(node.right, out); return out }
  display() { return this.inorder() }
}

class HashMapDS {
  constructor(items = [], bucketCount = 8) { this.bucketCount = bucketCount; this.buckets = Array.from({ length: bucketCount }, () => []) ; for (const v of items) this.insert(v) }
  _idx(v) { return Math.abs(v) % this.bucketCount }
  insert(v) { const i = this._idx(v); if (!this.buckets[i].includes(v)) { this.buckets[i].push(v); return true } return false }
  delete(v) { const i = this._idx(v); const a = this.buckets[i]; const j = a.indexOf(v); if (j>=0){ a.splice(j,1); return true } return false }
  find(v) { const i = this._idx(v); return this.buckets[i].includes(v) }
  display() { return this.buckets.flat() }
}

// Conversions
function convert(values, fromType, toType) {
  const flat = Array.isArray(values) ? values.slice() : []
  const builders = {
    Array: () => new ArrayDS(flat),
    LinkedList: () => new LinkedListDS(flat),
    BST: () => new BSTDS(flat),
    HashMap: () => new HashMapDS(flat)
  }
  const inst = builders[toType] ? builders[toType]() : builders.Array()
  return inst
}

// Persistence
function saveDB(type, dsInst) {
  const payload = { type, data: serialize(type, dsInst), savedAt: new Date().toISOString() }
  fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8')
}
function serialize(type, dsInst) {
  switch (type) {
    case 'Array': return dsInst.display()
    case 'LinkedList': return dsInst.display()
    case 'BST':
      // store exact BST shape to keep structure intact
      const toObj = (n) => n ? { v: n.v, left: toObj(n.left), right: toObj(n.right) } : null
      return toObj(dsInst.root)
    case 'HashMap': return { bucketCount: dsInst.bucketCount, buckets: dsInst.buckets }
    default: return dsInst.display()
  }
}
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return null
    const payload = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
    const { type, data } = payload || {}
    switch (type) {
      case 'Array': return { type, inst: new ArrayDS(Array.isArray(data) ? data : []) }
      case 'LinkedList': return { type, inst: new LinkedListDS(Array.isArray(data) ? data : []) }
      case 'BST':
        const build = (o) => o ? ( (n => { n.left = build(o.left); n.right = build(o.right); return n })(new BSTNode(o.v)) ) : null
        const tree = { root: build(data) }
        const bst = new BSTDS(); bst.root = tree.root; return { type, inst: bst }
      case 'HashMap':
        const hm = new HashMapDS([], data?.bucketCount || 8)
        if (Array.isArray(data?.buckets)) hm.buckets = data.buckets
        return { type, inst: hm }
      default:
        return null
    }
  } catch (e) {
    return null
  }
}

function appendLog(line) {
  const stamped = `[${new Date().toISOString().replace('T', ' ').slice(0,19)}] ${line}\n`
  fs.appendFile(LOG_FILE, stamped, () => {})
}

// In-memory active structure
const VALID_TYPES = ['Array', 'LinkedList', 'BST', 'HashMap']
let activeType = 'Array'
let ds = new ArrayDS()
let metrics = { opTimeMs: 0, morphCount: 0 }

// Load from disk if present
const loaded = loadDB()
if (loaded) { activeType = loaded.type; ds = loaded.inst; appendLog(`Startup: Loaded ${activeType} from db.json`) }
else { appendLog('Startup: Fresh state (no db.json)') }

// Server
const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.get('/api/data', (_req, res) => {
  // Provide a normalized shape for frontend, but keep values as display() for visualization
  let values
  if (activeType === 'BST') values = ds.inorder()
  else if (activeType === 'HashMap') values = ds.display()
  else values = ds.display()
  res.json({ type: activeType, values, metrics })
})

app.post('/api/op', (req, res) => {
  const start = Date.now()
  const { op, value, forceType } = req.body || {}
  let v = value
  if (v !== undefined && v !== null) v = Number(v)
  const ts = () => new Date().toISOString().replace('T', ' ').slice(0,19)

  // handle conversion
  if (forceType && VALID_TYPES.includes(forceType) && forceType !== activeType) {
    // Convert based on current display values to preserve content; structure-specific fields preserved by serialize/load cycle
    const currentValues = ds.display()
    ds = convert(currentValues, activeType, forceType)
    appendLog(`${ts()} Morph to ${forceType} – Success`)
    activeType = forceType
    metrics.morphCount++
    saveDB(activeType, ds)
  }

  let ok = true
  let found = false
  if (op === 'Insert' && Number.isFinite(v)) ok = ds.insert(v)
  else if (op === 'Delete' && Number.isFinite(v)) ok = ds.delete(v)
  else if (op === 'Find' && Number.isFinite(v)) { found = ds.find(v); ok = true }
  else if (op === 'Display') { /* no-op */ }
  else { ok = false }

  metrics.opTimeMs = Date.now() - start

  // Persist and log
  saveDB(activeType, ds)
  if (op === 'Find') appendLog(`${ts()} Find ${v} in ${activeType} – ${found ? 'Found' : 'Not Found'}`)
  else if (op) appendLog(`${ts()} ${op}${Number.isFinite(v) ? ' ' + v : ''} in ${activeType} – ${ok ? 'Success' : 'Failed'}`)

  // Respond
  const values = ds.display()
  res.json({ type: activeType, values, metrics })
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})

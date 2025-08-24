import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { runCppOp } from './toCpp.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// In-memory state (JS fallback if no C++ wrapper configured)
let state = {
  type: 'Array',
  values: [1, 2, 3, 4],
  metrics: { opTimeMs: 12, morphCount: 0 },
  logs: ['Initialized']
}

// Helper to simulate op time
function withTiming(handler) {
  return (req, res) => {
    const start = Date.now()
    handler(req, res, () => {
      const dur = Date.now() - start
      state.metrics.opTimeMs = dur
    })
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.get('/api/data', (req, res) => {
  res.json(state)
})

app.post('/api/op', withTiming(async (req, res, done) => {
  const { op, value, forceType } = req.body || {}
  const validTypes = ['Array', 'LinkedList', 'BST', 'HashMap']
  const now = () => new Date().toLocaleTimeString()

  if (forceType && validTypes.includes(forceType)) {
    if (state.type !== forceType) {
      state.type = forceType
      state.metrics.morphCount++
      state.logs.unshift(`${now()} - Morph to ${forceType}`)
    }
  }

  const v = value !== undefined && value !== null ? Number(value) : undefined

  let usedCpp = false
  try {
    // Try delegating to external C++ wrapper if configured
    const cppResult = await runCppOp({
      type: state.type,
      values: state.values,
      op,
      value: Number.isFinite(v) ? v : undefined
    })
    if (cppResult) {
      usedCpp = true
      if (Array.isArray(cppResult.values)) {
        state.values = cppResult.values.map(Number).filter(n => Number.isFinite(n))
      }
      if (cppResult.type && validTypes.includes(cppResult.type)) {
        if (cppResult.type !== state.type) {
          state.metrics.morphCount++
          state.logs.unshift(`${now()} - Morph to ${cppResult.type}`)
        }
        state.type = cppResult.type
      }
      if (cppResult.log) state.logs.unshift(`${now()} - ${cppResult.log}`)
    }
  } catch (e) {
    // ignore and fall back
  }

  if (!usedCpp && op) {
    // JS fallback behavior mirrors previous demo
    if (op === 'Insert' && Number.isFinite(v)) {
      state.values.push(v)
      state.logs.unshift(`${now()} - Insert ${v}`)
    } else if (op === 'Delete' && Number.isFinite(v)) {
      const idx = state.values.indexOf(v)
      if (idx >= 0) {
        state.values.splice(idx, 1)
        state.logs.unshift(`${now()} - Delete ${v}`)
      } else {
        state.logs.unshift(`${now()} - Delete ${v} (not found)`)
      }
    } else if (op === 'Find' && Number.isFinite(v)) {
      const found = state.values.includes(v)
      state.logs.unshift(`${now()} - Find ${v}: ${found ? 'found' : 'not found'}`)
    }
  }

  done()
  res.json(state)
}))

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})

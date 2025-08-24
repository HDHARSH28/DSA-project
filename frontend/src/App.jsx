import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ArrayView from './components/ArrayView'
import LinkedListView from './components/LinkedListView'
import BSTView from './components/BSTView'
import HashMapView from './components/HashMapView'
import { DS_TYPES, normalizeData } from './utils'

const POLL_MS = 1000

export default function App() {
  const [raw, setRaw] = useState(null)
  const [error, setError] = useState('')
  const [forceType, setForceType] = useState('')
  const [logs, setLogs] = useState([])
  const [metrics, setMetrics] = useState({ opTimeMs: 0, morphCount: 0 })
  const [opInput, setOpInput] = useState('')
  const timerRef = useRef(null)

  const fetchData = useCallback(async () => {
    try {
      // Try backend first, then fallback to static file
      let res = await fetch('/api/data?_=' + Date.now(), { cache: 'no-store' })
      if (!res.ok) throw new Error('Backend error ' + res.status)
      const data = await res.json()
      setRaw(data)
      const n = normalizeData(data)
      setMetrics(n.metrics)
      setLogs((prev) => (n.logs?.length ? n.logs : prev))
      setError('')
    } catch (e) {
      try {
        const res2 = await fetch('/data.json?_=' + Date.now(), { cache: 'no-store' })
        if (!res2.ok) throw new Error('Network error ' + res2.status)
        const data2 = await res2.json()
        setRaw(data2)
        const n2 = normalizeData(data2)
        setMetrics(n2.metrics)
        setLogs((prev) => (n2.logs?.length ? n2.logs : prev))
        setError('Using static data.json (backend not running?)')
      } catch (e2) {
        setError(String(e2))
      }
    }
  }, [])

  useEffect(() => {
    fetchData()
    timerRef.current = setInterval(fetchData, POLL_MS)
    return () => clearInterval(timerRef.current)
  }, [fetchData])

  const n = useMemo(() => normalizeData(raw), [raw])
  const type = forceType || n.type
  const values = n.values

  const handleOp = async (op) => {
    const val = opInput.trim()
    // Optimistic log
    setLogs((prev) => [
      `${new Date().toLocaleTimeString()} - ${op}${val ? ' ' + val : ''}`,
      ...prev
    ].slice(0, 100))

    // Send to backend if available
    try {
      await fetch('/api/op', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op, value: val ? Number(val) : undefined, forceType: forceType || undefined })
      })
    } catch {}
    fetchData()
  }

  const renderView = () => {
    switch (type) {
      case 'Array':
        return <ArrayView values={values} />
      case 'LinkedList':
        return <LinkedListView values={values} />
      case 'BST':
        return <BSTView values={values} />
      case 'HashMap':
        return <HashMapView values={values} />
      default:
        return <div className="text-gray-600">Unknown type: {String(type)}</div>
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-indigo-700">Morphing Data Structure Visualizer</h1>
            <div className="text-xs text-gray-500">Type: <span className="font-medium">{type}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="border rounded-md px-2 py-1 text-sm"
              placeholder="value"
              value={opInput}
              onChange={(e) => setOpInput(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => handleOp('Insert')}>Insert</button>
            <button className="btn btn-secondary" onClick={() => handleOp('Delete')}>Delete</button>
            <button className="btn btn-secondary" onClick={() => handleOp('Find')}>Find</button>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={forceType}
              onChange={(e) => setForceType(e.target.value)}
            >
              <option value="">Force Morph To…</option>
              {DS_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card p-4 min-h-[420px]">
          {renderView()}
        </section>
        <aside className="flex flex-col gap-4">
          <div className="card p-4">
            <h2 className="font-semibold mb-2">Metrics</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Operation time: <span className="font-medium">{metrics.opTimeMs} ms</span></div>
              <div>Morph count: <span className="font-medium">{metrics.morphCount}</span></div>
            </div>
          </div>
          <div className="card p-4">
            <h2 className="font-semibold mb-2">Log History</h2>
            <div className="max-h-72 overflow-auto text-sm">
              <ul className="list-disc pl-5 space-y-1">
                {logs.map((line, idx) => (
                  <li key={idx} className="text-gray-700">{line}</li>
                ))}
              </ul>
            </div>
          </div>
          {error && (
            <div className="card p-3 text-sm text-red-600">{String(error)}</div>
          )}
        </aside>
      </main>
    </div>
  )
}

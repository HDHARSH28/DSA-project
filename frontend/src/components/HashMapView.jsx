import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HashMapView({ values, bucketCount = 5 }) {
  const buckets = useMemo(() => {
    const map = Array.from({ length: bucketCount }, () => [])
    for (const v of values || []) {
      const idx = Math.abs(Number(v)) % bucketCount
      map[idx].push(v)
    }
    return map
  }, [values, bucketCount])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {buckets.map((list, i) => (
        <div key={i} className="card p-3">
          <div className="text-sm text-gray-600 mb-2">Bucket {i}</div>
          <div className="flex gap-2 items-center overflow-x-auto">
            <AnimatePresence initial={false}>
              {list.map((v, idx) => (
                <motion.div
                  key={String(v) + '-' + idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                  className="card min-w-[48px] h-12 flex items-center justify-center"
                >
                  <div className="font-medium">{v}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  )
}

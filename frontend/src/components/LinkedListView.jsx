import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Arrow() {
  return (
  <svg width="40" height="24" viewBox="0 0 40 24" className="text-stone-500">
      <line x1="0" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="2"/>
      <polygon points="30,6 30,18 40,12" fill="currentColor" />
    </svg>
  )
}

export default function LinkedListView({ values }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-2">
        <AnimatePresence initial={false}>
          {values.map((v, idx) => (
            <React.Fragment key={String(v) + '-' + idx}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                className="card w-20 h-20 flex items-center justify-center"
              >
                <div className="text-lg font-semibold text-stone-100">{v}</div>
              </motion.div>
              {idx < values.length - 1 && <Arrow />}
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

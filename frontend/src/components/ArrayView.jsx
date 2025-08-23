import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ArrayView({ values }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 items-center">
        <AnimatePresence initial={false}>
          {values.map((v, idx) => (
            <motion.div
              key={String(v) + '-' + idx}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="card min-w-[60px] h-16 flex items-center justify-center px-3"
            >
              <div className="text-lg font-semibold">{v}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

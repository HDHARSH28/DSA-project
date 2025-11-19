import React from "react";
import { motion } from "framer-motion";

export default function HashTableView({ values = [] }) {
  if (!values || values.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="w-16 h-16 text-stone-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-stone-500 text-sm">Hash Table is empty</p>
        </div>
      </div>
    );
  }

  // Create hash buckets for visualization
  const buckets = 8; // Number of hash buckets to display
  const hashMap = new Map();
  
  values.forEach((value) => {
    const hashIndex = Math.abs(value % buckets);
    if (!hashMap.has(hashIndex)) {
      hashMap.set(hashIndex, []);
    }
    hashMap.get(hashIndex).push(value);
  });

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          <span className="text-sm font-semibold text-stone-300">
            Hash Table ({values.length} items)
          </span>
        </div>
        <span className="text-xs text-stone-500">
          O(1) average lookup
        </span>
      </div>

      <div className="space-y-3">
        {Array.from({ length: buckets }, (_, i) => i).map((bucketIndex) => {
          const items = hashMap.get(bucketIndex) || [];
          
          return (
            <motion.div
              key={bucketIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: bucketIndex * 0.05 }}
              className="flex items-center gap-3"
            >
              {/* Bucket Index */}
              <div className="flex-shrink-0 w-16">
                <div className="h-10 rounded-lg bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center">
                  <span className="text-sm font-mono font-bold text-indigo-300">
                    [{bucketIndex}]
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <svg className="w-6 h-6 text-stone-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>

              {/* Items in Bucket */}
              <div className="flex-1 min-w-0">
                {items.length === 0 ? (
                  <div className="h-10 rounded-lg bg-stone-800/50 border border-stone-700/50 flex items-center justify-center">
                    <span className="text-xs text-stone-600">empty</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {items.map((value, idx) => (
                      <motion.div
                        key={`${bucketIndex}-${idx}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: bucketIndex * 0.05 + idx * 0.02 }}
                        className="h-10 px-4 rounded-lg bg-gradient-to-br from-cyan-600/40 to-blue-600/40 border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-500/10"
                      >
                        <span className="text-sm font-mono font-bold text-cyan-100">
                          {value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Collision Count */}
              {items.length > 1 && (
                <div className="flex-shrink-0">
                  <span className="px-2 py-1 rounded-md bg-amber-600/30 border border-amber-500/50 text-xs font-semibold text-amber-300">
                    {items.length} collision{items.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-stone-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500 mb-1">Total Items</div>
            <div className="text-lg font-bold text-cyan-300">{values.length}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500 mb-1">Buckets Used</div>
            <div className="text-lg font-bold text-purple-300">{hashMap.size}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500 mb-1">Load Factor</div>
            <div className="text-lg font-bold text-indigo-300">
              {(values.length / buckets).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

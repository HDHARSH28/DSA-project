import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function AnimatedArrow({ index }) {
  return (
    <motion.svg
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleX: 0 }}
      transition={{ 
        delay: index * 0.1 + 0.2,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      width="50"
      height="24"
      viewBox="0 0 50 24"
      className="text-emerald-400/60"
      aria-label="Arrow"
    >
      <motion.line
        x1="0"
        y1="12"
        x2="40"
        y2="12"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="4 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      />
      <motion.polygon
        points="35,6 35,18 48,12"
        fill="currentColor"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.4 }}
      />
    </motion.svg>
  );
}

// Note: This component always receives an array for rendering, not a true linked list structure.
export default function LinkedListView({ values }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const nodeVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.4,
      x: -30 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 18
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.4,
      x: 30,
      transition: {
        duration: 0.25
      }
    }
  };

  return (
    <div 
      className="w-full overflow-x-auto py-4 -mx-2 px-2 sm:mx-0 sm:px-0" 
      aria-label="Linked List Visualization"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin'
      }}
    >
      <AnimatePresence mode="popLayout">
        {Array.isArray(values) && values.length > 0 ? (
          <motion.div
            className="flex items-center gap-1 min-w-max pb-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {values.map((v, idx) => (
              <React.Fragment key={`${v}-${idx}`}>
                <motion.div
                  variants={nodeVariants}
                  layout
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -3, 3, 0],
                    transition: { duration: 0.4 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <motion.div
                    className="w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl shadow-xl relative overflow-visible cursor-pointer border-2 touch-manipulation"
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      borderColor: "rgba(16, 185, 129, 0.3)"
                    }}
                    whileHover={{
                      boxShadow: "0 10px 50px rgba(16, 185, 129, 0.4)"
                    }}
                  >
                    {/* Animated background pulse */}
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Node label */}
                    <span className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-100 text-[10px] sm:text-xs font-semibold shadow-md whitespace-nowrap z-20">
                      Node {idx}
                    </span>

                    {/* Data section */}
                    <div className="relative z-10 text-center">
                      <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                        {v}
                      </span>
                    </div>

                    {/* Next pointer indicator */}
                    <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-700 flex items-center justify-center">
                      <span className="text-white text-[9px] sm:text-[10px] font-bold">→</span>
                    </div>

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>

                {idx < values.length - 1 && <AnimatedArrow index={idx} />}
              </React.Fragment>
            ))}

            {/* NULL terminator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: values.length * 0.1 + 0.3,
                type: "spring",
                stiffness: 200
              }}
              className="ml-1 sm:ml-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-stone-700/50 border-2 border-dashed border-stone-600 text-stone-400 font-mono text-xs sm:text-sm"
            >
              NULL
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center p-6 sm:p-8 rounded-xl bg-stone-800/30 border-2 border-dashed border-stone-700"
          >
            <div className="text-center">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="text-stone-400 font-medium text-sm sm:text-base">Linked List is empty</p>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">Add nodes to see the visualization</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

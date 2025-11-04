import { motion, AnimatePresence } from "framer-motion";

// Note: This component always receives the array for rendering.
export default function ArrayView({ values }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.6,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div
      className="w-full overflow-x-auto py-4 -mx-2 px-2 sm:mx-0 sm:px-0"
      aria-label="Array Visualization"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin'
      }}
    >
      <AnimatePresence mode="popLayout">
        {Array.isArray(values) && values.length > 0 ? (
          <motion.div
            className="flex gap-2 sm:gap-3 items-center min-w-max pb-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {values.map((v, idx) => (
              <motion.div
                key={`${v}-${idx}`}
                variants={itemVariants}
                layout
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -2, 2, -2, 0],
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <motion.div
                  className="min-w-[60px] sm:min-w-[70px] h-16 sm:h-20 flex flex-col items-center justify-center px-3 sm:px-4 rounded-lg sm:rounded-xl shadow-lg relative overflow-visible cursor-pointer touch-manipulation"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  whileHover={{
                    boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500"
                    style={{
                      transform: "translateX(-100%)",
                      animation: "shimmer 2s infinite",
                    }}
                  ></div>

                  {/* Index label */}
                  <span className="absolute top-0.5 sm:top-1 left-1.5 sm:left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-700 text-white text-[10px] sm:text-[11px] font-semibold flex items-center justify-center shadow-md z-20">
                    {idx}
                  </span>

                  {/* Value */}
                  <span className="text-xl sm:text-2xl font-bold text-white relative z-10 drop-shadow-lg">
                    {v}
                  </span>
                </motion.div>

                {/* Connecting line to next element */}
                {idx < values.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: idx * 0.05 + 0.2, duration: 0.3 }}
                    className="absolute top-1/2 -right-2 sm:-right-3 w-2 sm:w-3 h-0.5 bg-gradient-to-r from-purple-400 to-transparent origin-left"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center p-6 sm:p-8 rounded-xl bg-stone-800/30 border-2 border-dashed border-stone-700"
          >
            <div className="text-center">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-stone-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-stone-400 font-medium text-sm sm:text-base">Array is empty</p>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Add elements to see the visualization
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

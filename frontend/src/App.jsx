import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaticView from "./Static";
import DynamicView from "./Dynamic";

function App() {
  const [mode, setMode] = useState("static");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-indigo-950 text-stone-100 flex overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 border-b border-stone-800/50 bg-stone-950/70 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button aria-label="Open menu" onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg border border-stone-700/60 bg-stone-900/60 hover:bg-stone-800 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-stone-300">Menu</span>
        </div>
        <span className="text-sm text-stone-400 capitalize">{mode} mode</span>
      </div>

      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 h-full w-64 border-r border-stone-800/50 backdrop-blur-xl bg-stone-950/40 p-6 flex flex-col gap-6 shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                DS Visualizer
              </h1>
              <p className="text-xs text-stone-400">Interactive Explorer</p>
            </div>
          </div>
        </motion.div>

        {/* Close on Mobile */}
        <div className="lg:hidden -mt-2 -mb-2">
          <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="px-3 py-2 rounded-lg border border-stone-700/60 bg-stone-900/60 hover:bg-stone-800 text-stone-300 text-xs font-medium transition">
            Close
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Mode</p>
          
          <motion.button
            onClick={() => setMode("static")}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
              mode === "static"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-stone-800/50 text-stone-300 hover:bg-stone-800 border border-stone-700/50"
            }`}
          >
            {mode === "static" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className="relative flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span>Static Mode</span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setMode("dynamic")}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
              mode === "dynamic"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-stone-800/50 text-stone-300 hover:bg-stone-800 border border-stone-700/50"
            }`}
          >
            {mode === "dynamic" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className="relative flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Dynamic Mode</span>
            </div>
          </motion.button>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-auto p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm"
        >
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-indigo-300 mb-1">Quick Tip</p>
              <p className="text-xs text-stone-400 leading-relaxed">
                {mode === "static" 
                  ? "Explore fixed data structures with manual operations." 
                  : "Watch structures morph dynamically based on operations!"}
              </p>
            </div>
          </div>
        </motion.div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10 custom-scrollbar w-full lg:ml-0 pt-16 lg:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {mode === "static" ? <StaticView /> : <DynamicView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

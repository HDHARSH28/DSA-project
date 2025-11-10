import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Build a simple inorder-based layout so left < parent < right horizontally
function computeLayout(root) {
  if (!root) return { nodes: [], links: [] };

  const nodes = [];
  const links = [];
  let xCounter = 0; // inorder position counter

  function dfs(node, depth, key) {
    if (!node) return;
    const leftKey = key + 'L';
    const rightKey = key + 'R';
    if (node.left) {
      links.push({ fromKey: key, toKey: leftKey });
      dfs(node.left, depth + 1, leftKey);
    }

    xCounter += 1;
    nodes.push({ key, value: node.value, depth, xIndex: xCounter });
    if (node.right) {
      links.push({ fromKey: key, toKey: rightKey });
      dfs(node.right, depth + 1, rightKey);
    }
  }

  dfs(root, 0, '0');

  const levelGapY = 110;
  const nodeGapX = 140;
  nodes.forEach((n) => {
    n.x = n.xIndex * nodeGapX;
    n.y = (n.depth + 1) * levelGapY;
  });

  const keyToIndex = new Map();
  nodes.forEach((n, i) => keyToIndex.set(n.key, i));
  const builtLinks = links
    .map((l) => {
      const from = keyToIndex.get(l.fromKey);
      const to = keyToIndex.get(l.toKey);
      if (from == null || to == null) return null;
      return { from, to, key: `${l.fromKey}->${l.toKey}` };
    })
    .filter(Boolean);

  return { nodes, links: builtLinks };
}

function BSTView({ tree = null }) {
  const { nodes, links } = useMemo(() => computeLayout(tree), [tree]);

  const maxY = nodes.length ? Math.max(...nodes.map((n) => n.y)) : 0;
  const maxX = nodes.length ? Math.max(...nodes.map((n) => n.x)) : 0;
  const width = Math.max(640, maxX + 96);
  const height = Math.max(300, maxY + 96);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, when: 'beforeChildren' },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    show: { 
      opacity: 1, 
      pathLength: 1,
      transition: {
        pathLength: { duration: 0.6, ease: 'easeInOut' },
        opacity: { duration: 0.3 }
      }
    },
    exit: { 
      opacity: 0, 
      pathLength: 0,
      transition: { duration: 0.3 }
    },
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.3 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.3,
      transition: { duration: 0.25 }
    },
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          Binary Search Tree
        </h2>
        {nodes.length > 0 && (
          <div className="flex gap-2">
            <span className="badge badge-primary">
              {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'}
            </span>
            <span className="badge badge-warning">
              Height: {maxY > 0 ? Math.ceil(maxY / 110) : 0}
            </span>
          </div>
        )}
      </div>
      
      {!tree ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-12 rounded-xl bg-stone-800/30 border-2 border-dashed border-stone-700"
        >
          <div className="text-center">
            <svg className="w-20 h-20 mx-auto mb-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-stone-400 font-medium text-lg">BST is empty</p>
            <p className="text-stone-500 text-sm mt-1">Insert nodes to build the tree</p>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-xl bg-gradient-to-br from-stone-800/40 to-stone-900/40 p-6 border border-stone-700/50 overflow-x-auto">
          <svg
            width={width}
            height={height}
            className="rounded-lg mx-auto"
            viewBox={`0 0 ${width} ${height}`}
          >
            {/* Glow definition */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>

            {/* Links */}
            <motion.g variants={containerVariants} initial="hidden" animate="show">
              <AnimatePresence>
                {links.map((l) => (
                  <motion.path
                    key={l.key}
                    d={`M ${nodes[l.from].x} ${nodes[l.from].y} L ${nodes[l.to].x} ${nodes[l.to].y}`}
                    variants={linkVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    stroke="url(#linkGradient)"
                    strokeWidth="4"
                    strokeLinecap="round" 
                    fill="none"
                    style={{ pathLength: 1 }}
                  />
                ))}
              </AnimatePresence>
            </motion.g>

            {/* Nodes */}
            <motion.g variants={containerVariants} initial="hidden" animate="show">
              <AnimatePresence>
                {nodes.map((n, idx) => (
                  <motion.g
                    key={n.key}
                    variants={nodeVariants}
                    initial={{ ...nodeVariants.hidden, x: n.x, y: n.y - 20 }}
                    animate={{ ...nodeVariants.show, x: n.x, y: n.y }}
                    exit={nodeVariants.exit}
                    style={{ cursor: 'pointer' }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Outer glow circle */}
                    <motion.circle
                      r="28"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      opacity="0.3"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [0.8, 1.1, 0.8],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.1
                      }}
                    />

                    {/* Main node circle with gradient */}
                    <motion.circle
                      r="24"
                      initial={{ fill: '#fbbf24' }}
                      animate={{ fill: '#f59e0b' }}
                      transition={{ duration: 0.5 }}
                      filter="url(#glow)"
                      style={{
                        filter: 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.4))'
                      }}
                    />

                    {/* Inner highlight */}
                    <motion.circle
                      r="24"
                      fill="url(#nodeGradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <defs>
                        <radialGradient id={`nodeGradient-${n.key}`}>
                          <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                        </radialGradient>
                      </defs>
                    </motion.circle>

                    {/* Value text */}
                    <motion.text
                      textAnchor="middle"
                      dy="7"
                      fontWeight="800"
                      fontSize="18"
                      fill="#292524"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                    >
                      {n.value}
                    </motion.text>

                    {/* Depth indicator */}
                    <motion.text
                      textAnchor="middle"
                      dy="-32"
                      fontSize="11"
                      fontWeight="600"
                      fill="#78716c"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 0.3 }}
                    >
                      L{n.depth}
                    </motion.text>
                  </motion.g>
                ))}
              </AnimatePresence>
            </motion.g>
          </svg>
        </div>
      )}
    </div>
  );
}

export default BSTView;


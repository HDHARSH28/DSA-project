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

  const levelGapY = 96;
  const nodeGapX = 140; // increased spacing to differentiate children
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
  const height = Math.max(240, maxY + 72);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, when: 'beforeChildren' },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    show: { opacity: 1, pathLength: 1 },
    exit: { opacity: 0, pathLength: 0 },
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.6 },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-indigo-300">BST Visualizer</h2>
      {!tree ? (
        <div className="text-stone-400">(empty)</div>
      ) : (
        <svg
          width={width}
          height={height}
          className="rounded w-full"
          viewBox={`0 0 ${width} ${height}`}
        >
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
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  stroke="#333"
                  strokeWidth="3"
                  fill="none"
                  style={{ pathLength: 1 }}
                />
              ))}
            </AnimatePresence>
          </motion.g>

          <motion.g variants={containerVariants} initial="hidden" animate="show">
            <AnimatePresence>
              {nodes.map((n) => (
                <motion.g
                  key={n.key}
                  variants={nodeVariants}
                  initial={{ ...nodeVariants.hidden, x: n.x, y: n.y - 16 }}
                  animate={{ ...nodeVariants.show, x: n.x, y: n.y }}
                  exit={nodeVariants.exit}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  style={{ cursor: 'default' }}
                  whileHover={{ scale: 1.08 }}
                >
                  <motion.circle
                    r="18"
                    initial={{ r: 14, fill: '#e6e6ff', stroke: '#4f46e5' }}
                    animate={{ r: 18, fill: '#f4f4f4', stroke: '#333' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    strokeWidth="4"
                  />
                  <motion.text
                    textAnchor="middle"
                    dy="6"
                    fontWeight="700"
                    initial={{ fill: '#4f46e5' }}
                    animate={{ fill: '#333' }}
                    transition={{ duration: 0.4 }}
                  >
                    {n.value}
                  </motion.text>
                </motion.g>
              ))}
            </AnimatePresence>
          </motion.g>
        </svg>
      )}
    </div>
  );
}

export default BSTView;


import React, { useMemo } from 'react';

// Compute simple layered tree layout (x by BFS order, y by depth)
function computeLayout(root) {
  if (!root) return { nodes: [], links: [] };
  const nodes = [];
  const links = [];
  const queue = [{ node: root, depth: 0, pos: 0 }];
  const depthToCount = new Map();
  while (queue.length) {
    const { node, depth, pos } = queue.shift();
    const count = depthToCount.get(depth) || 0;
    depthToCount.set(depth, count + 1);
    nodes.push({ id: Symbol(), value: node.value, depth, pos });
    const parentIndex = nodes.length - 1;
    if (node.left) {
      links.push({ parent: parentIndex, childOffset: nodes.length });
      queue.push({ node: node.left, depth: depth + 1, pos: pos * 2 });
    }
    if (node.right) {
      links.push({ parent: parentIndex, childOffset: nodes.length + (node.left ? 1 : 0) });
      queue.push({ node: node.right, depth: depth + 1, pos: pos * 2 + 1 });
    }
  }
  // Assign x positions within each depth evenly by inorder index approximation
  const depthToNodes = new Map();
  nodes.forEach((n, i) => {
    if (!depthToNodes.has(n.depth)) depthToNodes.set(n.depth, []);
    depthToNodes.get(n.depth).push({ ...n, index: i });
  });
  const levelGapY = 90;
  const nodeGapX = 80;
  depthToNodes.forEach((arr) => {
    arr.sort((a, b) => a.pos - b.pos);
    arr.forEach((n, i) => {
      nodes[n.index].x = (i + 1) * nodeGapX;
      nodes[n.index].y = (n.depth + 1) * levelGapY;
    });
  });
  // Fix links target indices now that nodes order is final
  const valueToIndicesByDepthPos = new Map();
  nodes.forEach((n, i) => {
    valueToIndicesByDepthPos.set(`${n.depth}:${n.pos}:${n.value}`, i);
  });
  // Rebuild links by traversing again to know child indices
  const rebuiltLinks = [];
  function walk(node, parentIndex) {
    if (!node) return;
    const selfIndex = nodes.findIndex((n) => n.value === node.value && (parentIndex === undefined || Math.abs(n.depth - (nodes[parentIndex]?.depth ?? -1)) <= 1));
    if (node.left) {
      const childIndex = nodes.findIndex((n) => n.value === node.left.value && n.depth === nodes[selfIndex].depth + 1);
      rebuiltLinks.push({ from: selfIndex, to: childIndex });
      walk(node.left, selfIndex);
    }
    if (node.right) {
      const childIndex = nodes.findIndex((n) => n.value === node.right.value && n.depth === nodes[selfIndex].depth + 1);
      rebuiltLinks.push({ from: selfIndex, to: childIndex });
      walk(node.right, selfIndex);
    }
  }
  walk(root, undefined);
  return { nodes, links: rebuiltLinks };
}

function BSTView({ values = [], tree = null }) {
  const { nodes, links } = useMemo(() => computeLayout(tree), [tree]);
  const width = Math.max(600, nodes.length * 80);
  const height = Math.max(220, (Math.max(0, ...nodes.map(n => n.y)) + 60));

  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-indigo-300">BST Visualizer</h2>
      {!tree ? (
        <div className="text-stone-400">(empty)</div>
      ) : (
        <svg width={width} height={height} className="bg-stone-100 rounded w-full" viewBox={`0 0 ${width} ${height}`}>
          {links.map((l, i) => (
            <line key={i} x1={nodes[l.from].x} y1={nodes[l.from].y} x2={nodes[l.to].x} y2={nodes[l.to].y} stroke="#333" strokeWidth="3" />
          ))}
          {nodes.map((n, i) => (
            <g key={i} transform={`translate(${n.x}, ${n.y})`}>
              <circle r="18" fill="#f4f4f4" stroke="#333" strokeWidth="4" />
              <text textAnchor="middle" dy="6" fontWeight="700" fill="#333">{n.value}</text>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

export default BSTView;

import React, { useMemo, useRef, useEffect, useState } from 'react'
import Tree from 'react-d3-tree'
import { toBSTTree } from '../utils'

export default function BSTView({ values }) {
  const data = useMemo(() => toBSTTree(values) || { name: '∅' }, [values])
  const containerRef = useRef(null)
  const [size, setSize] = useState({ width: 400, height: 300 })

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        setSize({ width: e.contentRect.width, height: Math.max(260, e.contentRect.height) })
      }
    })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
  <div ref={containerRef} className="w-full h-[360px] card p-2 overflow-hidden">
      <Tree
        data={data}
        translate={{ x: size.width / 2, y: 60 }}
        separation={{ siblings: 1.2, nonSiblings: 1.6 }}
        zoom={0.8}
        orientation="vertical"
        pathFunc="elbow"
  styles={{ links: { stroke: '#475569' }, nodes: { node: { circle: { fill: '#4f46e5' } } } }}
        renderCustomNodeElement={({ nodeDatum }) => (
          <g>
            <circle r={16} fill="#4f46e5" />
            <text fill="#fff" strokeWidth="0.5" x={-String(nodeDatum.name).length * 3.5} y={5}>
              {nodeDatum.name}
            </text>
          </g>
        )}
      />
    </div>
  )
}

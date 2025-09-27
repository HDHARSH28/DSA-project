import React from "react";

export default function DynamicView() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-purple-300">Dynamic Mode</h1>
      <p className="text-stone-300 mb-4 text-sm">Dynamic visualizations will go here.</p>
      <div className="p-4 rounded border border-dashed border-stone-700 bg-stone-800/40 text-stone-400 text-sm">
        Coming soon: animations, step-by-step traversals, comparisons.
      </div>
    </div>
  );
}

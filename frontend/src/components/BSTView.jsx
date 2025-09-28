import React from 'react';

function BSTView({ values }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-indigo-300">BST Inorder Traversal</h2>
      <div className="flex flex-wrap gap-2">
        {values.length === 0 ? (
          <span className="text-stone-400">(empty)</span>
        ) : (
          values.map((v, i) => (
            <span key={i} className="px-3 py-1 bg-indigo-700 rounded text-white">{v}</span>
          ))
        )}
      </div>
    </div>
  );
}

export default BSTView;

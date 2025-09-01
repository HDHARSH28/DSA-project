import React from "react";

function Arrow() {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" className="text-stone-500" aria-label="Arrow">
      <line x1="0" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="2"/>
      <polygon points="30,6 30,18 40,12" fill="currentColor" />
    </svg>
  );
}

// Note: This component always receives an array for rendering, not a true linked list structure.
export default function LinkedListView({ values }) {
  return (
    <div className="w-full overflow-x-auto" aria-label="Linked List Visualization">
      <div className="flex items-center gap-2">
        {Array.isArray(values) && values.length > 0 ? (
          values.map((v, idx) => (
            <React.Fragment key={idx}>
              <div
                className="card w-20 h-20 flex items-center justify-center bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
                aria-label={`Linked list node ${v}`}
              >
                <span className="text-lg font-semibold">{v}</span>
              </div>
              {idx < values.length - 1 && <Arrow />}
            </React.Fragment>
          ))
        ) : (
          <div className="text-gray-400 italic">Linked List is empty</div>
        )}
      </div>
    </div>
  );
}

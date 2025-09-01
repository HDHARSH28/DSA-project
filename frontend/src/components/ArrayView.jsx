// Note: This component always receives the array for rendering.
export default function ArrayView({ values }) {
  return (
    <div className="w-full overflow-x-auto" aria-label="Array Visualization">
      <div className="flex gap-2 items-center">
        {Array.isArray(values) && values.length > 0 ? (
          values.map((v, idx) => (
            <div
              key={idx}
              className="card min-w-[60px] h-16 flex items-center justify-center px-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
              aria-label={`Array element ${v}`}
            >
              <span className="text-lg font-semibold">{v}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-400 italic">Array is empty</div>
        )}
      </div>
    </div>
  );
}

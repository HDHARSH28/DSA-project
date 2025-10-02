import React, { useState, useEffect } from "react";

// Simple visualizer components for array, linked list, BST
function ArrayView({ values }) {
  return (
    <div className="flex gap-2 flex-wrap mt-2">
      {values.map((v, i) => (
        <div
          key={i}
          className="px-3 py-2 rounded bg-indigo-700/80 text-white font-mono"
        >
          {v}
        </div>
      ))}
    </div>
  );
}
function LinkedListView({ values }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mt-2">
      {values.map((v, i) => (
        <React.Fragment key={i}>
          <div className="px-3 py-2 rounded bg-purple-700/80 text-white font-mono">
            {v}
          </div>
          {i !== values.length - 1 && (
            <span className="text-purple-300 font-bold">&rarr;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
function BSTView({ values }) {
  // Just show in-order array for simplicity
  return (
    <div className="flex gap-2 flex-wrap mt-2">
      {values.map((v, i) => (
        <div
          key={i}
          className="px-3 py-2 rounded bg-green-700/80 text-white font-mono"
        >
          {v}
        </div>
      ))}
    </div>
  );
}

export default function DynamicView() {
  const [data, setData] = useState([]);
  const [dsType, setDsType] = useState("");
  const [input, setInput] = useState("");
  const [index, setIndex] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [opName, setOpName] = useState("");
  const [opDetail, setOpDetail] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all data on mount and after any operation
  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      // UPDATED: Use the new /dy/all endpoint
      const res = await fetch("http://localhost:3000/dy/all"); 
      const json = await res.json();
      setData(json.data);
      setDsType(json.type);
    } catch {
      setError("Failed to fetch data from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const recordEvent = (evt) => {
    if (!evt) return;
    setEvents((p) => [evt, ...p].slice(0, 200));
  };

  const handleInsert = async () => {
    if (input === "") {
      setError("Please enter a value");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // UPDATED: Use the new /dy/insert endpoint
      const res = await fetch("http://localhost:3000/dy/insert", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: isNaN(input) ? input : Number(input),
          index: index === "" ? undefined : Number(index),
        }),
      });
      const json = await res.json();
      setData(json.data);
      setDsType(json.type);
      setOpName("Insert");
      setOpDetail(
        index === ""
          ? `Inserted ${input} at end`
          : `Inserted ${input} at index ${index}`
      );
      recordEvent({
        op: "Insert",
        detail:
          index === ""
            ? `Inserted ${input} at end`
            : `Inserted ${input} at index ${index}`,
        array: json.data,
      });
      setInput("");
      setIndex("");
      setSearchResult(null);
    } catch {
      setError("Insert failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (index === "") {
      setError("Please enter an index to remove");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // UPDATED: Use the new /dy/remove endpoint
      const res = await fetch("http://localhost:3000/dy/remove", { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // Note: The backend uses a POST body even though the method is DELETE. 
        // We ensure the body is present for the index.
        body: JSON.stringify({ index: Number(index) }),
      });
      const json = await res.json();
      setData(json.data);
      setDsType(json.type);
      setOpName("Remove");
      setOpDetail(`Removed value at index ${index}`);
      recordEvent({
        op: "Remove",
        detail: `Removed value at index ${index}`,
        array: json.data,
      });
      setIndex("");
      setSearchResult(null);
    } catch {
      setError("Remove failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchValue === "") {
      setError("Please enter a value to search");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // UPDATED: Use the new /dy/search/:value endpoint
      const res = await fetch(
        `http://localhost:3000/dy/search/${encodeURIComponent(searchValue)}` 
      );
      const json = await res.json();
      setDsType(json.type);
      setOpName("Search");
      setOpDetail(
        json.found
          ? `Found ${searchValue} in structure`
          : `Did not find ${searchValue}`
      );
      setSearchResult(json.found);
      recordEvent({
        op: "Search",
        detail: json.found
          ? `Found ${searchValue} in structure`
          : `Did not find ${searchValue}`,
        array: data,
      });
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (direction) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/dy/sort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: direction }),
      });
      const json = await res.json();
      setData(json.data);
      setDsType(json.type);
      setOpName("Sort");
      setOpDetail(`Sorted ${json.order === "desc" ? "descending" : "ascending"}`);
      recordEvent({
        op: "Sort",
        detail: `Sorted ${json.order === "desc" ? "descending" : "ascending"}`,
        array: json.data,
      });
      setSearchResult(null);
    } catch {
      setError("Sort failed");
    } finally {
      setLoading(false);
    }
  };

  // Visualizer selection
  let Visualizer = ArrayView;
  if (dsType === "linkedlist") Visualizer = LinkedListView;
  if (dsType === "bst") Visualizer = BSTView;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-indigo-300">
        DS Visualizer (Dynamic)
      </h1>
      <div className="mb-4">
        <span className="font-semibold text-stone-300">Current Structure:</span>{" "}
        <span className="text-purple-200">{dsType}</span>
      </div>
      <div className="mb-6">
        <span className="font-semibold text-stone-300">Contents:</span>{" "}
        <span className="text-stone-200">{JSON.stringify(data)}</span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-900/30 border border-red-700 text-red-300">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {(opDetail || opName) && !error && (
        <div className="mb-4 p-3 rounded bg-stone-800 border border-stone-700">
          <span className="font-semibold text-indigo-400">Operation:</span>{" "}
          {opName && (
            <span className="font-mono text-xs bg-stone-700 px-2 py-0.5 rounded mr-2 text-indigo-300">
              {opName}
            </span>
          )}
          <span>{opDetail}</span>
        </div>
      )}

      <div className="mb-6 card bg-stone-800 p-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-stone-600 bg-stone-700 rounded-md px-3 py-2 text-stone-100 placeholder-stone-400 focus:border-indigo-500 focus:outline-none min-w-[120px]"
            placeholder="Value"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleInsert();
            }}
          />
          <input
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            className="border border-stone-600 bg-stone-700 rounded-md px-3 py-2 text-stone-100 placeholder-stone-400 focus:border-indigo-500 focus:outline-none min-w-[120px]"
            placeholder="Index (for insert/remove)"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleInsert();
            }}
          />
          <button
            onClick={handleInsert}
            className="btn btn-primary"
            disabled={loading}
            type="button"
          >
            Insert
          </button>
          <button
            onClick={handleRemove}
            className="btn btn-secondary"
            disabled={loading}
            type="button"
          >
            Remove
          </button>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border border-stone-600 bg-stone-700 rounded-md px-3 py-2 text-stone-100 placeholder-stone-400 focus:border-indigo-500 focus:outline-none min-w-[120px]"
            placeholder="Value to search"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="btn btn-secondary"
            disabled={loading}
            type="button"
          >
            Search
          </button>
          <button
            onClick={() => handleSort("asc")}
            className="btn btn-secondary"
            disabled={loading}
            type="button"
          >
            Sort Asc
          </button>
          <button
            onClick={() => handleSort("desc")}
            className="btn btn-secondary"
            disabled={loading}
            type="button"
          >
            Sort Desc
          </button>
        </div>
        <Visualizer values={data} />
        {searchResult !== null && !error && (
          <div className="mt-4 p-2 rounded bg-stone-700">
            <span className="font-semibold">Search Result: </span>
            <span className={searchResult ? "text-green-400" : "text-red-400"}>
              {searchResult ? "Found" : "Not Found"}
            </span>
          </div>
        )}
        {events.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-indigo-300">
              Event Log
            </h2>
            <div className="max-h-64 overflow-auto border border-stone-700 rounded bg-stone-900/40 text-sm divide-y divide-stone-800">
              {events.map((e, i) => (
                <div
                  key={i}
                  className="px-3 py-2 flex flex-col sm:flex-row sm:items-center gap-1"
                >
                  <span className="text-indigo-400 font-mono text-xs sm:text-[11px] tracking-wide">
                    {e.op}
                  </span>
                  <span className="flex-1 text-stone-300">{e.detail}</span>
                  <span className="text-stone-500 font-mono text-[10px] hidden md:inline">
                    [{e.array?.join(", ")}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import ArrayView from "./components/ArrayView.jsx";
import LinkedListView from "./components/LinkedListView.jsx";
import BSTView from "./components/BSTView.jsx";
import { dy_all, dy_insert, dy_remove, dy_search, dy_sort, dy_bulkAdd, dy_state, dy_clear } from "./utils.js";

// Utility: maps dsType to a component
const visualizerMap = {
  array: ArrayView,
  linkedlist: LinkedListView,
  bst: BSTView,
};

// Helper to coerce input string to number if numeric
const coerceValue = (val) => (val === "" ? "" : isNaN(val) ? val : Number(val));

export default function DynamicView() {
  const [array, setArray] = useState([]); // renamed from data for consistency
  const [tree, setTree] = useState(null); // BST tree structure
  const [activeTab, setActiveTab] = useState(""); // renamed from dsType
  const [input, setInput] = useState("");
  const [index, setIndex] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [opName, setOpName] = useState("");
  const [opDetail, setOpDetail] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dsSize, setDsSize] = useState(0);
  const [history, setHistory] = useState([]);
  const [nextType, setNextType] = useState("");
  // Event recorder (plain function – no useCallback needed)
  function recordEvent(evt) {
    if (!evt) return;
    setEvents((p) => [evt, ...p].slice(0, 200));
  }

  // Unified state updater after a data-changing operation
  function applyDataResponse(res, op, detail) {
    if (res?.data) setArray(res.data);
    if (res?.tree !== undefined) setTree(res.tree);
    if (res?.type) setActiveTab(res.type);
    if (op) setOpName(op);
    if (detail) setOpDetail(detail);
    recordEvent({ op, detail, array: res?.data });
    // refresh adaptive state (best-effort)
    dy_state()
      .then((st) => {
        setDsSize(st.size ?? (res?.data?.length ?? 0));
        setHistory(st.history ?? []);
        setNextType(st.nextType ?? "");
      })
      .catch(() => {});
  }

  // Initial fetch
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await dy_all();
        applyDataResponse(res, "Init", "Fetched initial structure");
        try {
          const st = await dy_state();
          setDsSize(st.size ?? res?.data?.length ?? 0);
          setHistory(st.history ?? []);
          setNextType(st.nextType ?? "");
        } catch {}
      } catch {
        setError("Failed to fetch data from backend");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // No dependency on helper function references since they are stable in intent

  const guard = (cond, msg) => {
    if (cond) return true;
    setError(msg);
    return false;
  };

  const handleInsert = async () => {
    if (!guard(input !== "", "Please enter a value")) return;
    setLoading(true);
    setError("");
    try {
      const coerced = coerceValue(input);
      const idx = index === "" ? undefined : Number(index);
      const res = await dy_insert(coerced, idx);
      const detail =
        idx === undefined
          ? `Inserted ${coerced} at end`
          : `Inserted ${coerced} at index ${idx}`;
      applyDataResponse(res, "Insert", detail);
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
    if (!guard(index !== "", "Please enter an index to remove")) return;
    setLoading(true);
    setError("");
    try {
      const idx = Number(index);
      const res = await dy_remove(idx);
      applyDataResponse(res, "Remove", `Removed value at index ${idx}`);
      setIndex("");
      setSearchResult(null);
    } catch {
      setError("Remove failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!guard(searchValue !== "", "Please enter a value to search")) return;
    setLoading(true);
    setError("");
    try {
      const res = await dy_search(searchValue);
      const found = res.found;
      const detail = found
        ? `Found ${searchValue} in structure`
        : `Did not find ${searchValue}`;
      applyDataResponse(res, "Search", detail);
      setSearchResult(found);
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
      const res = await dy_sort(direction);
      const detail = `Sorted ${
        res.order === "desc" ? "descending" : "ascending"
      }`;
      applyDataResponse(res, "Sort", detail);
      setSearchResult(null);
    } catch {
      setError("Sort failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdd = async (count) => {
    setLoading(true);
    setError("");
    try {
      const res = await dy_bulkAdd(count);
      applyDataResponse(res, "Bulk Add", `Added ${res.added ?? count} random values`);
      setSearchResult(null);
    } catch {
      setError("Bulk add failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await dy_clear();
      applyDataResponse(res, "Clear", "Cleared all values");
      setSearchResult(null);
    } catch {
      setError("Clear failed");
    } finally {
      setLoading(false);
    }
  };

  const Visualizer = visualizerMap[activeTab] || ArrayView;

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dynamic Visualizer
        </h1>
        <p className="text-stone-400">Watch structures morph based on operations</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="stat-card from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Current Structure</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                {activeTab || "array"}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
          {nextType && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-stone-400">Next preferred:</span>
              <span className="ml-2 badge badge-primary">{nextType}</span>
            </div>
          )}
        </div>

        <div className="stat-card from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Size</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                {dsSize ?? array.length}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card from-amber-500/10 to-orange-500/10 border-amber-500/30 sm:col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Recent Operations</div>
          <div className="flex flex-wrap gap-1.5">
            {history.length === 0 ? (
              <span className="text-stone-500 text-sm italic">No operations yet</span>
            ) : (
              history.map((h, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {h}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-6">
        <div className="truncate max-w-full">
          <span className="font-semibold text-stone-300">Preview:</span>{" "}
          <span className="text-stone-200 font-mono text-sm">
            [
            {array.slice(0, 8).join(", ")}
            {array.length > 8 ? " …" : ""}]
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-900/40 to-pink-900/40 border-2 border-red-600/50 animate-fade-in shadow-lg shadow-red-900/20">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-bold text-red-300 block mb-1">Error</span>
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Operation Feedback */}
      {(opDetail || opName) && !error && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-600/40 animate-fade-in backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <span className="font-bold text-indigo-300 block mb-1">Operation Complete</span>
              <div className="flex items-center gap-2 flex-wrap">
                {opName && (
                  <span className="badge badge-primary font-mono">
                    {opName}
                  </span>
                )}
                <span className="text-stone-300">{opDetail}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="mb-6 card p-6">
        <h3 className="text-lg font-bold text-stone-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Control Panel
        </h3>

        {/* Primary Actions */}
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">Value</label>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-modern w-full"
                placeholder="Enter value"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) handleInsert();
                }}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">Index (optional)</label>
              <input
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                className="input-modern w-full"
                placeholder="Position"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) handleInsert();
                }}
              />
            </div>
            <button
              onClick={handleInsert}
              className="btn btn-primary"
              disabled={loading}
              type="button"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Insert
            </button>
            <button
              onClick={handleRemove}
              className="btn btn-secondary"
              disabled={loading}
              type="button"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Remove
            </button>
            <button
              onClick={handleClear}
              className="btn btn-danger"
              disabled={loading}
              type="button"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>

          {/* Bulk Operations */}
          <div className="pt-4 border-t border-stone-700/50">
            <label className="block text-xs font-semibold text-stone-400 mb-3 uppercase tracking-wide">Quick Add</label>
            <div className="flex gap-2 flex-wrap">
              {[10, 50, 100, 1000].map((n) => (
                <button
                  key={n}
                  onClick={() => handleBulkAdd(n)}
                  className="btn btn-success"
                  disabled={loading}
                  type="button"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  +{n}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="pt-4 border-t border-stone-700/50">
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">Search Value</label>
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="input-modern w-full"
                  placeholder="Value to find"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) handleSearch();
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="btn btn-secondary"
                disabled={loading}
                type="button"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              <button
                onClick={() => handleSort("asc")}
                className="btn btn-secondary"
                disabled={loading}
                type="button"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort ↑
              </button>
              <button
                onClick={() => handleSort("desc")}
                className="btn btn-secondary"
                disabled={loading}
                type="button"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Sort ↓
              </button>
            </div>
          </div>
        </div>
        {/* Visualizer */}
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-stone-900/50 to-stone-800/50 border border-stone-700/50">
          {activeTab === "bst" ? (
            <Visualizer tree={tree} />
          ) : (
            <Visualizer values={array} />
          )}
        </div>

        {/* Search Result */}
        {searchResult !== null && !error && (
          <div className={`mt-4 p-4 rounded-xl border-2 ${
            searchResult 
              ? 'bg-emerald-900/30 border-emerald-600/50' 
              : 'bg-red-900/30 border-red-600/50'
          } animate-fade-in`}>
            <div className="flex items-center gap-3">
              {searchResult ? (
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <span className="font-semibold">Search Result: </span>
                <span className={searchResult ? "text-emerald-300 font-bold" : "text-red-300 font-bold"}>
                  {searchResult ? "Found ✓" : "Not Found"}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Event Log */}
        {events.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-stone-200">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Event Log
              <span className="badge badge-primary ml-auto">{events.length}</span>
            </h2>
            <div className="max-h-80 overflow-auto border border-stone-700/50 rounded-xl bg-stone-900/40 text-sm divide-y divide-stone-800/50 backdrop-blur-sm custom-scrollbar">
              {events.map((e, i) => (
                <div
                  key={i}
                  className="px-4 py-3 hover:bg-stone-800/30 transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="badge badge-primary font-mono text-[11px]">
                      {e.op}
                    </span>
                    <span className="flex-1 text-stone-300">{e.detail}</span>
                    <span className="text-stone-500 font-mono text-[10px] hidden lg:inline">
                      [{e.array?.slice(0, 10).join(", ")}{e.array?.length > 10 ? "..." : ""}]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

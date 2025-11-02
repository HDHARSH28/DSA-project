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
      setActiveTab(res.type);
      const found = res.found;
      const detail = found
        ? `Found ${searchValue} in structure`
        : `Did not find ${searchValue}`;
      setOpName("Search");
      setOpDetail(detail);
      setSearchResult(found);
      recordEvent({ op: "Search", detail, array });
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
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-indigo-300">
        DS Visualizer (Dynamic)
      </h1>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="p-3 rounded bg-stone-800 border border-stone-700">
          <div className="font-semibold text-stone-300">Current Structure</div>
          <div className="text-purple-200 text-lg font-bold">{activeTab || "array"}</div>
          <div className="text-sm text-stone-400">Next preferred: <span className="text-indigo-300">{nextType || ""}</span></div>
        </div>
        <div className="p-3 rounded bg-stone-800 border border-stone-700">
          <div className="font-semibold text-stone-300">Size</div>
          <div className="text-emerald-200 text-lg font-bold">{dsSize ?? array.length}</div>
          <div className="text-sm text-stone-400">Last 5 ops:
            <span className="ml-2 flex flex-wrap gap-1 mt-1">
              {history.length === 0 ? (
                <span className="text-stone-500">(none)</span>
              ) : (
                history.map((h, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-stone-700 border border-stone-600 text-stone-200">
                    {h}
                  </span>
                ))
              )}
            </span>
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
          <button
            onClick={handleClear}
            className="btn btn-secondary"
            disabled={loading}
            type="button"
          >
            Clear
          </button>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="text-stone-300">Quick add:</span>
          {[10, 50, 100, 1000].map((n) => (
            <button
              key={n}
              onClick={() => handleBulkAdd(n)}
              className="btn btn-secondary"
              disabled={loading}
              type="button"
            >
              +{n}
            </button>
          ))}
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
        <div className="mt-2">
          <Visualizer values={array} />
        </div>
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

import React, { useState, useEffect } from "react";
import ArrayView from "./components/ArrayView";
import LinkedListView from "./components/LinkedListView";
import BSTView from "./components/BSTView";
import {
  arr_push,
  arr_delete,
  arr_search,
  arrayToLL,
  ll_insert_front,
  ll_delete,
  ll_search,
  llToArray,
  getFrontDatabase,
  bst_insert,
  bst_search,
  bst_delete,
  arrayToBST,
  llToBST,
  bstToArray,
  bstToLL,
} from "./utils";

function App() {
  // -------------------- State --------------------
  const [array, setArray] = useState([]);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [opName, setOpName] = useState("");
  const [opDetail, setOpDetail] = useState("");
  const [opTime, setOpTime] = useState("");
  const [events, setEvents] = useState([]); // event history
  const [activeTab, setActiveTab] = useState("array");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset feedback when switching tabs
  useEffect(() => {
    // Keep last operation feedback; only clear transient input/search.
    setSearchResult(null);
    setInput("");
    setError("");
  }, [activeTab]);

  // -------------------- Helper Functions --------------------

  // Input validation
  const validateInput = (value) => {
    if (!value.trim()) {
      throw new Error("Please enter a value");
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new Error("Please enter a valid number");
    }
    return numValue;
  };

  // -------------------- Data Fetcher --------------------
  const fetchArray = async () => {
    try {
      const res = await getFrontDatabase();
      setArray(res.array || []);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  // Record event helper
  const recordEvent = (evt) => {
    if (!evt) return;
    setEvents((prev) => [evt, ...prev].slice(0, 200)); // cap history
  };
  // -------------------- Operation Handlers --------------------

  // Array operations
  const handleArrayPush = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await arr_push(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setInput("");
      setSearchResult(null);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleArrayDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await arr_delete(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setInput("");
      setSearchResult(null);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleArraySearch = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await arr_search(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      setSearchResult(res.detail?.startsWith("found") || false);
      recordEvent(res);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Linked List operations
  const handleLLInsert = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await ll_insert_front(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setInput("");
      setSearchResult(null);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLLDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await ll_delete(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setInput("");
      setSearchResult(null);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLLSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await ll_search(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      setSearchResult(res.detail?.startsWith("found") || false);
      recordEvent(res);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // BST operations
  const handleBSTInsert = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await bst_insert(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setInput("");
      setSearchResult(null);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBSTDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await bst_delete(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setInput("");
      setSearchResult(null);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBSTSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const numInput = validateInput(input);
      const res = await bst_search(numInput);
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      setSearchResult(res.detail?.startsWith("found") || false);
      recordEvent(res);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLLToArray = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await llToArray();
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setActiveTab("array");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLLToBST = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await llToBST();
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setActiveTab("bst");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleArrayToLL = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await arrayToLL();
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setActiveTab("linkedlist");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleArrayToBST = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await arrayToBST();
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setActiveTab("bst");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBSTToArray = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await bstToArray();
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setActiveTab("array");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBSTToLL = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await bstToLL();
      setArray(res.array || []);
      setOpName(res.op || "");
      setOpDetail(res.detail || "");
      setOpTime(res.time || "");
      recordEvent(res);
      setActiveTab("linkedlist");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  // -------------------- Initial Data Fetch --------------------
  useEffect(() => {
    fetchArray();
  }, []);

  // --------- UI --------------------
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-300">DS Visualizer</h1>

      {/* Tab Navigation - State Indicators */}
      <div className="mb-4 flex gap-4">
        <div
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            activeTab === "array"
              ? "bg-indigo-500 text-white"
              : "bg-stone-700 text-stone-300"
          }`}
        >
          Array
        </div>
        <div
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            activeTab === "linkedlist"
              ? "bg-indigo-500 text-white"
              : "bg-stone-700 text-stone-300"
          }`}
        >
          Linked List
        </div>
        <div
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            activeTab === "bst"
              ? "bg-indigo-500 text-white"
              : "bg-stone-700 text-stone-300"
          }`}
        >
          BST
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-900/30 border border-red-700 text-red-300">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Operation Result */}
      {(opDetail || opName) && !error && (
        <div className="mb-4 p-3 rounded bg-stone-800 border border-stone-700">
          <span className="font-semibold text-indigo-400">Operation:</span>{" "}
          {opName && (
            <span className="font-mono text-xs bg-stone-700 px-2 py-0.5 rounded mr-2 text-indigo-300">
              {opName}
            </span>
          )}
          <span>{opDetail}</span>
          {opTime && (
            <span className="ml-4">
              <span className="font-semibold text-green-400">Time:</span>{" "}
              {opTime}
            </span>
          )}
        </div>
      )}
      {/* Controls */}
      <div className="mb-6 card bg-stone-800 p-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-stone-600 bg-stone-700 rounded-md px-3 py-2 text-stone-100 placeholder-stone-400 focus:border-indigo-500 focus:outline-none min-w-[120px]"
            placeholder="Enter number"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                // Execute primary action based on active tab
                if (activeTab === "array") handleArrayPush();
                else if (activeTab === "linkedlist") handleLLInsert();
                else handleBSTInsert();
              }
            }}
          />

          {loading && (
            <div className="flex items-center px-3 py-2 text-indigo-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
              <span className="ml-2">Processing...</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {activeTab === "array" ? (
            <>
              <button
                onClick={handleArrayPush}
                className="btn btn-primary"
                disabled={loading}
              >
                Push
              </button>
              <button
                onClick={handleArrayDelete}
                className="btn btn-secondary"
                disabled={loading}
              >
                Delete
              </button>
              <button
                onClick={handleArraySearch}
                className="btn btn-secondary"
                disabled={loading}
              >
                Search
              </button>
              <button
                onClick={handleArrayToLL}
                className="btn btn-secondary"
                disabled={loading}
              >
                Array→LL
              </button>
              <button
                onClick={handleArrayToBST}
                className="btn btn-secondary"
                disabled={loading}
              >
                Array→BST
              </button>
            </>
          ) : activeTab === "linkedlist" ? (
            <>
              <button
                onClick={handleLLInsert}
                className="btn btn-primary"
                disabled={loading}
              >
                Insert Front
              </button>
              <button
                onClick={handleLLDelete}
                className="btn btn-secondary"
                disabled={loading}
              >
                Delete
              </button>
              <button
                onClick={handleLLSearch}
                className="btn btn-secondary"
                disabled={loading}
              >
                Search
              </button>
              <button
                onClick={handleLLToArray}
                className="btn btn-secondary"
                disabled={loading}
              >
                LL→Array
              </button>
              <button
                onClick={handleLLToBST}
                className="btn btn-secondary"
                disabled={loading}
              >
                LL→BST
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBSTInsert}
                className="btn btn-primary"
                disabled={loading}
              >
                Insert
              </button>
              <button
                onClick={handleBSTDelete}
                className="btn btn-secondary"
                disabled={loading}
              >
                Delete
              </button>
              <button
                onClick={handleBSTSearch}
                className="btn btn-secondary"
                disabled={loading}
              >
                Search
              </button>
              <button
                onClick={handleBSTToArray}
                className="btn btn-secondary"
                disabled={loading}
              >
                BST→Array
              </button>
              <button
                onClick={handleBSTToLL}
                className="btn btn-secondary"
                disabled={loading}
              >
                BST→LL
              </button>
            </>
          )}
        </div>

        {/* Data Structure Visualization */}
        {activeTab === "array" ? (
          <ArrayView values={array} />
        ) : activeTab === "linkedlist" ? (
          <LinkedListView values={array} />
        ) : (
          <BSTView values={array} />
        )}

        {/* Search Result Display */}
        {searchResult !== null && !error && (
          <div className="mt-4 p-2 rounded bg-stone-700">
            <span className="font-semibold">Search Result: </span>
            <span className={searchResult ? "text-green-400" : "text-red-400"}>
              {searchResult ? "Found" : "Not Found"}
            </span>
          </div>
        )}

        {/* Event Log */}
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
                  {e.time && (
                    <span className="text-green-400 font-mono text-xs">
                      {e.time}
                    </span>
                  )}
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

export default App;

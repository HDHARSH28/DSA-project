import React, { useState, useEffect } from "react";
import ArrayView from "./components/ArrayView";
import LinkedListView from "./components/LinkedListView";
import BSTView from "./components/BSTView";
import {
  arr_push,
  arr_delete,
  arr_search,
  arr_sort_inc,
  arr_sort_dec,
  arrayToLL,
  ll_insert_front,
  ll_delete,
  ll_search,
  ll_insert_end,
  ll_sort_inc,
  ll_sort_dec,
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

export default function StaticView() {
  const [array, setArray] = useState([]);
  const [tree, setTree] = useState(null);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [opName, setOpName] = useState("");
  const [opDetail, setOpDetail] = useState("");
  const [opTime, setOpTime] = useState("");
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("array");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchResult(null);
    setInput("");
    setError("");
  }, []);

  const validateInput = (value) => {
    if (!value.trim()) throw new Error("Please enter a value");
    const num = Number(value);
    if (isNaN(num)) throw new Error("Please enter a valid number");
    return num;
  };

  const fetchArray = async () => {
    try {
      const res = await getFrontDatabase();
      setArray(res.array || []);
      setTree(res.tree || null);
    } catch {
      setError("Failed to fetch data");
    }
  };
  useEffect(() => {
    fetchArray();
  }, []);

  const recordEvent = (evt) => {
    if (!evt) return;
    setEvents((p) => [evt, ...p].slice(0, 200));
  };

  // Unified updater
  function applyDataResponse(res, options = {}) {
    if (res?.array) setArray(res.array);
    if (res?.tree !== undefined) setTree(res.tree);
    if (res?.op) setOpName(res.op);
    if (res?.detail) setOpDetail(res.detail);
    if (res?.time) setOpTime(res.time);
    recordEvent(res);

    const { clearInput = false, nextTab, resetSearch = false } = options;
    if (clearInput) setInput("");
    if (resetSearch) setSearchResult(null);
    if (nextTab) setActiveTab(nextTab);
  }

  // Handlers
  const handleArrayPush = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await arr_push(num);
      applyDataResponse(res, { clearInput: true, resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleArrayDelete = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await arr_delete(num);
      applyDataResponse(res, { clearInput: true, resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleArraySearch = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await arr_search(num);
      applyDataResponse(res);
      setSearchResult(res.detail?.startsWith("found") || false);
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleArraySortInc = async () => {
    try {
      setLoading(true); setError("");
      const res = await arr_sort_inc();
      applyDataResponse(res, { resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleArraySortDec = async () => {
    try {
      setLoading(true); setError("");
      const res = await arr_sort_dec();
      applyDataResponse(res, { resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleLLInsert = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await ll_insert_front(num);
      applyDataResponse(res, { clearInput: true, resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleLLEndInsert = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await ll_insert_end(num);
      applyDataResponse(res, { clearInput: true, resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleLLDelete = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await ll_delete(num);
      applyDataResponse(res, { clearInput: true, resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleLLSearch = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await ll_search(num);
      applyDataResponse(res);
      setSearchResult(res.detail?.startsWith("found") || false);
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleLLSortInc = async () => {
    try {
      setLoading(true); setError("");
      const res = await ll_sort_inc();
      applyDataResponse(res, { resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleLLSortDec = async () => {
    try {
      setLoading(true); setError("");
      const res = await ll_sort_dec();
      applyDataResponse(res, { resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleBSTInsert = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await bst_insert(num);
      applyDataResponse(res, { clearInput: true, resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleBSTDelete = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await bst_delete(num);
      applyDataResponse(res, { clearInput: true, resetSearch: true });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleBSTSearch = async () => {
    try {
      setLoading(true); setError("");
      const num = validateInput(input);
      const res = await bst_search(num);
      applyDataResponse(res);
      setSearchResult(res.detail?.startsWith("found") || false);
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  // Conversions
  const handleLLToArray = async () => {
    try {
      setLoading(true); setError("");
      const res = await llToArray();
      applyDataResponse(res, { nextTab: "array" });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleLLToBST = async () => {
    try {
      setLoading(true); setError("");
      const res = await llToBST();
      applyDataResponse(res, { nextTab: "bst" });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleArrayToLL = async () => {
    try {
      setLoading(true); setError("");
      const res = await arrayToLL();
      applyDataResponse(res, { nextTab: "linkedlist" });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleArrayToBST = async () => {
    try {
      setLoading(true); setError("");
      const res = await arrayToBST();
      applyDataResponse(res, { nextTab: "bst" });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleBSTToArray = async () => {
    try {
      setLoading(true); setError("");
      const res = await bstToArray();
      applyDataResponse(res, { nextTab: "array" });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  const handleBSTToLL = async () => {
    try {
      setLoading(true); setError("");
      const res = await bstToLL();
      applyDataResponse(res, { nextTab: "linkedlist" });
    } catch (e) { setError(e.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Static Explorer
        </h1>
        <p className="text-stone-400">Explore fixed data structures with manual operations</p>
      </div>

      {/* Structure Selector */}
      <div className="mb-6 p-2 rounded-xl bg-stone-800/50 border border-stone-700/50 inline-flex gap-2">
        {[
          { key: "array", label: "Array", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
          { key: "linkedlist", label: "Linked List", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
          { key: "bst", label: "BST", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === key
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/50 scale-105"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-700/50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
            {label}
          </button>
        ))}
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
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 border border-indigo-600/40 animate-fade-in backdrop-blur-sm">
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
                {opTime && (
                  <span className="badge badge-success ml-auto">
                    ⚡ {opTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="mb-6 card p-6">
        <h3 className="text-lg font-bold text-stone-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Control Panel
          {loading && (
            <div className="flex items-center ml-auto gap-2 text-cyan-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent"></div>
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </h3>

        {/* Input Section */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">Input Value</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-modern w-full max-w-md"
            placeholder="Enter number"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                if (activeTab === "array") handleArrayPush();
                else if (activeTab === "linkedlist") handleLLInsert();
                else handleBSTInsert();
              }
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {activeTab === "array" && (
            <>
              <button onClick={handleArrayPush} className="btn btn-primary" disabled={loading}>Push</button>
              <button onClick={handleArrayDelete} className="btn btn-secondary" disabled={loading}>Delete</button>
              <button onClick={handleArraySearch} className="btn btn-secondary" disabled={loading}>Search</button>
              <button onClick={handleArraySortInc} className="btn btn-secondary" disabled={loading}>Sort ↑</button>
              <button onClick={handleArraySortDec} className="btn btn-secondary" disabled={loading}>Sort ↓</button>
              <button onClick={handleArrayToLL} className="btn btn-secondary" disabled={loading}>Array→LL</button>
              <button onClick={handleArrayToBST} className="btn btn-secondary" disabled={loading}>Array→BST</button>
            </>
          )}
          {activeTab === "linkedlist" && (
            <>
              <button onClick={handleLLInsert} className="btn btn-primary" disabled={loading}>Insert Front</button>
              <button onClick={handleLLEndInsert} className="btn btn-secondary" disabled={loading}>Insert End</button>
              <button onClick={handleLLDelete} className="btn btn-secondary" disabled={loading}>Delete</button>
              <button onClick={handleLLSearch} className="btn btn-secondary" disabled={loading}>Search</button>
              <button onClick={handleLLSortInc} className="btn btn-secondary" disabled={loading}>Sort ↑</button>
              <button onClick={handleLLSortDec} className="btn btn-secondary" disabled={loading}>Sort ↓</button>
              <button onClick={handleLLToArray} className="btn btn-secondary" disabled={loading}>LL→Array</button>
              <button onClick={handleLLToBST} className="btn btn-secondary" disabled={loading}>LL→BST</button>
            </>
          )}
          {activeTab === "bst" && (
            <>
              <button onClick={handleBSTInsert} className="btn btn-primary" disabled={loading}>Insert</button>
              <button onClick={handleBSTDelete} className="btn btn-secondary" disabled={loading}>Delete</button>
              <button onClick={handleBSTSearch} className="btn btn-secondary" disabled={loading}>Search</button>
              <button onClick={handleBSTToArray} className="btn btn-secondary" disabled={loading}>BST→Array</button>
              <button onClick={handleBSTToLL} className="btn btn-secondary" disabled={loading}>BST→LL</button>
            </>
          )}
        </div>

        {/* Visualizer */}
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-stone-900/50 to-stone-800/50 border border-stone-700/50">
          {activeTab === "array" && <ArrayView values={array} />}
          {activeTab === "linkedlist" && <LinkedListView values={array} />}
          {activeTab === "bst" && <BSTView values={array} tree={tree} />}
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
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    {e.time && (
                      <span className="badge badge-success">
                        ⚡ {e.time}
                      </span>
                    )}
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


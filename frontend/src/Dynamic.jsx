import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArrayView from "./components/ArrayView";
import LinkedListView from "./components/LinkedListView";
import BSTView from "./components/BSTView";
import HashTableView from "./components/HashTableView";
import {
  dy_all,
  dy_insert,
  dy_remove,
  dy_search,
  dy_sort,
  dy_bulkAdd,
  dy_clear,
  dy_state,
  dy_access,
} from "./utils";

export default function DynamicView() {
  const [data, setData] = useState([]);
  const [tree, setTree] = useState(null);
  const [dsType, setDsType] = useState("array");
  const [input, setInput] = useState("");
  const [indexInput, setIndexInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  // State info from backend
  const [stateInfo, setStateInfo] = useState({
    phase: 1,
    threshold: 3,
    freq: { search: 0, index: 0, insert: 0, hash_search: 0 },
    size: 0,
    idleTime: 0,
  });

  // Fetch initial data
  const fetchData = async () => {
    try {
      const res = await dy_all();
      setData(res.data || []);
      setTree(res.tree || null);
      setDsType(res.type || "array");
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  // Fetch state info
  const fetchState = async () => {
    try {
      const state = await dy_state();
      setStateInfo({
        phase: state.phase || 1,
        threshold: state.threshold || 3,
        freq: state.freq || { search: 0, index: 0, insert: 0, hash_search: 0 },
        size: state.size || 0,
        idleTime: state.idleTime || 0,
      });
    } catch (err) {
      console.error("Failed to fetch state:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchState();
    
    // Poll state every 2 seconds to update UI
    const interval = setInterval(() => {
      fetchState();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const validateInput = (value) => {
    if (!value.trim()) throw new Error("Please enter a value");
    const num = Number(value);
    if (isNaN(num)) throw new Error("Please enter a valid number");
    return num;
  };

  const updateData = async () => {
    await fetchData();
    await fetchState();
  };

  // Insert operation
  const handleInsert = async () => {
    try {
      setLoading(true);
      setError("");
      setSearchResult(null);
      const value = validateInput(input);
      const index = indexInput ? parseInt(indexInput) : undefined;
      
      const res = await dy_insert(value, index);
      setData(res.data || []);
      setTree(res.tree || null);
      setDsType(res.type || "array");
      setMessage(index !== undefined ? `Inserted ${value} at index ${index}` : `Inserted ${value}`);
      setInput("");
      setIndexInput("");
      await fetchState();
    } catch (e) {
      setError(e.message || "Insert failed");
    } finally {
      setLoading(false);
    }
  };

  // Remove operation (by value)
  const handleRemove = async () => {
    try {
      setLoading(true);
      setError("");
      setSearchResult(null);
      const value = validateInput(input);
      
      // Find index of value and remove
      const currentData = await dy_all();
      const index = currentData.data.indexOf(value);
      
      if (index === -1) {
        throw new Error(`Value ${value} not found`);
      }
      
      const res = await dy_remove(index);
      setData(res.data || []);
      setTree(res.tree || null);
      setDsType(res.type || "array");
      setMessage(`Removed ${value} at index ${index}`);
      setInput("");
      await fetchState();
    } catch (e) {
      setError(e.message || "Remove failed");
    } finally {
      setLoading(false);
    }
  };

  // Access by index (for array access tracking)
  const handleAccessIndex = async () => {
    try {
      setLoading(true);
      setError("");
      setSearchResult(null);
      const index = parseInt(indexInput);
      if (isNaN(index) || index < 0) {
        throw new Error("Please enter a valid index");
      }
      
      const res = await dy_access(index);
      
      if (res.value === null || res.value === undefined) {
        throw new Error("Index out of bounds");
      }
      
      setData(res.data || []);
      setTree(res.tree || null);
      setDsType(res.type || "array");
      setMessage(`Element at index ${index} is: ${res.value}`);
      setSearchResult(true);
      await fetchState();
    } catch (e) {
      setError(e.message || "Index access failed");
    } finally {
      setLoading(false);
    }
  };

  // Search operation
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const value = validateInput(input);
      
      const res = await dy_search(value);
      setData(res.data || []);
      setTree(res.tree || null);
      setDsType(res.type || "array");
      setSearchResult(res.found);
      setMessage(res.found ? `Found ${value}!` : `${value} not found`);
      await fetchState();
    } catch (e) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Sort operation
  const handleSort = async (order = "asc") => {
    try {
      setLoading(true);
      setError("");
      setSearchResult(null);
      
      const res = await dy_sort(order);
      setData(res.data || []);
      setTree(res.tree || null);
      setDsType(res.type || "array");
      setMessage(`Sorted in ${order === "asc" ? "ascending" : "descending"} order`);
      await fetchState();
    } catch (e) {
      setError(e.message || "Sort failed");
    } finally {
      setLoading(false);
    }
  };

  // Bulk add operation
  const handleBulkAdd = async (count = 10) => {
    try {
      setLoading(true);
      setError("");
      setSearchResult(null);
      
      const res = await dy_bulkAdd(count, 0, 1000);
      setData(res.data || []);
      setTree(res.tree || null);
      setDsType(res.type || "array");
      setMessage(`Added ${res.added || count} random elements`);
      await fetchState();
    } catch (e) {
      setError(e.message || "Bulk add failed");
    } finally {
      setLoading(false);
    }
  };

  // Clear operation
  const handleClear = async () => {
    try {
      setLoading(true);
      setError("");
      setSearchResult(null);
      
      const res = await dy_clear();
      setData(res.data || []);
      setTree(res.tree || null);
      setDsType(res.type || "array");
      setMessage("Cleared all data");
      setInput("");
      setIndexInput("");
      await fetchState();
    } catch (e) {
      setError(e.message || "Clear failed");
    } finally {
      setLoading(false);
    }
  };

  // Get phase info
  const getPhaseInfo = () => {
    const { phase, size } = stateInfo;
    const ranges = {
      1: "< 100",
      2: "100-500",
      3: "> 500",
    };
    const defaults = {
      1: "Array",
      2: "Linked List",
      3: "BST",
    };
    return {
      range: ranges[phase] || "N/A",
      default: defaults[phase] || "N/A",
    };
  };

  const phaseInfo = getPhaseInfo();

  // Progress percentage for frequency bars
  const getProgress = (opType) => {
    const { freq, threshold } = stateInfo;
    return Math.min((freq[opType] / threshold) * 100, 100);
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dynamic Explorer
            </h1>
            <p className="text-stone-400 mt-1">
              Watch structures morph automatically based on operations and data size
            </p>
          </div>
        </div>
      </motion.div>

      {/* Phase & State Dashboard */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card from-indigo-500/20 to-purple-500/20 border-indigo-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Current Structure
            </span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 capitalize">
            {dsType}
          </div>
        </motion.div>

        {/* Phase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card from-emerald-500/20 to-teal-500/20 border-emerald-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Phase
            </span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              Phase {stateInfo.phase}
            </div>
            <span className="text-xs text-stone-400">({phaseInfo.range})</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">Default: {phaseInfo.default}</div>
        </motion.div>

        {/* Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card from-amber-500/20 to-orange-500/20 border-amber-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Size
            </span>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
            {stateInfo.size}
          </div>
          <div className="text-xs text-stone-500 mt-1">elements</div>
        </motion.div>

        {/* Threshold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card from-rose-500/20 to-pink-500/20 border-rose-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Threshold
            </span>
            <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300">
            {stateInfo.threshold}
          </div>
          <div className="text-xs text-stone-500 mt-1">operations</div>
        </motion.div>
      </div>

      {/* Operation Frequency Bars */}
      <div className="mb-6 card p-6">
        <h3 className="text-lg font-bold text-stone-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Operation Frequencies
          <span className="text-xs text-stone-500 ml-2">
            (Triggers at {stateInfo.threshold})
          </span>
        </h3>
        
        <div className="space-y-4">
          {/* Hash Search Frequency (for Hash Table) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-300">Search (Hash)</span>
                <span className="badge badge-primary text-xs">→ HashTable</span>
              </div>
              <span className="text-sm font-mono text-stone-400">
                {stateInfo.freq.hash_search || 0} / {stateInfo.threshold}
              </span>
            </div>
            <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress("hash_search")}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Sort/BST Frequency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-300">Sort</span>
                <span className="badge badge-primary text-xs">→ BST</span>
              </div>
              <span className="text-sm font-mono text-stone-400">
                {stateInfo.freq.search} / {stateInfo.threshold}
              </span>
            </div>
            <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress("search")}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Index Frequency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-300">Index Access</span>
                <span className="badge badge-primary text-xs">→ Array</span>
              </div>
              <span className="text-sm font-mono text-stone-400">
                {stateInfo.freq.index} / {stateInfo.threshold}
              </span>
            </div>
            <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress("index")}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Insert Frequency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-300">Insert/Delete</span>
                <span className="badge badge-primary text-xs">→ LinkedList</span>
              </div>
              <span className="text-sm font-mono text-stone-400">
                {stateInfo.freq.insert} / {stateInfo.threshold}
              </span>
            </div>
            <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress("insert")}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error/Message Display */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-900/40 to-pink-900/40 border-2 border-red-600/50 animate-fade-in">
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

      {message && !error && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 border border-indigo-600/40 animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-stone-300">{message}</span>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="mb-6 card p-6">
        <h3 className="text-lg font-bold text-stone-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Operations
          {loading && (
            <div className="flex items-center ml-auto gap-2 text-cyan-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent"></div>
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Value Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">
              Value
              <span className="ml-2 text-emerald-400 text-[10px] font-normal">
                (for insert/delete/search)
              </span>
            </label>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-modern w-full"
              placeholder="Enter number to insert/delete/search"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) handleInsert();
              }}
            />
          </div>

          {/* Index Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">
              Index
              <span className="ml-2 text-purple-400 text-[10px] font-normal">
                (for array access/insert)
              </span>
            </label>
            <input
              value={indexInput}
              onChange={(e) => setIndexInput(e.target.value)}
              className="input-modern w-full"
              placeholder="Enter index to access/insert "
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) handleAccessIndex();
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={handleInsert} className="btn btn-primary" disabled={loading}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Insert
          </button>
          <button onClick={handleRemove} className="btn btn-secondary" disabled={loading}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <button onClick={handleAccessIndex} className="btn btn-secondary" disabled={loading}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Access Index
          </button>
          <button onClick={handleSearch} className="btn btn-secondary" disabled={loading}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
          <button onClick={() => handleSort("asc")} className="btn btn-secondary" disabled={loading}>
            Sort ↑
          </button>
          <button onClick={() => handleSort("desc")} className="btn btn-secondary" disabled={loading}>
            Sort ↓
          </button>
          <button onClick={() => handleBulkAdd(10)} className="btn btn-secondary" disabled={loading}>
            Add 10
          </button>
          <button onClick={() => handleBulkAdd(50)} className="btn btn-secondary" disabled={loading}>
            Add 50
          </button>
          <button onClick={() => handleBulkAdd(100)} className="btn btn-secondary" disabled={loading}>
            Add 100
          </button>
          <button onClick={() => handleBulkAdd(500)} className="btn btn-secondary" disabled={loading}>
            Add 500
          </button>
          <button onClick={handleClear} className="btn btn-danger" disabled={loading}>
            Clear All
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Visualization
          </h3>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary capitalize">{dsType}</span>
            <span className="badge badge-success">{data.length} items</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-stone-900/50 to-stone-800/50 border border-stone-700/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={dsType}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {dsType === "array" && <ArrayView values={data} />}
              {dsType === "linkedlist" && <LinkedListView values={data} />}
              {dsType === "bst" && <BSTView tree={tree} />}
              {dsType === "hashtable" && <HashTableView values={data} />}
            </motion.div>
          </AnimatePresence>
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
      </div>

      {/* Info Box */}
      <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-indigo-300 mb-2">How It Works</p>
            <ul className="text-xs text-stone-400 space-y-1 leading-relaxed">
              <li>• <strong className="text-stone-300">Phase 1</strong> (size &lt; 100): Threshold = 3, Default = Array</li>
              <li>• <strong className="text-stone-300">Phase 2</strong> (100-500): Threshold = 6, Default = Linked List</li>
              <li>• <strong className="text-stone-300">Phase 3</strong> (size &gt; 500): Threshold = 9, Default = BST</li>
              <li>• <strong className="text-cyan-300">Search Value</strong>: Triggers Hash Table (O(1) lookup)</li>
              <li>• <strong className="text-green-300">Sort</strong>: Triggers BST (O(log n) sorted structure)</li>
              <li>• <strong className="text-purple-300">Access by Index</strong>: Triggers Array (O(1) random access)</li>
              <li>• <strong className="text-amber-300">Insert/Delete</strong>: Triggers Linked List (O(n) operations)</li>
              <li>• After 5 minutes of inactivity, resets to phase default structure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

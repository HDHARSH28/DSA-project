import React, { useState, useEffect } from 'react';
import ArrayView from './components/ArrayView';
import LinkedListView from './components/LinkedListView';
import {
  arr_push,
  arr_delete,
  arr_search,
  arrayToLL,
  ll_insert_front,
  ll_delete,
  ll_search,
  llToArray,
  getFrontDatabase
} from './utils';

function App() {
  // -------------------- State --------------------
  const [array, setArray] = useState([]);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [opDetail, setOpDetail] = useState("");
  const [opValue, setOpValue] = useState("");
  const [opTime, setOpTime] = useState("");
  const [activeTab, setActiveTab] = useState('array');

  // Reset feedback when switching tabs
  useEffect(() => {
    setOpDetail("");
    setOpValue("");
    setOpTime("");
    setSearchResult(null);
  }, [activeTab]);

  // -------------------- Data Fetcher --------------------
  const fetchArray = async () => {
    const res = await getFrontDatabase();
    setArray(res.array || []);
  };

  // -------------------- Array & Linked List API Handlers --------------------
  const handleArrayPush = async () => {
    const res = await arr_push(input);
    await fetchArray();
    setOpDetail(res.detail || "");
    setOpValue(res.value !== undefined ? res.value : "");
    setOpTime(res.time_ms || "");
    setInput("");
    setSearchResult(null);
  };
  const handleArrayDelete = async () => {
    const res = await arr_delete(input);
    await fetchArray();
    setOpDetail(res.detail || "");
    setOpValue(res.value !== undefined ? res.value : "");
    setOpTime(res.time_ms || "");
    setInput("");
    setSearchResult(null);
  };
  const handleArraySearch = async () => {
    const res = await arr_search(input);
    await fetchArray();
    setOpDetail(res.detail || "");
    setOpValue(res.value !== undefined ? res.value : "");
    setOpTime(res.time_ms || "");
    setSearchResult(res.detail === "found");
  };
  const handleArrayToLL = async () => {
    const res = await arrayToLL();
    await fetchArray();
    setOpDetail(res.detail || "");
    setOpValue(res.value !== undefined ? res.value : "");
    setOpTime(res.time_ms || "");
    setActiveTab('linkedlist');
  };
  const handleLLInsert = async () => {
    const res = await ll_insert_front(input);
    await fetchArray();
    setOpDetail(res.detail || "");
    setOpValue(res.value !== undefined ? res.value : "");
    setOpTime(res.time_ms || "");
    setInput("");
    setSearchResult(null);
  };
  const handleLLDelete = async () => {
    const res = await ll_delete(input);
    await fetchArray();
    setOpDetail(res.detail || "");
    setOpValue(res.value !== undefined ? res.value : "");
    setOpTime(res.time_ms || "");
    setInput("");
    setSearchResult(null);
  };
  const handleLLSearch = async () => {
    const res = await ll_search(input);
    await fetchArray();
    setOpDetail(res.detail || "");
    setOpValue(res.value !== undefined ? res.value : "");
    setOpTime(res.time_ms || "");
    setSearchResult(res.detail === "found");
  };
  const handleLLToArray = async () => {
    const res = await llToArray();
    await fetchArray();
    setOpDetail(res.detail || "");
    setOpValue(res.value !== undefined ? res.value : "");
    setOpTime(res.time_ms || "");
    setActiveTab('array');
  };

  // -------------------- Initial Data Fetch --------------------
  useEffect(() => {
    fetchArray();
  }, []);

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-300">DS Visualizer</h1>
      <div className="mb-4 flex gap-4">
        <button className={`btn ${activeTab === 'array' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('array')}>Array</button>
        <button className={`btn ${activeTab === 'linkedlist' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('linkedlist')}>Linked List</button>
      </div>
      <div className="mb-4">
        {opDetail && (
          <div className="p-2 rounded bg-stone-800 mb-2">
            <span className="font-semibold text-indigo-400">Operation:</span> {opDetail}
            {opValue !== "" && <span className="ml-4 font-semibold text-blue-400">Value:</span>} {opValue}
            {opTime !== "" && <span className="ml-4 font-semibold text-green-400">Time:</span>} {opTime} ms
          </div>
        )}
      </div>
      <div className="mb-6 card bg-stone-800 p-4">
        <div className="flex gap-2 mb-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border border-stone-700 bg-stone-800 rounded-md px-2 py-1 text-stone-100 placeholder-stone-400"
            placeholder="Value"
          />
          {activeTab === 'array' ? (
            <>
              <button onClick={handleArrayPush} className="btn btn-primary">Push</button>
              <button onClick={handleArrayDelete} className="btn btn-secondary">Delete</button>
              <button onClick={handleArraySearch} className="btn btn-secondary">Search</button>
              <button onClick={handleArrayToLL} className="btn btn-secondary">To Linked List</button>
            </>
          ) : (
            <>
              <button onClick={handleLLInsert} className="btn btn-primary">Insert Front</button>
              <button onClick={handleLLDelete} className="btn btn-secondary">Delete</button>
              <button onClick={handleLLSearch} className="btn btn-secondary">Search</button>
              <button onClick={handleLLToArray} className="btn btn-secondary">To Array</button>
            </>
          )}
        </div>
        {activeTab === 'array' ? (
          <ArrayView values={array} />
        ) : (
          <LinkedListView values={array} />
        )}
        {searchResult !== null && (
          <div className="mt-2">Search Result: <span className={searchResult ? 'text-green-400' : 'text-red-400'}>{searchResult ? "Found" : "Not Found"}</span></div>
        )}
      </div>
    </div>
  );
}

export default App;

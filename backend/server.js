// ---------- server.js ----------

const express = require("express");
// use built-in express JSON parser instead of external body-parser
const cors = require("cors");
const Wrapper = require("./static.js"); // Static DS logic
const DynamicDS = require("./dynamic.js"); // Dynamic DS logic

const app = express();
const ds = new Wrapper(); // Static DS instance
const dynamicDS = new DynamicDS(); // Dynamic DS instance

app.use(cors());
app.use(express.json());

const PORT = 3000;

// =======================================================
// --- START: Static Endpoints (Original /ll, /arr, /bst, /convert) ---
// =======================================================

// ---------- Linked List Endpoints ----------
app.post("/ll/insert_front", (req, res) => {
  const { value } = req.body;
  res.json(ds.ll_insert_front(value));
});

app.post("/ll/insert_end", (req, res) => {
  const { value } = req.body;
  res.json(ds.ll_insert_end(value));
});

app.post("/ll/delete", (req, res) => {
  const { value } = req.body;
  res.json(ds.ll_delete(value));
});

app.post("/ll/search", (req, res) => {
  const { value } = req.body;
  res.json(ds.ll_search(value));
});

// Linked List Sort Endpoints (increasing / decreasing)
app.post("/ll/sort_inc", (req, res) => {
  const r = ds.ll_sort_inc();
  res.json(r);
});

app.post("/ll/sort_dec", (req, res) => {
  const r = ds.ll_sort_dec();
  res.json(r);
});

// ---------- Array Endpoints ----------
app.post("/arr/push", (req, res) => {
  const { value } = req.body;
  res.json(ds.arr_push(value));
});

app.post("/arr/delete", (req, res) => {
  const { value } = req.body;
  res.json(ds.arr_delete(value));
});

app.post("/arr/search", (req, res) => {
  const { value } = req.body;
  res.json(ds.arr_search(value));
});

app.post("/arr/sort_inc", (req, res) => {
  res.json(ds.arr_sort_inc());
});

app.post("/arr/sort_dec", (req, res) => {
  res.json(ds.arr_sort_dec());
});

// ---------- BST Endpoints ----------
app.post("/bst/insert", (req, res) => {
  const { value } = req.body;
  res.json(ds.bst_insert(value));
});

app.post("/bst/search", (req, res) => {
  const { value } = req.body;
  res.json(ds.bst_search(value));
});

app.post("/bst/delete", (req, res) => {
  const { value } = req.body;
  res.json(ds.bst_delete(value));
});

// ---------- Converter Endpoints ----------
app.post("/convert/arrayToLL", (req, res) => {
  const r = ds.arrayToLL();
  console.log(r);
  res.json(r);
});

app.post("/convert/llToArray", (req, res) => {
  res.json(ds.llToArray());
});

// ---------- BST Converter Endpoints ----------
app.post("/convert/arrayToBST", (req, res) => {
  res.json(ds.arrayToBST());
});

app.post("/convert/llToBST", (req, res) => {
  res.json(ds.llToBST());
});

app.post("/convert/bstToArray", (req, res) => {
  res.json(ds.bstToArray());
});

app.post("/convert/bstToLL", (req, res) => {
  res.json(ds.bstToLL());
});

// ---------- Hash Table Endpoints ----------
app.post("/hash/insert", (req, res) => {
  const { value } = req.body;
  res.json(ds.hash_insert(value));
});

app.post("/hash/search", (req, res) => {
  const { value } = req.body;
  res.json(ds.hash_search(value));
});

app.post("/hash/delete", (req, res) => {
  const { value } = req.body;
  res.json(ds.hash_delete(value));
});

// ---------- Hash Table Converter Endpoints ----------
app.post("/convert/arrayToHash", (req, res) => {
  res.json(ds.arrayToHash());
});

app.post("/convert/hashToArray", (req, res) => {
  res.json(ds.hashToArray());
});

app.post("/convert/llToHash", (req, res) => {
  res.json(ds.llToHash());
});

app.post("/convert/hashToLL", (req, res) => {
  res.json(ds.hashToLL());
});

app.post("/convert/bstToHash", (req, res) => {
  res.json(ds.bstToHash());
});

app.post("/convert/hashToBST", (req, res) => {
  res.json(ds.hashToBST());
});

// ---------- Frontend Database Endpoint (Static Mode) ----------
app.get("/frontend/array", (req, res) => {
  res.json(ds.getFrontDatabase());
});

// =======================================================
// --- END: Static Endpoints ---
// =======================================================

// =======================================================
// --- START: Dynamic Endpoints (Prefix: /dy) ---
// =======================================================

// Dynamic Insert: Prefers Array push (no index) or LinkedList insert (with index)
app.post("/dy/insert", (req, res) => {
  const { index, value } = req.body;
  dynamicDS.insertAt(index, value);
  res.json({ 
    data: dynamicDS.getAll(), 
    type: dynamicDS.getType(),
    tree: dynamicDS.getTree()
  });
});

// Dynamic Remove: Uses LinkedList removeAt
app.delete("/dy/remove", (req, res) => {
  const { index } = req.body;
  dynamicDS.removeAt(index);
  res.json({ 
    data: dynamicDS.getAll(), 
    type: dynamicDS.getType(),
    tree: dynamicDS.getTree()
  });
});

// Dynamic Search: Uses BST search
app.get("/dy/search/:value", (req, res) => {
  // Attempt to parse value as number, if it fails, use the original string
  let value;
  const num = Number(req.params.value);
  // Check if the parameter can be converted to a meaningful number
  if (!isNaN(num) && req.params.value.trim() !== "") {
    value = num;
  } else {
    value = req.params.value;
  }

  const found = dynamicDS.search(value);
  res.json({ 
    found, 
    type: dynamicDS.getType(),
    data: dynamicDS.getAll(),
    tree: dynamicDS.getTree()
  });
});

// Dynamic Access by Index: Track index access operations
app.get("/dy/access/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0) {
    return res.status(400).json({ error: "Invalid index" });
  }
  
  const value = dynamicDS.accessByIndex(index);
  res.json({ 
    value,
    index,
    type: dynamicDS.getType(),
    data: dynamicDS.getAll(),
    tree: dynamicDS.getTree()
  });
});

// State: report type, size, history, nextType
app.get("/dy/state", (req, res) => {
  res.json(dynamicDS.getState());
});

// Dynamic Get All: Returns current data and type
app.get("/dy/all", (req, res) => {
  res.json({ 
    data: dynamicDS.getAll(), 
    type: dynamicDS.getType(),
    tree: dynamicDS.getTree()
  });
});

// Dynamic Sort: Sorts current data; preserves DS type while rebuilding
app.post("/dy/sort", (req, res) => {
  const { order } = req.body || {};
  const data = dynamicDS.sort(order === "desc" ? "desc" : "asc");
  res.json({
    data,
    type: dynamicDS.getType(),
    tree: dynamicDS.getTree(),
    order: order === "desc" ? "desc" : "asc",
  });
});

// Bulk add random numbers: { count, min?, max? }
app.post("/dy/bulk-add", (req, res) => {
  const { count, min, max } = req.body || {};
  const before = dynamicDS.getAll().length;
  const data = dynamicDS.bulkAdd(count, min, max);
  const after = data.length;
  res.json({
    data,
    type: dynamicDS.getType(),
    tree: dynamicDS.getTree(),
    added: Math.max(0, after - before),
  });
});

// Optional: clear all data
app.post("/dy/clear", (req, res) => {
  const data = dynamicDS.clear();
  res.json({ 
    data, 
    type: dynamicDS.getType(),
    tree: dynamicDS.getTree()
  });
});

// Set custom search threshold
app.post("/dy/thresholds/search", (req, res) => {
  try {
    const { threshold } = req.body;
    dynamicDS.setSearchThreshold(threshold);
    res.json({ 
      success: true,
      customThresholds: dynamicDS.getCustomThresholds()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Set custom insert threshold
app.post("/dy/thresholds/insert", (req, res) => {
  try {
    const { threshold } = req.body;
    dynamicDS.setInsertThreshold(threshold);
    res.json({ 
      success: true,
      customThresholds: dynamicDS.getCustomThresholds()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Set custom sort threshold
app.post("/dy/thresholds/sort", (req, res) => {
  try {
    const { threshold } = req.body;
    dynamicDS.setSortThreshold(threshold);
    res.json({ 
      success: true,
      customThresholds: dynamicDS.getCustomThresholds()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Set custom index threshold
app.post("/dy/thresholds/index", (req, res) => {
  try {
    const { threshold } = req.body;
    dynamicDS.setIndexThreshold(threshold);
    res.json({ 
      success: true,
      customThresholds: dynamicDS.getCustomThresholds()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get custom thresholds
app.get("/dy/thresholds", (req, res) => {
  res.json(dynamicDS.getCustomThresholds());
});

// =======================================================
// --- END: Dynamic Endpoints ---
// =======================================================

// ---------- Start Server ----------
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

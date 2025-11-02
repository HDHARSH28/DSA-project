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
  res.json({ data: dynamicDS.getAll(), type: dynamicDS.getType() });
});

// Dynamic Remove: Uses LinkedList removeAt
app.delete("/dy/remove", (req, res) => {
  const { index } = req.body;
  dynamicDS.removeAt(index);
  res.json({ data: dynamicDS.getAll(), type: dynamicDS.getType() });
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
  res.json({ found, type: dynamicDS.getType() });
});

// State: report type, size, history, nextType
app.get("/dy/state", (req, res) => {
  res.json(dynamicDS.getState());
});

// Dynamic Get All: Returns current data and type
app.get("/dy/all", (req, res) => {
  res.json({ data: dynamicDS.getAll(), type: dynamicDS.getType() });
});

// Dynamic Sort: Sorts current data; preserves DS type while rebuilding
app.post("/dy/sort", (req, res) => {
  const { order } = req.body || {};
  const data = dynamicDS.sort(order === "desc" ? "desc" : "asc");
  res.json({
    data,
    type: dynamicDS.getType(),
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
    added: Math.max(0, after - before),
  });
});

// Optional: clear all data
app.post("/dy/clear", (req, res) => {
  const data = dynamicDS.clear();
  res.json({ data, type: dynamicDS.getType() });
});

// =======================================================
// --- END: Dynamic Endpoints ---
// =======================================================

// ---------- Start Server ----------
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

// ---------- server.js ----------

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Wrapper = require('./main.js');


const app = express();
const ds = new Wrapper();

app.use(cors());
app.use(bodyParser.json());

// ---------- Linked List Endpoints ----------
app.post('/ll/insert_front', (req, res) => {
  const { value } = req.body;
  res.json(ds.ll_insert_front(value));
});

app.post('/ll/delete', (req, res) => {
  const { value } = req.body;
  res.json(ds.ll_delete(value));
});

app.post('/ll/search', (req, res) => {
  const { value } = req.body;
  res.json(ds.ll_search(value));
});

// ---------- Array Endpoints ----------
app.post('/arr/push', (req, res) => {
  const { value } = req.body;
  res.json(ds.arr_push(value));
});

app.post('/arr/delete', (req, res) => {
  const { value } = req.body;
  res.json(ds.arr_delete(value));
});

app.post('/arr/search', (req, res) => {
  const { value } = req.body;
  res.json(ds.arr_search(value));
});


// ---------- Converter Endpoints ----------
app.post('/convert/arrayToLL', (req, res) => {
  res.json(ds.arrayToLL());
});

app.post('/convert/llToArray', (req, res) => {
  res.json(ds.llToArray());
});

// ---------- Frontend Database Endpoint ----------
app.get('/frontend/array', (req, res) => {
  res.json(ds.getFrontDatabase());
});

// ---------- Start Server ----------
app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));

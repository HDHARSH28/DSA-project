// ---------- main.js ----------
const { performance } = require("perf_hooks");

class Wrapper {
  constructor() {
    this.head = null; // Linked List head
    this.arr = []; // Dynamic Array
    this.front_database = []; // Array for frontend rendering
    this.bst_root = null; //bst
  }

  // ---------- Linked List ----------
  _LLNode(value) {
    return { value: value, next: null };
  }

  // ---------- BST Node ----------
  _BSTNode(value) {
    return { value: value, left: null, right: null };
  }

  ll_insert_front(value) {
    const start = performance.now();
    const node = this._LLNode(value);
    node.next = this.head;
    this.head = node;

    const end = performance.now();
    // Update front_database outside timing
    this.front_database.unshift(value);
    return this._emit("LL_INSERT", "front", value, end - start);
  }

  ll_search(value) {
    const start = performance.now();

    let cur = this.head;
    while (cur) {
      if (cur.value === value) {
        const end = performance.now();
        return this._emit("LL_SEARCH", "found", value, end - start);
      }
      cur = cur.next;
    }

    const end = performance.now();
    return this._emit("LL_SEARCH", "not_found", value, end - start);
  }

  ll_delete(value) {
    const start = performance.now();
    let cur = this.head,
      prev = null;
    while (cur) {
      if (cur.value === value) {
        if (prev) prev.next = cur.next;
        else this.head = cur.next;
        const end = performance.now();
        // Remove from front_database outside timing
        const fidx = this.front_database.indexOf(value);
        if (fidx !== -1) this.front_database.splice(fidx, 1);
        return this._emit("LL_DELETE", "success", value, end - start);
      }
      prev = cur;
      cur = cur.next;
    }

    const end = performance.now();
    return this._emit("LL_DELETE", "not_found", value, end - start);
  }

  // ---------- Dynamic Array ----------

  arr_push(value) {
    const start = performance.now();
    // Always push to arr if not already present
    if (!this.arr.includes(value)) {
      this.arr.push(value);
    }
    // Always push to front_database if not already present
    if (!this.front_database.includes(value)) {
      this.front_database.push(value);
    }
    const end = performance.now();
    return this._emit("ARR_PUSH", "success", value, end - start);
  }

  arr_delete(value) {
    const start = performance.now();

    const idx = this.arr.indexOf(value);
    if (idx !== -1) {
      this.arr.splice(idx, 1);
      const end = performance.now();
      // Remove from front_database outside timing
      const fidx = this.front_database.indexOf(value);
      if (fidx !== -1) this.front_database.splice(fidx, 1);
      return this._emit("ARR_DELETE", "success", value, end - start);
    } else {
      const end = performance.now();
      return this._emit("ARR_DELETE", "not_found", value, end - start);
    }
  }
  arr_search(value) {
    const start = performance.now();
    if (this.arr.includes(value)) {
      const end = performance.now();
      return this._emit("ARR_SEARCH", "found", value, end - start);
    }

    const end = performance.now();
    return this._emit("ARR_SEARCH", "not_found", value, end - start);
  }
  // ---------- BST Insert ----------
  bst_insert(value) {
    const insertNode = (node, value) => {
      if (!node) return this._BSTNode(value);
      if (value < node.value) node.left = insertNode(node.left, value);
      else if (value > node.value) node.right = insertNode(node.right, value);
      // Ignore duplicates
      return node;
    };
    const start = performance.now();
    this.bst_root = insertNode(this.bst_root, value);
    const end = performance.now();
    // Optionally update front_database for BST (inorder traversal)
    this.front_database = this._bst_inorder();
    return this._emit("BST_INSERT", "success", value, end - start);
  }

  // ---------- BST Search ----------
  bst_search(value) {
    const start = performance.now();
    let cur = this.bst_root;
    while (cur) {
      if (value === cur.value) {
        const end = performance.now();
        return this._emit("BST_SEARCH", "found", value, end - start);
      }
      cur = value < cur.value ? cur.left : cur.right;
    }
    const end = performance.now();
    return this._emit("BST_SEARCH", "not_found", value, end - start);
  }

  // ---------- BST Delete ----------
  bst_delete(value) {
    const start = performance.now();
    const deleteNode = (node, value) => {
      if (!node) return null;
      if (value < node.value) node.left = deleteNode(node.left, value);
      else if (value > node.value) node.right = deleteNode(node.right, value);
      else {
        // Node to delete found
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        // Node with two children: get inorder successor
        let succ = node.right;
        while (succ.left) succ = succ.left;
        node.value = succ.value;
        node.right = deleteNode(node.right, succ.value);
      }
      return node;
    };
    const origRoot = this.bst_root;
    this.bst_root = deleteNode(this.bst_root, value);
    const end = performance.now();
    // Update front_database for BST (inorder traversal)
    this.front_database = this._bst_inorder();
    // Check if deletion happened
    if (this.front_database.indexOf(value) === -1)
      return this._emit("BST_DELETE", "success", value, end - start);
    else return this._emit("BST_DELETE", "not_found", value, end - start);
  }

  // ---------- BST Inorder Traversal (for front_database) ----------
  _bst_inorder() {
    const res = [];
    const inorder = (node) => {
      if (!node) return;
      inorder(node.left);
      res.push(node.value);
      inorder(node.right);
    };
    inorder(this.bst_root);
    return res;
  }
  // ---------- Frontend Database Getter ----------
  getFrontDatabase() {
    return { array: this.front_database };
  }

  // ---------- Emitter ----------

  _emit(op, detail = "", value = undefined, time = undefined) {
    const event = { op };
    if (detail) event.detail = detail;
    if (value !== undefined) event.value = value;
    if (time !== undefined) event.time_ms = time.toFixed(4); // ms
    return event; // Return JSON instead of console.log
  }

  // ...
  // ---------- Converters ----------
  arrayToLL() {
    const start = performance.now();
    this.head = null;
    for (let i = this.arr.length - 1; i >= 0; i--) {
      const node = this._LLNode(this.arr[i]);
      node.next = this.head;
      this.head = node;
    }
    // After building the LL, the front_database should be updated
    // to reflect the linked list, which is the same as the source array.
    const end = performance.now();
    this.front_database = [...this.arr];
    return this._emit("ARRAY_TO_LL", "success", this.arr, end - start);
  }

  llToArray() {
    const start = performance.now();
    let cur = this.head;
    const result = [];
    while (cur) {
      result.push(cur.value);
      cur = cur.next;
    }
    // Update the internal array and front_database to match the new array
    this.arr = result;
    const end = performance.now();
    this.front_database = result;
    return this._emit("LL_TO_ARRAY", "success", result, end - start);
  }
  arrayToBST() {
    const start = performance.now();
    this.bst_root = null;
    for (let v of this.arr) {
      this.bst_root = this._insertBSTNode(this.bst_root, v);
    }
    const end = performance.now();
    this.front_database = this._bst_inorder();
    return this._emit(
      "ARRAY_TO_BST",
      "success",
      this.front_database,
      end - start
    );
  }
  bstToArray() {
    const start = performance.now();
    const arr = this._bst_inorder();
    this.arr = arr;
    const end = performance.now();
    this.front_database = arr;
    return this._emit("BST_TO_ARRAY", "success", arr, end - start);
  }

  llToBST() {
    const start = performance.now();
    this.bst_root = null;
    let cur = this.head;
    while (cur) {
      this.bst_root = this._insertBSTNode(this.bst_root, cur.value);
      cur = cur.next;
    }
    const end = performance.now();
    this.front_database = this._bst_inorder();
    return this._emit("LL_TO_BST", "success", this.front_database, end - start);
  }

  bstToLL() {
    const start = performance.now();
    const arr = this._bst_inorder();
    this.head = null;
    for (let i = arr.length - 1; i >= 0; i--) {
      const node = this._LLNode(arr[i]);
      node.next = this.head;
      this.head = node;
    }
    const end = performance.now();
    this.front_database = arr;
    return this._emit("BST_TO_LL", "success", arr, end - start);
  }

  // Helper for BST insertion (used by converters)
  _insertBSTNode(node, value) {
    if (!node) return this._BSTNode(value);
    if (value < node.value) node.left = this._insertBSTNode(node.left, value);
    else if (value > node.value)
      node.right = this._insertBSTNode(node.right, value);
    return node;
  }
}
// ...
module.exports = Wrapper;

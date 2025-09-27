// ---------- main.js ----------
const { performance } = require("perf_hooks");

class Wrapper {
  constructor() {
    this.ll_head = null; // Linked List ll_head
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

  // ---------- Linked List ----------
  ll_insert_front(value) {
    const start = performance.now();
    const node = this._LLNode(value);
    node.next = this.ll_head;
    this.ll_head = node;

    const end = performance.now();
    // Update front_database outside timing
    this.front_database.unshift(value);
    return this._emit("LL_INSERT", "success (inserted at ll_head)", end - start);
  }

  ll_search(value) {
    const start = performance.now();
    let cur = this.ll_head;
    let index = 0;
    while (cur) {
      if (cur.value === value) {
        const end = performance.now();
        return this._emit(
          "LL_SEARCH",
          `found in ll at position ${index}`,
          end - start
        );
      }
      cur = cur.next;
      index++;
    }
    const end = performance.now();
    return this._emit("LL_SEARCH", "not found", end - start);
  }

  ll_delete(value) {
    const start = performance.now();
    let cur = this.ll_head,
      prev = null;
    let index = 0;
    while (cur) {
      if (cur.value === value) {
        if (prev) prev.next = cur.next;
        else this.ll_head = cur.next;
        const end = performance.now();
        // Remove from front_database outside timing
        const fidx = this.front_database.indexOf(value);
        if (fidx !== -1) this.front_database.splice(fidx, 1);
        return this._emit(
          "LL_DELETE",
          `deleted at position ${index}`,
          end - start
        );
      }
      prev = cur;
      cur = cur.next;
      index++;
    }

    const end = performance.now();
    return this._emit("LL_DELETE", "not found", end - start);
  }

  // ---------- Dynamic Array ----------

  arr_push(value) {
    const start = performance.now();
    // Always push to arr if not already present
    if (!this.arr.includes(value)) {
      this.arr.push(value);
    }
    const end = performance.now();
    // Always push to front_database if not already present
    if (!this.front_database.includes(value)) {
      this.front_database.push(value);
    }
    const idx = this.arr.indexOf(value);
    return this._emit("ARR_PUSH", `success index ${idx}`, end - start);
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
      return this._emit("ARR_DELETE", `deleted index ${idx}`, end - start);
    } else {
      const end = performance.now();
      return this._emit("ARR_DELETE", "not found", end - start);
    }
  }
  arr_search(value) {
    const start = performance.now();
    const idx = this.arr.indexOf(value);
    if (idx !== -1) {
      const end = performance.now();
      return this._emit("ARR_SEARCH", `found at index ${idx}`, end - start);
    }

    const end = performance.now();
    return this._emit("ARR_SEARCH", "not found", end - start);
  }

  // ---------- BST Operations ----------
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
    return this._emit("BST_INSERT", "success", end - start);
  }

  bst_search(value) {
    const start = performance.now();
    let cur = this.bst_root;
    while (cur) {
      if (value === cur.value) {
        const end = performance.now();
        return this._emit("BST_SEARCH", "found in bst", end - start);
      }
      cur = value < cur.value ? cur.left : cur.right;
    }
    const end = performance.now();
    return this._emit("BST_SEARCH", "not found", end - start);
  }

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
      return this._emit("BST_DELETE", "success", end - start);
    else return this._emit("BST_DELETE", "not found", end - start);
  }

  // ---------- BST Inorder Traversal ----------
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

  _emit(op, detail = "", time = undefined) {
    // Unified emitter: { op, detail, array, time }
    const event = {
      op,
      detail: detail || "",
      array: [...this.front_database],
      time: time !== undefined ? `${time.toFixed(4)} ms` : undefined,
    };
    return event;
  }

  // ---------- Converters ----------
  arrayToLL() {
    const start = performance.now();
    this.ll_head = null;
    for (let i = this.arr.length - 1; i >= 0; i--) {
      const node = this._LLNode(this.arr[i]);
      node.next = this.ll_head;
      this.ll_head = node;
    }
    // After building the LL, the front_database should be updated
    // to reflect the linked list, which is the same as the source array.
    const end = performance.now();
    this.front_database = [...this.arr];
    return this._emit("ARRAY_TO_LL", "success", end - start);
  }

  llToArray() {
    const start = performance.now();
    let cur = this.ll_head;
    const result = [];
    while (cur) {
      result.push(cur.value);
      cur = cur.next;
    }
    // Update the internal array and front_database to match the new array
    this.arr = result;
    const end = performance.now();
    this.front_database = result;
    return this._emit("LL_TO_ARRAY", "success", end - start);
  }
  arrayToBST() {
    const start = performance.now();
    this.bst_root = null;
    for (let i = 0; i < this.arr.length; i++) {
      this.bst_root = this._insertBSTNode(this.bst_root, this.arr[i]);
    }
    const end = performance.now();
    this.front_database = this._bst_inorder();
    return this._emit("ARRAY_TO_BST", "success", end - start);
  }
  bstToArray() {
    const start = performance.now();
    const arr = this._bst_inorder();
    this.arr = arr;
    const end = performance.now();
    this.front_database = arr;
    return this._emit("BST_TO_ARRAY", "success", end - start);
  }

  llToBST() {
    const start = performance.now();
    this.bst_root = null;
    let cur = this.ll_head;
    while (cur) {
      this.bst_root = this._insertBSTNode(this.bst_root, cur.value);
      cur = cur.next;
    }
    const end = performance.now();
    this.front_database = this._bst_inorder();
    return this._emit("LL_TO_BST", "success", end - start);
  }

  bstToLL() {
    const start = performance.now();
    const arr = this._bst_inorder();
    this.ll_head = null;
    for (let i = arr.length - 1; i >= 0; i--) {
      const node = this._LLNode(arr[i]);
      node.next = this.ll_head;
      this.ll_head = node;
    }
    const end = performance.now();
    this.front_database = arr;
    return this._emit("BST_TO_LL", "success", end - start);
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

module.exports = Wrapper;

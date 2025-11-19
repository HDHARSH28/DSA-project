// ---------- main.js ----------
const { performance } = require("perf_hooks");

class Wrapper {
  constructor() {
    this.ll_head = null; // Linked List ll_head
    this.arr = []; // Dynamic Array
    this.front_database = []; // Array for frontend rendering
    this.bst_root = null; //bst
    this.hashTable = new Map(); // Hash Table
  }

  // ---------- Linked List Node Helper ----------
  _LLNode(value) {
    return { value: value, next: null };
  }

  // ---------- BST Node Helper ----------
  // Added height field for AVL tree balancing
  _BSTNode(value) {
    return { value: value, left: null, right: null, height: 1 };
  }

  // ---------- Linked List Operations ----------
  ll_insert_front(value) {
    const start = performance.now();
    const node = this._LLNode(value);
    node.next = this.ll_head;
    this.ll_head = node;

    const end = performance.now();
    // Efficiently update front_database
    this.front_database.unshift(value);
    return this._emit(
      "LL_INSERT",
      "success (inserted at ll_head)",
      end - start
    );
  }

  ll_insert_end(value) {
    const start = performance.now();
    const node = this._LLNode(value);
    if (!this.ll_head) {
      this.ll_head = node;
    } else {
      let cur = this.ll_head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    }
    const end = performance.now();
    // Efficiently update front_database
    this.front_database.push(value);
    return this._emit("LL_INSERT", "success (inserted at tail)", end - start);
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
    let deleted = false;
    while (cur) {
      if (cur.value === value) {
        if (prev) prev.next = cur.next;
        else this.ll_head = cur.next;

        this.front_database.splice(index, 1);
        deleted = true;
        break; // Stop after deleting the first instance
      }
      prev = cur;
      cur = cur.next;
      index++;
    }

    const end = performance.now();
    if (deleted) {
      return this._emit(
        "LL_DELETE",
        `deleted at position ${index}`,
        end - start
      );
    } else {
      return this._emit("LL_DELETE", "not found", end - start);
    }
  }

  ll_sort_inc() {
    const start = performance.now();
    // Extract values to array
    const values = [];
    let cur = this.ll_head;
    while (cur) {
      values.push(cur.value);
      cur = cur.next;
    }
    values.sort((a, b) => a - b);

    // Rebuild linked list from sorted values
    this.ll_head = null;
    for (let i = values.length - 1; i >= 0; i--) {
      const node = this._LLNode(values[i]);
      node.next = this.ll_head;
      this.ll_head = node;
    }

    // Update front_database
    this.front_database = [...values];

    const end = performance.now();
    return this._emit("LL_SORT_INC", "sorted in increasing order", end - start);
  }

  ll_sort_dec() {
    const start = performance.now();
    // Extract values to array
    const values = [];
    let cur = this.ll_head;
    while (cur) {
      values.push(cur.value);
      cur = cur.next;
    }
    values.sort((a, b) => b - a);

    // Rebuild linked list from sorted values
    this.ll_head = null;
    for (let i = values.length - 1; i >= 0; i--) {
      const node = this._LLNode(values[i]);
      node.next = this.ll_head;
      this.ll_head = node;
    }

    // Update front_database
    this.front_database = [...values];

    const end = performance.now();
    return this._emit("LL_SORT_DEC", "sorted in decreasing order", end - start);
  }
  // ---------- Dynamic Array Operations ----------

  arr_push(value) {
    const start = performance.now();
    this.arr.push(value);
    const end = performance.now();
    this.front_database.push(value);
    const idx = this.arr.length - 1;
    return this._emit(
      "ARR_PUSH",
      `success Item Pushed in the Array at index ${idx}`,
      end - start
    );
  }

  arr_delete(value) {
    const start = performance.now();

    const idx = this.arr.indexOf(value);
    if (idx !== -1) {
      this.arr.splice(idx, 1);
      const end = performance.now();
      // Remove from front_database at the same index
      this.front_database.splice(idx, 1);
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

  arr_sort_inc() {
    const start = performance.now();
    this.arr.sort((a, b) => a - b);
    const end = performance.now();
    // Update front_database to match sorted array
    this.front_database = [...this.arr];
    return this._emit(
      "ARR_SORT_INC",
      "sorted in increasing order",
      end - start
    );
  }

  arr_sort_dec() {
    const start = performance.now();
    this.arr.sort((a, b) => b - a);
    const end = performance.now();
    // Update front_database to match sorted array
    this.front_database = [...this.arr];
    return this._emit(
      "ARR_SORT_DEC",
      "sorted in decreasing order",
      end - start
    );
  }

  // ---------- BST Operations ----------
  bst_insert(value) {
    // Helper used for both insert and converters
    const start = performance.now();
    this.bst_root = this._insertBSTNode(this.bst_root, value);
    const end = performance.now();
    // Update front_database for BST (inorder traversal)
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
      // Uses the same comparison logic as insert (value < cur.value goes left)
      cur = value < cur.value ? cur.left : cur.right;
    }
    const end = performance.now();
    return this._emit("BST_SEARCH", "not found", end - start);
  }

  bst_delete(value) {
    const start = performance.now();
    let deleted = false;

    // AVL delete implementation that sets deleted flag when a node is removed
    const _height = (node) => (node ? node.height : 0);
    const _getBalance = (node) =>
      node ? _height(node.left) - _height(node.right) : 0;

    const _rightRotate = (y) => {
      const x = y.left;
      const T2 = x.right;

      // Perform rotation
      x.right = y;
      y.left = T2;

      // Update heights
      y.height = Math.max(_height(y.left), _height(y.right)) + 1;
      x.height = Math.max(_height(x.left), _height(x.right)) + 1;

      return x;
    };

    const _leftRotate = (x) => {
      const y = x.right;
      const T2 = y.left;

      // Perform rotation
      y.left = x;
      x.right = T2;

      // Update heights
      x.height = Math.max(_height(x.left), _height(x.right)) + 1;
      y.height = Math.max(_height(y.left), _height(y.right)) + 1;

      return y;
    };

    const _minValueNode = (node) => {
      let current = node;
      while (current.left) current = current.left;
      return current;
    };

    const deleteAVL = (node, value) => {
      if (!node) return null;

      if (value < node.value) {
        node.left = deleteAVL(node.left, value);
      } else if (value > node.value) {
        node.right = deleteAVL(node.right, value);
      } else {
        // Node to be deleted found
        deleted = true;

        // node with only one child or no child
        if (!node.left || !node.right) {
          const temp = node.left ? node.left : node.right;
          if (!temp) {
            // no child
            node = null;
          } else {
            // one child
            node = temp;
          }
        } else {
          // node with two children: get the inorder successor (smallest in the right subtree)
          const temp = _minValueNode(node.right);
          // Copy the inorder successor's data to this node
          node.value = temp.value;
          // Delete the inorder successor
          node.right = deleteAVL(node.right, temp.value);
        }
      }

      // If the tree had only one node then return
      if (!node) return node;

      // Update height
      node.height = Math.max(_height(node.left), _height(node.right)) + 1;

      // Get balance
      const balance = _getBalance(node);

      // Left Left Case
      if (balance > 1 && _getBalance(node.left) >= 0) {
        return _rightRotate(node);
      }

      // Left Right Case
      if (balance > 1 && _getBalance(node.left) < 0) {
        node.left = _leftRotate(node.left);
        return _rightRotate(node);
      }

      // Right Right Case
      if (balance < -1 && _getBalance(node.right) <= 0) {
        return _leftRotate(node);
      }

      // Right Left Case
      if (balance < -1 && _getBalance(node.right) > 0) {
        node.right = _rightRotate(node.right);
        return _leftRotate(node);
      }

      return node;
    };

    this.bst_root = deleteAVL(this.bst_root, value);
    const end = performance.now();

    // Update front_database for BST (inorder traversal)
    this.front_database = this._bst_inorder();

    // Check if deletion happened using the 'deleted' flag
    if (deleted) return this._emit("BST_DELETE", "success", end - start);
    return this._emit("BST_DELETE", "not found", end - start);
  }

  // ---------- Hash Table Operations ----------
  hash_insert(value) {
    const start = performance.now();
    this.hashTable.set(value, true);
    const end = performance.now();
    this.front_database = Array.from(this.hashTable.keys());
    return this._emit("HASH_INSERT", "success", end - start);
  }

  hash_search(value) {
    const start = performance.now();
    const found = this.hashTable.has(value);
    const end = performance.now();
    if (found) {
      return this._emit("HASH_SEARCH", "found in hash table", end - start);
    } else {
      return this._emit("HASH_SEARCH", "not found", end - start);
    }
  }

  hash_delete(value) {
    const start = performance.now();
    const deleted = this.hashTable.delete(value);
    const end = performance.now();
    this.front_database = Array.from(this.hashTable.keys());
    if (deleted) {
      return this._emit("HASH_DELETE", "success", end - start);
    } else {
      return this._emit("HASH_DELETE", "not found", end - start);
    }
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
    return { array: this.front_database, tree: this._cloneBST(this.bst_root) };
  }

  // ---------- Emitter ----------
  _emit(op, detail = "", time = undefined) {
    // Unified emitter: { op, detail, array, time }
    const event = {
      op,
      detail: detail || "",
      array: [...this.front_database],
      tree: this._cloneBST(this.bst_root),
      time: time !== undefined ? `${time.toFixed(4)} ms` : undefined,
    };
    return event;
  }

  // ---------- Converters ----------
  arrayToLL() {
    const start = performance.now();
    this.ll_head = null;
    // Build the LL in reverse to maintain original array order
    for (let i = this.arr.length - 1; i >= 0; i--) {
      const node = this._LLNode(this.arr[i]);
      node.next = this.ll_head;
      this.ll_head = node;
    }
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
    // Update the internal array and front_database
    this.arr = result;
    const end = performance.now();
    this.front_database = [...result];
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
    this.front_database = [...arr];
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
    // Build the LL in reverse from the sorted inorder array
    for (let i = arr.length - 1; i >= 0; i--) {
      const node = this._LLNode(arr[i]);
      node.next = this.ll_head;
      this.ll_head = node;
    }
    const end = performance.now();
    this.front_database = [...arr];
    return this._emit("BST_TO_LL", "success", end - start);
  }

  // ---------- Hash Table Converters ----------
  arrayToHash() {
    const start = performance.now();
    this.hashTable.clear();
    for (let i = 0; i < this.arr.length; i++) {
      this.hashTable.set(this.arr[i], true);
    }
    const end = performance.now();
    this.front_database = Array.from(this.hashTable.keys());
    return this._emit("ARRAY_TO_HASH", "success", end - start);
  }

  hashToArray() {
    const start = performance.now();
    this.arr = Array.from(this.hashTable.keys());
    const end = performance.now();
    this.front_database = [...this.arr];
    return this._emit("HASH_TO_ARRAY", "success", end - start);
  }

  llToHash() {
    const start = performance.now();
    this.hashTable.clear();
    let cur = this.ll_head;
    while (cur) {
      this.hashTable.set(cur.value, true);
      cur = cur.next;
    }
    const end = performance.now();
    this.front_database = Array.from(this.hashTable.keys());
    return this._emit("LL_TO_HASH", "success", end - start);
  }

  hashToLL() {
    const start = performance.now();
    const arr = Array.from(this.hashTable.keys());
    this.ll_head = null;
    for (let i = arr.length - 1; i >= 0; i--) {
      const node = this._LLNode(arr[i]);
      node.next = this.ll_head;
      this.ll_head = node;
    }
    const end = performance.now();
    this.front_database = [...arr];
    return this._emit("HASH_TO_LL", "success", end - start);
  }

  bstToHash() {
    const start = performance.now();
    const arr = this._bst_inorder();
    this.hashTable.clear();
    for (let i = 0; i < arr.length; i++) {
      this.hashTable.set(arr[i], true);
    }
    const end = performance.now();
    this.front_database = Array.from(this.hashTable.keys());
    return this._emit("BST_TO_HASH", "success", end - start);
  }

  hashToBST() {
    const start = performance.now();
    this.bst_root = null;
    const arr = Array.from(this.hashTable.keys());
    for (let i = 0; i < arr.length; i++) {
      this.bst_root = this._insertBSTNode(this.bst_root, arr[i]);
    }
    const end = performance.now();
    this.front_database = this._bst_inorder();
    return this._emit("HASH_TO_BST", "success", end - start);
  }

  // Helper for BST insertion (used by insert and converters)
  // Replaced with AVL insertion to keep tree balanced
  _insertBSTNode(node, value) {
    // AVL insert
    const _height = (n) => (n ? n.height : 0);
    const _getBalance = (n) => (n ? _height(n.left) - _height(n.right) : 0);

    const _rightRotate = (y) => {
      const x = y.left;
      const T2 = x.right;
      x.right = y;
      y.left = T2;
      y.height = Math.max(_height(y.left), _height(y.right)) + 1;
      x.height = Math.max(_height(x.left), _height(x.right)) + 1;
      return x;
    };

    const _leftRotate = (x) => {
      const y = x.right;
      const T2 = y.left;
      y.left = x;
      x.right = T2;
      x.height = Math.max(_height(x.left), _height(x.right)) + 1;
      y.height = Math.max(_height(y.left), _height(y.right)) + 1;
      return y;
    };

    // Standard BST insert
    if (!node) return this._BSTNode(value);

    if (value <= node.value) node.left = this._insertBSTNode(node.left, value);
    else if (value > node.value)
      node.right = this._insertBSTNode(node.right, value);
    else return node; // equal values handled by <= branch, but keep safe

    // Update height
    node.height = 1 + Math.max(_height(node.left), _height(node.right));

    // Get balance factor
    const balance = _getBalance(node);

    // If node becomes unbalanced, then 4 cases

    // Left Left
    if (balance > 1 && value <= node.left.value) {
      return _rightRotate(node);
    }

    // Left Right
    if (balance > 1 && value > node.left.value) {
      node.left = _leftRotate(node.left);
      return _rightRotate(node);
    }

    // Right Right
    if (balance < -1 && value > node.right.value) {
      return _leftRotate(node);
    }

    // Right Left
    if (balance < -1 && value <= node.right.value) {
      node.right = _rightRotate(node.right);
      return _leftRotate(node);
    }

    return node;
  }

  // Return a plain serializable clone of the BST for the frontend visualizer
  _cloneBST(node) {
    if (!node) return null;
    return {
      value: node.value,
      left: this._cloneBST(node.left),
      right: this._cloneBST(node.right),
    };
  }
}

module.exports = Wrapper;

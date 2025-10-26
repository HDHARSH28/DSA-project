// New dynamic data-structure manager with adaptive switching (last-5 ops + size thresholds)

// ---------------- Linked List ----------------
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }
  insertAt(index, value) {
    const node = new ListNode(value);
    if (index <= 0 || !this.head) {
      node.next = this.head;
      this.head = node;
      this.length++;
      return;
    }
    let curr = this.head,
      prev = null,
      i = 0;
    while (curr && i < index) {
      prev = curr;
      curr = curr.next;
      i++;
    }
    if (prev) {
      node.next = curr;
      prev.next = node;
      this.length++;
    }
  }
  removeAt(index) {
    if (!this.head || index < 0) return;
    if (index === 0) {
      this.head = this.head.next;
      this.length = Math.max(0, this.length - 1);
      return;
    }
    let curr = this.head,
      prev = null,
      i = 0;
    while (curr && i < index) {
      prev = curr;
      curr = curr.next;
      i++;
    }
    if (curr && prev) {
      prev.next = curr.next;
      this.length = Math.max(0, this.length - 1);
    }
  }
  toArray() {
    const arr = [];
    let curr = this.head;
    while (curr) {
      arr.push(curr.value);
      curr = curr.next;
    }
    return arr;
  }
}

// ---------------- Balanced BST (AVL) ----------------
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
    this._size = 0;
  }
  height(n) {
    return n ? n.height : 0;
  }
  get size() {
    return this._size;
  }
  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    return x;
  }
  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    return y;
  }
  getBalance(n) {
    return n ? this.height(n.left) - this.height(n.right) : 0;
  }
  insert(value) {
    this.root = this._insert(this.root, value);
    this._size++;
  }
  _insert(node, value) {
    if (!node) return new AVLNode(value);
    if (value <= node.value) node.left = this._insert(node.left, value);
    else node.right = this._insert(node.right, value);
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const bal = this.getBalance(node);
    if (bal > 1 && value <= node.left.value) return this.rightRotate(node);
    if (bal > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (bal < -1 && value > node.right.value) return this.leftRotate(node);
    if (bal < -1 && value <= node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }
    return node;
  }
  search(value) {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) return true;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return false;
  }
  minValueNode(node) {
    let cur = node;
    while (cur.left) cur = cur.left;
    return cur;
  }
  delete(value) {
    const before = this._size;
    this.root = this._delete(this.root, value);
    if (this._size < before) return true;
    return false;
  }
  _delete(root, value) {
    if (!root) return root;
    if (value < root.value) root.left = this._delete(root.left, value);
    else if (value > root.value) root.right = this._delete(root.right, value);
    else {
      // found
      this._size--;
      if (!root.left || !root.right) {
        const temp = root.left ? root.left : root.right;
        root = temp || null;
      } else {
        const temp = this.minValueNode(root.right);
        root.value = temp.value;
        root.right = this._delete(root.right, temp.value);
      }
    }
    if (!root) return root;
    root.height = 1 + Math.max(this.height(root.left), this.height(root.right));
    const bal = this.getBalance(root);
    if (bal > 1 && this.getBalance(root.left) >= 0) return this.rightRotate(root);
    if (bal > 1 && this.getBalance(root.left) < 0) {
      root.left = this.leftRotate(root.left);
      return this.rightRotate(root);
    }
    if (bal < -1 && this.getBalance(root.right) <= 0) return this.leftRotate(root);
    if (bal < -1 && this.getBalance(root.right) > 0) {
      root.right = this.rightRotate(root.right);
      return this.leftRotate(root);
    }
    return root;
  }
  inorder(node, out) {
    if (!node) return;
    this.inorder(node.left, out);
    out.push(node.value);
    this.inorder(node.right, out);
  }
  toArray() {
    const arr = [];
    this.inorder(this.root, arr);
    return arr;
  }
}

// ---------------- Array wrapper ----------------
class ArrayDS {
  constructor(values = []) {
    this.arr = Array.isArray(values) ? values.slice() : [];
  }
  push(v) {
    this.arr.push(v);
  }
  insertAt(index, value) {
    const i = Math.max(0, Math.min(index, this.arr.length));
    this.arr.splice(i, 0, value);
  }
  removeAt(index) {
    if (index < 0 || index >= this.arr.length) return;
    this.arr.splice(index, 1);
  }
  toArray() {
    return this.arr.slice();
  }
  get length() {
    return this.arr.length;
  }
}

// ---------------- Dynamic Manager ----------------
class DynamicDS {
  constructor() {
    this.type = "array"; // array | linkedlist | bst
    this.ds = new ArrayDS();
    this.opHistory = []; // last 5 ops: 'index' | 'search' | 'insert_delete'
  }

  // --- helpers ---
  _size() {
    if (this.type === "array") return this.ds.length;
    if (this.type === "linkedlist") return this.ds.length ?? this.ds.toArray().length;
    if (this.type === "bst") return this.ds.size ?? this.ds.toArray().length;
    return 0;
  }
  _toArray() {
    if (this.type === "array") return this.ds.toArray();
    return this.ds.toArray();
  }
  _record(op) {
    this.opHistory.push(op);
    if (this.opHistory.length > 5) this.opHistory.shift();
  }
  _choosePreferredType() {
    const size = this._size();
    const counts = { index: 0, search: 0, insert_delete: 0 };
    for (const o of this.opHistory) counts[o] = (counts[o] || 0) + 1;
    // Frequency-based override first
    if (counts.search >= 3) return "bst";
    if (counts.index >= 3) return "array";
    if (counts.insert_delete >= 3) return "linkedlist";
    // Size-based default
    if (size < 100) return "array";
    if (size < 1000) return "linkedlist";
    return "bst";
  }
  _convertTo(type) {
    if (this.type === type) return;
    const data = this._toArray();
    if (type === "array") {
      this.ds = new ArrayDS(data);
    } else if (type === "linkedlist") {
      const ll = new LinkedList();
      for (let i = 0; i < data.length; i++) ll.insertAt(i, data[i]);
      this.ds = ll;
    } else if (type === "bst") {
      const bst = new AVLTree();
      for (const v of data) bst.insert(v);
      this.ds = bst;
    }
    this.type = type;
  }
  _reconsider() {
    const target = this._choosePreferredType();
    this._convertTo(target);
  }

  // --- public API ---
  insertAt(index, value) {
    const hasIndex = Number.isInteger(index);
    if (hasIndex) {
      // index-based insertion prefers array
      if (this.type !== "array") this._convertTo("array");
      this.ds.insertAt(index, value);
      this._record("index");
    } else {
      // end push — generic insert/delete bucket
      if (this.type === "array") this.ds.push(value);
      else if (this.type === "linkedlist") this.ds.insertAt(this.ds.length, value);
      else if (this.type === "bst") this.ds.insert(value);
      else {
        this._convertTo("array");
        this.ds.push(value);
      }
      this._record("insert_delete");
    }
    this._reconsider();
    return this.getAll();
  }

  removeAt(index) {
    if (!Number.isInteger(index)) return this.getAll();
    // index-based deletion prefers linked list or array; use array for simplicity
    if (this.type !== "array") this._convertTo("array");
    this.ds.removeAt(index);
    this._record("index");
    this._reconsider();
    return this.getAll();
  }

  search(value) {
    // don't switch immediately; record and then reconsider
    let found = false;
    if (this.type === "bst") found = this.ds.search(value);
    else {
      // linear scan
      const arr = this._toArray();
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
          found = true;
          break;
        }
      }
    }
    this._record("search");
    this._reconsider();
    return found;
  }

  sort(order = "asc") {
    // Sorting produces a BST (ascending via inorder), desc via reverse
    const data = this._toArray();
    data.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const sorted = order === "desc" ? data.slice().reverse() : data;
    // rebuild as BST to make searching efficient after a sort
    this.ds = new AVLTree();
    for (const v of sorted) this.ds.insert(v);
    this.type = "bst";
    // Count as search-friendly change to bias towards bst
    this._record("search");
    this._reconsider();
    return sorted;
  }

  bulkAdd(count = 10, min = 0, max = 1000) {
    const c = Math.max(0, Math.min(Number(count) || 0, 100000));
    if (c === 0) return this.getAll();
    // operate in array for speed
    const arr = this._toArray();
    for (let i = 0; i < c; i++) {
      const v = Math.floor(Math.random() * (max - min + 1)) + min;
      arr.push(v);
    }
    this.type = "array";
    this.ds = new ArrayDS(arr);
    // push multiple inserts into history (cap to 5)
    const pushes = Math.min(5, Math.ceil(c / 2));
    for (let i = 0; i < pushes; i++) this._record("insert_delete");
    this._reconsider();
    return this.getAll();
  }

  clear() {
    this.type = "array";
    this.ds = new ArrayDS();
    this.opHistory = [];
    return this.getAll();
  }

  getAll() {
    return this._toArray();
  }
  getType() {
    return this.type;
  }

  getState() {
    return {
      type: this.type,
      size: this._size(),
      history: this.opHistory.slice(-5),
      nextType: this._choosePreferredType(),
    };
  }
}

module.exports = DynamicDS;

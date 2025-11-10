// ---------- dynamic.js ----------
// DynamicDS class with 3-phase adaptive switching system
const { performance } = require("perf_hooks");

class DynamicDS {
  constructor() {
    // Core data structure storage
    this.type = "array"; // current type: 'array', 'linkedlist', or 'bst'
    this.array = [];
    this.ll_head = null;
    this.bst_root = null;

    // Operation tracking for frequency-based switching
    this.freq = { search: 0, index: 0, insert: 0 };
    
    // Phase system
    this.phase = 1; // current phase (1, 2, or 3)
    this.threshold = 3; // current threshold based on phase
    
    // Timestamp tracking for idle detection
    this.lastOpTime = Date.now();
    this.IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // Operation history
    this.history = [];
  }

  // ========================================
  // Phase Management
  // ========================================
  
  /**
   * Update phase and threshold based on current size
   */
  _updatePhase() {
    const size = this._size();
    
    if (size < 100) {
      this.phase = 1;
      this.threshold = 3;
    } else if (size >= 100 && size <= 500) {
      this.phase = 2;
      this.threshold = 6;
    } else {
      this.phase = 3;
      this.threshold = 9;
    }
  }

  /**
   * Get the size of current data structure
   */
  _size() {
    switch (this.type) {
      case "array":
        return this.array.length;
      case "linkedlist":
        let count = 0;
        let cur = this.ll_head;
        while (cur) {
          count++;
          cur = cur.next;
        }
        return count;
      case "bst":
        const countNodes = (node) => {
          if (!node) return 0;
          return 1 + countNodes(node.left) + countNodes(node.right);
        };
        return countNodes(this.bst_root);
      default:
        return 0;
    }
  }

  /**
   * Check if system has been idle for 5 minutes
   * If so, reset to phase default structure
   */
  _checkIdleTimeout() {
    const now = Date.now();
    const timeSinceLastOp = now - this.lastOpTime;
    
    if (timeSinceLastOp > this.IDLE_TIMEOUT) {
      console.log(`[IDLE TIMEOUT] ${timeSinceLastOp}ms since last operation. Resetting to phase default...`);
      this._resetToPhaseDefault();
      this._resetFrequencies();
    }
  }

  /**
   * Reset to the default structure for current phase
   */
  _resetToPhaseDefault() {
    let targetType;
    
    switch (this.phase) {
      case 1:
        targetType = "array";
        break;
      case 2:
        targetType = "linkedlist";
        break;
      case 3:
        targetType = "bst";
        break;
      default:
        targetType = "array";
    }
    
    if (this.type !== targetType) {
      console.log(`[PHASE DEFAULT] Converting to ${targetType} for phase ${this.phase}`);
      this._convertTo(targetType);
    }
  }

  /**
   * Update last operation timestamp
   */
  _updateTimestamp() {
    this.lastOpTime = Date.now();
  }

  /**
   * Reset all operation frequencies to 0
   */
  _resetFrequencies() {
    this.freq = { search: 0, index: 0, insert: 0 };
    console.log("[FREQ RESET] All operation frequencies reset to 0");
  }

  /**
   * Increment operation frequency and check if threshold reached
   * @param {string} opType - 'search', 'index', or 'insert'
   */
  _trackOperation(opType) {
    this._updateTimestamp();
    this._updatePhase();
    this._checkIdleTimeout();
    
    // Increment the frequency counter
    if (opType in this.freq) {
      this.freq[opType]++;
      console.log(`[FREQ] ${opType}: ${this.freq[opType]}/${this.threshold} (Phase ${this.phase})`);
      
      // Check if threshold reached for this operation
      if (this.freq[opType] >= this.threshold) {
        console.log(`[THRESHOLD REACHED] ${opType} reached ${this.threshold}. Switching structure...`);
        this._handleThresholdSwitch(opType);
      }
    }
  }

  /**
   * Handle automatic switching when threshold is reached
   * @param {string} opType - operation that triggered the switch
   */
  _handleThresholdSwitch(opType) {
    let targetType = this.type; // default to current
    
    switch (opType) {
      case "search":
        targetType = "bst";
        break;
      case "index":
        targetType = "array";
        break;
      case "insert":
        targetType = "linkedlist";
        break;
    }
    
    // Only convert if different from current type
    if (targetType !== this.type) {
      console.log(`[AUTO SWITCH] ${opType} threshold hit → switching to ${targetType}`);
      this._convertTo(targetType);
      this._resetFrequencies();
    } else {
      console.log(`[AUTO SWITCH] Already using optimal structure (${targetType})`);
      this._resetFrequencies();
    }
  }

  // ========================================
  // Data Structure Helpers
  // ========================================

  _LLNode(value) {
    return { value, next: null };
  }

  _BSTNode(value) {
    return { value, left: null, right: null, height: 1 };
  }

  // ========================================
  // Core Operations
  // ========================================

  /**
   * Insert at index (or append if no index)
   */
  insertAt(index, value) {
  // Track this as an insert operation for adaptive switching
  this._trackOperation("insert");

  // Handle "no index" case — just append
  if (index === undefined || index === null) {
    return this._append(value);
  }

  switch (this.type) {
    case "array":
      if (index < 0) index = 0;
      if (index > this.array.length) index = this.array.length;
      this.array.splice(index, 0, value);
      console.log(`[ARRAY] Inserted ${value} at index ${index}`);
      break;

    case "linkedlist":
      this._llInsertAt(index, value);
      console.log(`[LINKEDLIST] Inserted ${value} at index ${index}`);
      break;

    case "bst":
      this._bstInsert(value);
      console.log(`[BST] Inserted ${value} (index ignored, BST auto-places)`);
      break;

    default:
      console.error(`[ERROR] Unknown structure type: ${this.type}`);
  }

  return true; // Indicate success
}


  /**
   * Append value to end of structure
   */
  _append(value) {
    switch (this.type) {
      case "array":
        this.array.push(value);
        break;
      case "linkedlist":
        const node = this._LLNode(value);
        if (!this.ll_head) {
          this.ll_head = node;
        } else {
          let cur = this.ll_head;
          while (cur.next) cur = cur.next;
          cur.next = node;
        }
        break;
      case "bst":
        this._bstInsert(value);
        break;
    }
  }

  /**
   * Remove at index
   */
  removeAt(index) {
    this._trackOperation("insert"); // delete is similar to insert
    
    switch (this.type) {
      case "array":
        if (index >= 0 && index < this.array.length) {
          this.array.splice(index, 1);
        }
        break;
      case "linkedlist":
        this._llRemoveAt(index);
        break;
      case "bst":
        // BST: remove by value at that index in inorder
        const vals = this._bstInorder();
        if (index >= 0 && index < vals.length) {
          this._bstDelete(vals[index]);
        }
        break;
    }
  }

  /**
   * Search for a value
   */
  search(value) {
    this._trackOperation("search");
    
    switch (this.type) {
      case "array":
        return this.array.includes(value);
      case "linkedlist":
        let cur = this.ll_head;
        while (cur) {
          if (cur.value === value) return true;
          cur = cur.next;
        }
        return false;
      case "bst":
        return this._bstSearch(value);
      default:
        return false;
    }
  }

  /**
   * Access element by index (tracks index frequency)
   */
  accessByIndex(index) {
    this._trackOperation("index");
    
    const data = this.getAll();
    if (index < 0 || index >= data.length) {
      return null;
    }
    return data[index];
  }

  /**
   * Get all data as array
   */
  getAll() {
    switch (this.type) {
      case "array":
        return [...this.array];
      case "linkedlist":
        const result = [];
        let cur = this.ll_head;
        while (cur) {
          result.push(cur.value);
          cur = cur.next;
        }
        return result;
      case "bst":
        return this._bstInorder();
      default:
        return [];
    }
  }

  /**
   * Get current type
   */
  getType() {
    return this.type;
  }

  /**
   * Get BST tree structure (for visualization)
   */
  getTree() {
    if (this.type === "bst") {
      return this._cloneBST(this.bst_root);
    }
    return null;
  }

  /**
   * Sort data
   */
  sort(order = "asc") {
    this._trackOperation("search"); // BST gives sorted data via inorder traversal
    
    const data = this.getAll();
    data.sort((a, b) => {
      if (order === "desc") return b - a;
      return a - b;
    });
    
    // Rebuild structure with sorted data
    this._rebuildWith(data);
    return this.getAll();
  }

  /**
   * Bulk add random numbers
   */
  bulkAdd(count = 10, min = 0, max = 1000) {
    this._trackOperation("insert"); // Bulk add is inserting multiple elements
    
    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      this._append(value);
    }
    return this.getAll();
  }

  /**
   * Clear all data
   */
  clear() {
    this._updateTimestamp();
    this.array = [];
    this.ll_head = null;
    this.bst_root = null;
    this.type = "array";
    this._resetFrequencies();
    this._updatePhase();
    return [];
  }

  /**
   * Get current state info
   */
  getState() {
    return {
      type: this.type,
      size: this._size(),
      phase: this.phase,
      threshold: this.threshold,
      freq: { ...this.freq },
      lastOpTime: this.lastOpTime,
      idleTime: Date.now() - this.lastOpTime,
      history: [...this.history].slice(0, 10)
    };
  }

  // ========================================
  // Linked List Helpers
  // ========================================

  _llInsertAt(index, value) {
    const node = this._LLNode(value);
    if (index === 0) {
      node.next = this.ll_head;
      this.ll_head = node;
      return;
    }
    
    let cur = this.ll_head;
    let i = 0;
    while (cur && i < index - 1) {
      cur = cur.next;
      i++;
    }
    
    if (cur) {
      node.next = cur.next;
      cur.next = node;
    }
  }

  _llRemoveAt(index) {
    if (!this.ll_head) return;
    
    if (index === 0) {
      this.ll_head = this.ll_head.next;
      return;
    }
    
    let cur = this.ll_head;
    let i = 0;
    while (cur && i < index - 1) {
      cur = cur.next;
      i++;
    }
    
    if (cur && cur.next) {
      cur.next = cur.next.next;
    }
  }

  // ========================================
  // BST Helpers (AVL Implementation)
  // ========================================

  _height(node) {
    return node ? node.height : 0;
  }

  _getBalance(node) {
    return node ? this._height(node.left) - this._height(node.right) : 0;
  }

  _rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this._height(y.left), this._height(y.right)) + 1;
    x.height = Math.max(this._height(x.left), this._height(x.right)) + 1;
    return x;
  }

  _leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this._height(x.left), this._height(x.right)) + 1;
    y.height = Math.max(this._height(y.left), this._height(y.right)) + 1;
    return y;
  }

  _bstInsert(value) {
    const insertNode = (node, value) => {
      if (!node) return this._BSTNode(value);
      
      if (value <= node.value) {
        node.left = insertNode(node.left, value);
      } else {
        node.right = insertNode(node.right, value);
      }
      
      node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
      const balance = this._getBalance(node);
      
      // Left Left
      if (balance > 1 && value <= node.left.value) {
        return this._rightRotate(node);
      }
      
      // Left Right
      if (balance > 1 && value > node.left.value) {
        node.left = this._leftRotate(node.left);
        return this._rightRotate(node);
      }
      
      // Right Right
      if (balance < -1 && value > node.right.value) {
        return this._leftRotate(node);
      }
      
      // Right Left
      if (balance < -1 && value <= node.right.value) {
        node.right = this._rightRotate(node.right);
        return this._leftRotate(node);
      }
      
      return node;
    };
    
    this.bst_root = insertNode(this.bst_root, value);
  }

  _bstSearch(value) {
    let cur = this.bst_root;
    while (cur) {
      if (value === cur.value) return true;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return false;
  }

  _bstDelete(value) {
    const minValueNode = (node) => {
      let current = node;
      while (current.left) current = current.left;
      return current;
    };
    
    const deleteNode = (node, value) => {
      if (!node) return null;
      
      if (value < node.value) {
        node.left = deleteNode(node.left, value);
      } else if (value > node.value) {
        node.right = deleteNode(node.right, value);
      } else {
        if (!node.left || !node.right) {
          const temp = node.left ? node.left : node.right;
          if (!temp) {
            node = null;
          } else {
            node = temp;
          }
        } else {
          const temp = minValueNode(node.right);
          node.value = temp.value;
          node.right = deleteNode(node.right, temp.value);
        }
      }
      
      if (!node) return node;
      
      node.height = Math.max(this._height(node.left), this._height(node.right)) + 1;
      const balance = this._getBalance(node);
      
      if (balance > 1 && this._getBalance(node.left) >= 0) {
        return this._rightRotate(node);
      }
      
      if (balance > 1 && this._getBalance(node.left) < 0) {
        node.left = this._leftRotate(node.left);
        return this._rightRotate(node);
      }
      
      if (balance < -1 && this._getBalance(node.right) <= 0) {
        return this._leftRotate(node);
      }
      
      if (balance < -1 && this._getBalance(node.right) > 0) {
        node.right = this._rightRotate(node.right);
        return this._leftRotate(node);
      }
      
      return node;
    };
    
    this.bst_root = deleteNode(this.bst_root, value);
  }

  _bstInorder() {
    const result = [];
    const inorder = (node) => {
      if (!node) return;
      inorder(node.left);
      result.push(node.value);
      inorder(node.right);
    };
    inorder(this.bst_root);
    return result;
  }

  _cloneBST(node) {
    if (!node) return null;
    return {
      value: node.value,
      left: this._cloneBST(node.left),
      right: this._cloneBST(node.right)
    };
  }

  // ========================================
  // Structure Conversion
  // ========================================

  /**
   * Convert to specified type
   */
  _convertTo(targetType) {
    if (this.type === targetType) return;
    
    console.log(`[CONVERT] ${this.type} → ${targetType}`);
    const data = this.getAll();
    this.type = targetType;
    this._rebuildWith(data);
    this.history.unshift({ type: targetType, time: Date.now() });
    if (this.history.length > 20) this.history = this.history.slice(0, 20);
  }

  /**
   * Rebuild current structure with given data
   */
  _rebuildWith(data) {
    // Clear all structures
    this.array = [];
    this.ll_head = null;
    this.bst_root = null;
    
    // Rebuild in current type
    switch (this.type) {
      case "array":
        this.array = [...data];
        break;
      case "linkedlist":
        for (let i = data.length - 1; i >= 0; i--) {
          const node = this._LLNode(data[i]);
          node.next = this.ll_head;
          this.ll_head = node;
        }
        break;
      case "bst":
        for (const val of data) {
          this._bstInsert(val);
        }
        break;
    }
  }
}

module.exports = DynamicDS;

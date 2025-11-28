const { performance } = require("perf_hooks");

class DynamicDS {
  constructor() {
    this.type = "array";
    this.array = [];
    this.ll_head = null;
    this.bst_root = null;
    this.hashTable = new Map();

    this.freq = { search: 0, index: 0, insert: 0, hash_search: 0 };

    this.phase = 1;
    this.threshold = 3;

    // Custom thresholds (null means use phase-based defaults)
    this.customSearchThreshold = null;
    this.customInsertThreshold = null;
    this.customSortThreshold = null;
    this.customIndexThreshold = null;

    this.lastOpTime = Date.now();
    this.IDLE_TIMEOUT =5 * 60 * 1000;

    this.history = [];
    this._operationContext = null; // Used to distinguish sort from search
  }

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
   * Get the threshold for a specific operation type
   * @param {string} opType - Operation type: 'search', 'hash_search', 'insert', 'index'
   * @returns {number} The threshold value to use
   */
  _getThresholdForOperation(opType) {
    // Use custom thresholds if set, otherwise use phase-based default
    // Check operation context to distinguish sort from search
    if (opType === "search") {
      // If context is "sort", use customSortThreshold, otherwise use customSearchThreshold
      if (this._operationContext === "sort") {
        return this.customSortThreshold !== null ? this.customSortThreshold : this.threshold;
      } else {
        return this.customSearchThreshold !== null ? this.customSearchThreshold : this.threshold;
      }
    } else if (opType === "hash_search") {
      return this.customSearchThreshold !== null ? this.customSearchThreshold : this.threshold;
    } else if (opType === "insert") {
      return this.customInsertThreshold !== null ? this.customInsertThreshold : this.threshold;
    } else if (opType === "index") {
      return this.customIndexThreshold !== null ? this.customIndexThreshold : this.threshold;
    } else {
      // For other operations, use phase-based default
      return this.threshold;
    }
  }

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
      case "hashtable":
        return this.hashTable.size;
      default:
        return 0;
    }
  }

  _checkIdleTimeout() {
    const now = Date.now();
    const timeSinceLastOp = now - this.lastOpTime;

    if (timeSinceLastOp > this.IDLE_TIMEOUT) {
      console.log(
        `[IDLE TIMEOUT] ${timeSinceLastOp}ms since last operation. Resetting to phase default...`
      );
      const data = this.getAll();
      let baseType;
      switch (this.phase) {
        case 1:
          baseType = "array";
          break;
        case 2:
          baseType = "linkedlist";
          break;
        case 3:
          baseType = "bst";
          break;
        default:
          baseType = "array";
      }
      if (this.type !== baseType) {
        console.log(
          `[IDLE CONVERT] Converting ${this.type} → ${baseType} due to idle timeout (phase ${this.phase})`
        );
        this.type = baseType;
        this._rebuildWith(data);
        this.history.unshift({ type: baseType, time: Date.now() });
        if (this.history.length > 20) this.history = this.history.slice(0, 20);
      } else {
        console.log(
          `[IDLE CONVERT] Already at base default (${baseType}) for phase ${this.phase}`
        );
      }
      this._resetFrequencies();
    }
  }

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
      console.log(
        `[PHASE DEFAULT] Converting to ${targetType} for phase ${this.phase}`
      );
      this._convertTo(targetType);
    }
  }

  _updateTimestamp() {
    this.lastOpTime = Date.now();
  }

  _resetFrequencies() {
    this.freq = { search: 0, index: 0, insert: 0, hash_search: 0 };
    console.log("[FREQ RESET] All operation frequencies reset to 0");
  }

  _trackOperation(opType) {
    this._updatePhase();
    this._checkIdleTimeout();
    this._updateTimestamp();

    if (opType in this.freq) {
      this.freq[opType]++;
      const operationThreshold = this._getThresholdForOperation(opType);
      console.log(
        `[FREQ] ${opType}: ${this.freq[opType]}/${operationThreshold} (Phase ${this.phase})`
      );

      if (this.freq[opType] >= operationThreshold) {
        console.log(
          `[THRESHOLD REACHED] ${opType} reached ${operationThreshold}. Switching structure...`
        );
        this._handleThresholdSwitch(opType);
      }
    }
    // Reset operation context after tracking
    this._operationContext = null;
  }

  _handleThresholdSwitch(opType) {
    let targetType = this.type;

    switch (opType) {
      case "search":
        targetType = "bst";
        break;
      case "hash_search":
        targetType = "hashtable";
        break;
      case "index":
        targetType = "array";
        break;
      case "insert":
        targetType = "linkedlist";
        break;
    }

    if (targetType !== this.type) {
      console.log(
        `[AUTO SWITCH] ${opType} threshold hit → switching to ${targetType}`
      );
      this._convertTo(targetType);
      this._resetFrequencies();
    } else {
      console.log(
        `[AUTO SWITCH] Already using optimal structure (${targetType})`
      );
      this._resetFrequencies();
    }
  }

  _LLNode(value) {
    return { value, next: null };
  }

  _BSTNode(value) {
    return { value, left: null, right: null, height: 1 };
  }

  /**
   * Insert value at specified index (or append if index not provided)
   * @param {number} index - The position to insert at
   * @param {*} value - The value to insert
   * @returns {boolean} Success status
   */
  insertAt(index, value) {
    this._trackOperation("insert");

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

    case "hashtable":
      this.hashTable.set(value, true);
      console.log(`[HASHTABLE] Inserted ${value} (index ignored, hash-based storage)`);
      break;

    default:
      console.error(`[ERROR] Unknown structure type: ${this.type}`);
  }

  return true;
}

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
      case "hashtable":
        this.hashTable.set(value, true);
        break;
    }
  }

  /**
   * Remove element at specified index
   * @param {number} index - The index of element to remove
   */
  removeAt(index) {
    this._trackOperation("insert");

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
        const vals = this._bstInorder();
        if (index >= 0 && index < vals.length) {
          this._bstDelete(vals[index]);
        }
        break;
      case "hashtable":
        const hashVals = Array.from(this.hashTable.keys());
        if (index >= 0 && index < hashVals.length) {
          this.hashTable.delete(hashVals[index]);
        }
        break;
    }
  }

  /**
   * Search for a value in the data structure
   * @param {*} value - The value to search for
   * @returns {boolean} True if value exists, false otherwise
   */
  search(value) {
    this._trackOperation("hash_search");

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
      case "hashtable":
        return this.hashTable.has(value);
      default:
        return false;
    }
  }

  /**
   * Access element by index
   * @param {number} index - The index to access
   * @returns {*} The value at the index, or null if not found
   */
  accessByIndex(index) {
    switch (this.type) {
      case "array":
        if (index < 0 || index >= this.array.length) {
          return null;
        }
        this._trackOperation("index");
        return this.array[index];

      case "linkedlist":
        if (index < 0) {
          return null;
        }
        let cur = this.ll_head;
        let i = 0;
        while (cur && i < index) {
          cur = cur.next;
          i++;
        }
        if (!cur) {
          return null;
        }
        this._trackOperation("index");
        return cur.value;

      case "bst":
        const vals = this._bstInorder();
        if (index < 0 || index >= vals.length) {
          return null;
        }
        this._trackOperation("index");
        return vals[index];

      case "hashtable":
        const hashVals = Array.from(this.hashTable.keys());
        if (index < 0 || index >= hashVals.length) {
          console.error(`[ERROR] Index ${index} out of bounds. HashTable size: ${hashVals.length}`);
          return null;
        }
        this._trackOperation("index");
        return hashVals[index];

      default:
        return null;
    }
  }
 
  /**
   * Get all data as an array
   * @returns {Array} All elements in the data structure
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
      case "hashtable":
        return Array.from(this.hashTable.keys());
      default:
        return [];
    }
  }

  /**
   * Get current data structure type
   * @returns {string} Current type: 'array', 'linkedlist', 'bst', or 'hashtable'
   */
  getType() {
    return this.type;
  }

  /**
   * Get BST tree structure for visualization
   * @returns {Object|null} Tree structure or null if not BST
   */
  getTree() {
    if (this.type === "bst") {
      return this._cloneBST(this.bst_root);
    }
    return null;
  }

  /**
   * Sort the data structure
   * @param {string} order - Sort order: 'asc' or 'desc'
   * @returns {Array} Sorted array of all elements
   */
  sort(order = "asc") {
    this._operationContext = "sort";
    this._trackOperation("search");

    const compare = (a, b) => (order === "desc" ? b - a : a - b);
    let sortedData;

    switch (this.type) {
      case "array":
        sortedData = [...this.array].sort(compare); 
        this._rebuildWith(sortedData);
        break;

      case "linkedlist":
        const llArr = [];
        let cur = this.ll_head;
        while (cur) {
          llArr.push(cur.value);
          cur = cur.next;
        }
        sortedData = llArr.sort(compare);
        this._rebuildWith(sortedData);
        break;

      case "bst":
        const vals = this._bstInorder();
        if (order === "desc") vals.reverse();
        sortedData = vals;
        this._rebuildWith(sortedData);
        break;

      default:
        sortedData = this.getAll().sort(compare);
        this._rebuildWith(sortedData);
        break;
    }

    return this.getAll();
  }

  /**
   * Bulk add random numbers to the data structure
   * @param {number} count - Number of elements to add
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {Array} Updated data array
   */
  bulkAdd(count = 10, min = 0, max = 1000) {
    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      this._trackOperation("insert");
      this._append(value);
    }
    return this.getAll();
  }

  /**
   * Clear all data and reset to array type
   * @returns {Array} Empty array
   */
  clear() {
    this._updateTimestamp();
    this.array = [];
    this.ll_head = null;
    this.bst_root = null;
    this.hashTable.clear();
    this.type = "array";
    this._resetFrequencies();
    this._updatePhase();
    return [];
  }
 
  /**
   * Set custom threshold for search operations
   * @param {number|null} threshold - Custom threshold value, or null to use phase-based default
   */
  setSearchThreshold(threshold) {
    if (threshold === null || threshold === undefined) {
      this.customSearchThreshold = null;
      console.log("[THRESHOLD] Reset search threshold to phase-based default");
    } else {
      const num = Number(threshold);
      if (isNaN(num) || num < 1) {
        throw new Error("Search threshold must be a positive number");
      }
      this.customSearchThreshold = num;
      console.log(`[THRESHOLD] Set custom search threshold to ${num}`);
    }
  }

  /**
   * Set custom threshold for insert operations
   * @param {number|null} threshold - Custom threshold value, or null to use phase-based default
   */
  setInsertThreshold(threshold) {
    if (threshold === null || threshold === undefined) {
      this.customInsertThreshold = null;
      console.log("[THRESHOLD] Reset insert threshold to phase-based default");
    } else {
      const num = Number(threshold);
      if (isNaN(num) || num < 1) {
        throw new Error("Insert threshold must be a positive number");
      }
      this.customInsertThreshold = num;
      console.log(`[THRESHOLD] Set custom insert threshold to ${num}`);
    }
  }

  /**
   * Set custom threshold for sort operations
   * @param {number|null} threshold - Custom threshold value, or null to use phase-based default
   */
  setSortThreshold(threshold) {
    if (threshold === null || threshold === undefined) {
      this.customSortThreshold = null;
      console.log("[THRESHOLD] Reset sort threshold to phase-based default");
    } else {
      const num = Number(threshold);
      if (isNaN(num) || num < 1) {
        throw new Error("Sort threshold must be a positive number");
      }
      this.customSortThreshold = num;
      console.log(`[THRESHOLD] Set custom sort threshold to ${num}`);
    }
  }

  /**
   * Set custom threshold for index access operations
   * @param {number|null} threshold - Custom threshold value, or null to use phase-based default
   */
  setIndexThreshold(threshold) {
    if (threshold === null || threshold === undefined) {
      this.customIndexThreshold = null;
      console.log("[THRESHOLD] Reset index threshold to phase-based default");
    } else {
      const num = Number(threshold);
      if (isNaN(num) || num < 1) {
        throw new Error("Index threshold must be a positive number");
      }
      this.customIndexThreshold = num;
      console.log(`[THRESHOLD] Set custom index threshold to ${num}`);
    }
  }

  /**
   * Get custom thresholds
   * @returns {Object} Object with all custom thresholds
   */
  getCustomThresholds() {
    return {
      searchThreshold: this.customSearchThreshold,
      insertThreshold: this.customInsertThreshold,
      sortThreshold: this.customSortThreshold,
      indexThreshold: this.customIndexThreshold,
    };
  }

  /**
   * Get current system state information
   * @returns {Object} State object with type, size, phase, frequencies, etc.
   */
  getState() {
    return {
      type: this.type,
      size: this._size(),
      phase: this.phase,
      threshold: this.threshold,
      customThresholds: this.getCustomThresholds(),
      freq: { ...this.freq },
      lastOpTime: this.lastOpTime,
      idleTime: Date.now() - this.lastOpTime,
      history: [...this.history].slice(0, 10),
    };
  }

  _llInsertAt(index, value) {
    const node = this._LLNode(value);

    if (index <= 0 || !this.ll_head) {
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

    if (!cur) {
      cur = this.ll_head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    } else {
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

      node.height =
        1 + Math.max(this._height(node.left), this._height(node.right));
      const balance = this._getBalance(node);

      if (balance > 1 && value <= node.left.value) {
        return this._rightRotate(node);
      }

      if (balance > 1 && value > node.left.value) {
        node.left = this._leftRotate(node.left);
        return this._rightRotate(node);
      }

      if (balance < -1 && value > node.right.value) {
        return this._leftRotate(node);
      }

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

      node.height =
        Math.max(this._height(node.left), this._height(node.right)) + 1;
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
      right: this._cloneBST(node.right),
    };
  }

  _convertTo(targetType) {
    if (this.type === targetType) return;

    console.log(`[CONVERT] ${this.type} → ${targetType}`);
    const data = this.getAll();
    this.type = targetType;
    this._rebuildWith(data);
    this.history.unshift({ type: targetType, time: Date.now() });
    if (this.history.length > 20) this.history = this.history.slice(0, 20);
  }

  _rebuildWith(data) {
    this.array = [];
    this.ll_head = null;
    this.bst_root = null;
    this.hashTable.clear();

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
      case "hashtable":
        for (const val of data) {
          this.hashTable.set(val, true);
        }
        break;
    }
  }
}

module.exports = DynamicDS;

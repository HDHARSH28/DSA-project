// ---------- main.js ----------
const { performance } = require('perf_hooks');

class Wrapper {
  constructor() {
    this.head = null;  // Linked List head
    this.arr = [];     // Dynamic Array
    this.front_database = []; // Array for frontend rendering
  }

  // ---------- Linked List ----------

  _LLNode(value) {
    return { value: value, next: null };
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

    let cur = this.head, prev = null;
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
    this.arr.push(value);
    const end = performance.now();
    // Update front_database outside timing
    this.front_database.push(value);
    return this._emit("ARR_PUSH", "sucess", value, end - start);
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
  // ---------- Frontend Database Getter ----------
  getFrontDatabase() {
    return { array: this.front_database };
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

  // ---------- Emitter ----------

  _emit(op, detail = "", value = undefined, time = undefined) {
    const event = { op };
    if (detail) event.detail = detail;
    if (value !== undefined) event.value = value;
    if (time !== undefined) event.time_ms = time.toFixed(4); // ms
    return event; // Return JSON instead of console.log
  }


    // ---------- Converters ----------
    arrayToLL() {
      const start = performance.now();
      this.head = null;
      for (let i = this.arr.length - 1; i >= 0; i--) {
        this.ll_insert_front(this.arr[i]);
      }
      const end = performance.now();
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
      const end = performance.now();
      return this._emit("LL_TO_ARRAY", "success", result, end - start);
    }
}

// Export for Node.js
module.exports = Wrapper;

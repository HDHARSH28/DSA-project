# API Route Reference

A complete list of backend API routes for easy frontend integration:

| Route                  | Method | Request Body                | Description                      |
|------------------------|--------|-----------------------------|----------------------------------|
| `/ll/insert_front`     | POST   | `{ "value": <any> }`        | Insert value at front of linked list |
| `/ll/delete`           | POST   | `{ "value": <any> }`        | Delete value from linked list    |
| `/ll/search`           | POST   | `{ "value": <any> }`        | Search value in linked list      |
| `/arr/push`            | POST   | `{ "value": <any> }`        | Push value to array              |
| `/arr/delete`          | POST   | `{ "value": <any> }`        | Delete value from array          |
| `/arr/search`          | POST   | `{ "value": <any> }`        | Search value in array            |
| `/convert/arrayToLL`   | POST   | None                        | Convert array to linked list     |
| `/convert/llToArray`   | POST   | None                        | Convert linked list to array     |
| `/convert/arrayToBST`  | POST   | None                        | Convert array to BST (AVL)       |
| `/convert/llToBST`     | POST   | None                        | Convert linked list to BST (AVL) |
| `/convert/bstToArray`  | POST   | None                        | Convert BST to array             |
| `/convert/bstToLL`     | POST   | None                        | Convert BST to linked list       |
| `/frontend/array`      | GET    | None                        | Get frontend database array      |

---

## Dynamic (adaptive) routes `/dy/*`

These routes operate on a single dynamic data structure that automatically switches between Array, Linked List, and AVL Tree based on the last 5 operations and data size thresholds.

| Route             | Method | Body                                  | Description |
|-------------------|--------|---------------------------------------|-------------|
| `/dy/all`         | GET    | —                                     | Get current data and type `{ data, type }` |
| `/dy/insert`      | POST   | `{ value: any, index?: number }`      | Insert value (at end if no index) |
| `/dy/remove`      | DELETE | `{ index: number }`                   | Remove value at index |
| `/dy/search/:val` | GET    | —                                     | Search value; returns `{ found, type }` |
| `/dy/sort`        | POST   | `{ order?: 'asc'|'desc' }`            | Sort data (rebuilds as BST) |
| `/dy/bulk-add`    | POST   | `{ count: number, min?: number, max?: number }` | Append N random numbers; returns `{ data, type, added }` |
| `/dy/clear`       | POST   | —                                     | Clear all data |
| `/dy/state`       | GET    | —                                     | Get `{ type, size, history, nextType }` |

---

**Example Usage:**
```js
// Insert into linked list
fetch('/ll/insert_front', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ value: 42 })
});

// Get frontend database array
fetch('/frontend/array')
  .then(res => res.json())
  .then(data => console.log(data.array));

// Dynamic: bulk add 100 random values
fetch('/dy/bulk-add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ count: 100, min: 0, max: 1000 })
}).then(r => r.json()).then(console.log);
```

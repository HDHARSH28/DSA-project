# API Route Reference

A complete list of backend API routes for easy frontend integration:

## Static Endpoints

### Linked List Routes

| Route              | Method | Request Body         | Description                          |
| ------------------ | ------ | -------------------- | ------------------------------------ |
| `/ll/insert_front` | POST   | `{ "value": <any> }` | Insert value at front of linked list |
| `/ll/insert_end`   | POST   | `{ "value": <any> }` | Insert value at end of linked list   |
| `/ll/delete`       | POST   | `{ "value": <any> }` | Delete value from linked list        |
| `/ll/search`       | POST   | `{ "value": <any> }` | Search value in linked list          |
| `/ll/sort_inc`     | POST   | None                 | Sort linked list in ascending order  |
| `/ll/sort_dec`     | POST   | None                 | Sort linked list in descending order |

### Array Routes

| Route          | Method | Request Body         | Description                      |
| -------------- | ------ | -------------------- | -------------------------------- |
| `/arr/push`    | POST   | `{ "value": <any> }` | Push value to array              |
| `/arr/delete`  | POST   | `{ "value": <any> }` | Delete value from array          |
| `/arr/search`  | POST   | `{ "value": <any> }` | Search value in array            |
| `/arr/sort_inc`| POST   | None                 | Sort array in ascending order    |
| `/arr/sort_dec`| POST   | None                 | Sort array in descending order   |

### BST Routes

| Route          | Method | Request Body         | Description                      |
| -------------- | ------ | -------------------- | -------------------------------- |
| `/bst/insert`  | POST   | `{ "value": <any> }` | Insert value into BST (AVL)      |
| `/bst/search`  | POST   | `{ "value": <any> }` | Search value in BST              |
| `/bst/delete`  | POST   | `{ "value": <any> }` | Delete value from BST            |

### Conversion Routes

| Route                 | Method | Request Body | Description                      |
| --------------------- | ------ | ------------ | -------------------------------- |
| `/convert/arrayToLL`  | POST   | None         | Convert array to linked list     |
| `/convert/llToArray`  | POST   | None         | Convert linked list to array     |
| `/convert/arrayToBST` | POST   | None         | Convert array to BST (AVL)       |
| `/convert/llToBST`    | POST   | None         | Convert linked list to BST (AVL) |
| `/convert/bstToArray` | POST   | None         | Convert BST to array             |
| `/convert/bstToLL`    | POST   | None         | Convert BST to linked list       |

### Frontend Database

| Route             | Method | Request Body | Description                 |
| ----------------- | ------ | ------------ | --------------------------- |
| `/frontend/array` | GET    | None         | Get frontend database array |

---

## Dynamic (Adaptive) Routes `/dy/*`

These routes operate on a single dynamic data structure that automatically switches between Array, Linked List, and AVL Tree based on operation frequencies and data size thresholds (3-phase system).

### Dynamic Endpoints

| Route                | Method | Request Body                                    | Description                                                           |
| -------------------- | ------ | ----------------------------------------------- | --------------------------------------------------------------------- |
| `/dy/all`            | GET    | None                                            | Get current data, type, and tree `{ data, type, tree }`               |
| `/dy/insert`         | POST   | `{ value: any, index?: number }`                | Insert value (at end if no index); returns `{ data, type, tree }`     |
| `/dy/remove`         | DELETE | `{ index: number }`                             | Remove value at index; returns `{ data, type, tree }`                 |
| `/dy/search/:value`  | GET    | None                                            | Search value; returns `{ found, type, data, tree }`                   |
| `/dy/access/:index`  | GET    | None                                            | Access element by index; returns `{ value, index, type, data, tree }` |
| `/dy/sort`           | POST   | `{ order?: 'asc' \| 'desc' }`                   | Sort data; returns `{ data, type, tree, order }`                      |
| `/dy/bulk-add`       | POST   | `{ count: number, min?: number, max?: number }` | Add N random numbers; returns `{ data, type, tree, added }`           |
| `/dy/clear`          | POST   | None                                            | Clear all data; returns `{ data, type, tree }`                        |
| `/dy/state`          | GET    | None                                            | Get state info (see below)                                            |

### `/dy/state` Response

Returns comprehensive state information:

```json
{
  "type": "array" | "linkedlist" | "bst",
  "size": 150,
  "phase": 2,
  "threshold": 6,
  "freq": { "search": 0, "index": 2, "insert": 4 },
  "lastOpTime": 1699632000000,
  "idleTime": 3000,
  "history": [
    { "type": "linkedlist", "time": 1699632000000 },
    { "type": "array", "time": 1699631900000 }
  ]
}
```

---
## 3-Phase Adaptive System

The dynamic data structure uses a 3-phase threshold system:

- **Phase 1** (size < 100): Threshold = 3 operations
- **Phase 2** (size 100-500): Threshold = 6 operations
- **Phase 3** (size > 500): Threshold = 9 operations

### Automatic Switching Rules:

- **Search operations** → Switches to **BST** (O(log n) search)
- **Index access** → Switches to **Array** (O(1) index access)
- **Insert/Remove** → Switches to **LinkedList** (O(1) insertion)

### Idle Timeout:

After **5 minutes** of inactivity, the structure resets to the phase default:
- Phase 1 → Array
- Phase 2 → LinkedList
- Phase 3 → BST

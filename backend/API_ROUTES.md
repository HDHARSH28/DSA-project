# API Route Reference

A complete list of backend API routes for easy frontend integration:

| Route                  | Method | Request Body                | Description                      |
|------------------------|--------|-----------------------------|-----------------------------------|
| `/ll/insert_front`     | POST   | `{ "value": <any> }`        | Insert value at front of linked list |
| `/ll/delete`           | POST   | `{ "value": <any> }`        | Delete value from linked list     |
| `/ll/search`           | POST   | `{ "value": <any> }`        | Search value in linked list       |
| `/arr/push`            | POST   | `{ "value": <any> }`        | Push value to array               |
| `/arr/delete`          | POST   | `{ "value": <any> }`        | Delete value from array           |
| `/arr/search`          | POST   | `{ "value": <any> }`        | Search value in array             |
| `/convert/arrayToLL`   | POST   | None                        | Convert array to linked list      |
| `/convert/llToArray`   | POST    | None                        | Convert linked list to array      |
| `/frontend/array`      | GET    | None                        | Get frontend database array       |

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
```

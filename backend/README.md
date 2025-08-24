# DSA Backend

Simple Express server to back the frontend visualizer.

Endpoints:

Run:
## C++ wrapper integration

You can plug in your own C++ program that wraps multiple data structures (vector, linked list, BST, hash table) and performs ops based on requests.

How it works:

- The server will attempt to spawn an external executable for each `/api/op` call.
- Provide the path to your exe via environment variable `CPP_WRAPPER_EXE`. On Windows you can point to e.g. `f:\\Coding\\DSA-project\\backend\\bin\\cpp-wrapper.exe`.
- Communication is via JSON over stdin/stdout.

Request to your program (stdin):

```
{ "type": "Array" | "LinkedList" | "BST" | "HashMap", "values": number[], "op": "Insert" | "Delete" | "Find", "value": number }
```

Expected response (stdout):

```
{ "type?": same, "values?": number[], "log?": string }
```

Notes:

- If your program exits non-zero or prints invalid JSON, the server falls back to the built-in JS demo behavior.
- The server includes timings and logs for the UI; you can emit a short `log` string to show what was done.

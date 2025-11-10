# 🚀 DSA Visualizer & Adaptive Data Structure

An interactive web app for visualizing data structures with both **static** and **dynamic** (adaptive) modes.

## ✨ Features

### 📊 Static Mode
- **Array**, **Linked List**, and **BST** (AVL) operations
- Visual representations with animations
- Manual conversions between structures
- Real-time operation tracking

### 🔄 Dynamic Mode
- **3-Phase Adaptive System** - automatically switches between structures based on:
  - Operation frequency (search/index/insert)
  - Data size (Phase 1: <100, Phase 2: 100-500, Phase 3: >500)
  - Idle timeout (5 minutes)
- Smart optimization for your usage patterns
- Live metrics and state monitoring

## 🛠️ Tech Stack

**Frontend:** React + Vite + TailwindCSS  
**Backend:** Node.js + Express  
**Data Structures:** Array, Linked List, AVL Tree

## 🏃 Quick Start

**Prerequisites:** [Node.js](https://nodejs.org/) installed

```sh
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Run backend (Terminal 1)
cd backend && npm run dev

# Run frontend (Terminal 2)
cd frontend && npm run dev
```

**View:** [http://localhost:5173](http://localhost:5173)  
**API:** [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **API Routes:** See [`backend/API_ROUTES.md`](backend/API_ROUTES.md)
- **Dynamic System:** 3-phase threshold-based automatic switching

## 🎯 Project Structure

```
DSA-project/
├── backend/
│   ├── server.js       # Express server
│   ├── static.js       # Static DS implementations
│   ├── dynamic.js      # Adaptive DS logic
│   └── API_ROUTES.md   # API documentation
└── frontend/
    └── src/
        ├── App.jsx
        ├── Static.jsx  # Static mode UI
        ├── Dynamic.jsx # Dynamic mode UI
        └── components/ # Visualizers
```

---

**Made with ❤️ for Data Structures & Algorithms**
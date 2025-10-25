import React, { useState } from "react";
import StaticView from "./Static";
import DynamicView from "./Dynamic";

function App() {
  const [mode, setMode] = useState("static");

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex">
      <div className="w-52 border-r border-stone-800 bg-stone-950/60 p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-indigo-300 mb-2">
          DS Visualizer
        </h1>
        <button
          onClick={() => setMode("static")}
          className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "static"
              ? "bg-indigo-600 text-white"
              : "bg-stone-800 text-stone-300 hover:bg-stone-700"
          }`}
        >
          Static
        </button>
        <button
          onClick={() => setMode("dynamic")}
          className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "dynamic"
              ? "bg-indigo-600 text-white"
              : "bg-stone-800 text-stone-300 hover:bg-stone-700"
          }`}
        >
          Dynamic
        </button>
      </div>
      <main className="flex-1 p-6 overflow-y-auto">
        {mode === "static" ? <StaticView /> : <DynamicView />}
      </main>
    </div>
  );
}

export default App;

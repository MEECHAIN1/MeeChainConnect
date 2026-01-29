import { Buffer } from "buffer";
import * as process from "process";

// Polyfill Buffer and process for the browser environment
if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
  (window as any).process = process;
  (window as any).global = window;
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

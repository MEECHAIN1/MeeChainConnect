import { Buffer } from "buffer";
import * as process from "process";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
  window.process = process as any;
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

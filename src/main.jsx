import React from "react";
import { createRoot } from "react-dom/client";
import "@excalidraw/excalidraw/index.css";
import App from "./App.jsx";

// Load fonts from the local bundle instead of a CDN.
window.EXCALIDRAW_ASSET_PATH = new URL("./", window.location.href).href;

createRoot(document.getElementById("root")).render(<App />);

import React, { useEffect, useRef, useState } from "react";
import {
  Excalidraw,
  serializeAsJSON,
  loadFromBlob,
} from "@excalidraw/excalidraw";

export default function App() {
  const [api, setApi] = useState(null);
  const apiRef = useRef(null);
  apiRef.current = api;

  useEffect(() => {
    const desktop = window.desktop;
    if (!desktop) return;

    const offOpen = desktop.onOpenFile(async (content) => {
      const a = apiRef.current;
      if (!a) return;
      try {
        const blob = new Blob([content], { type: "application/json" });
        const data = await loadFromBlob(blob, null, null);
        a.updateScene({
          elements: data.elements,
          appState: data.appState,
          collaborators: new Map(),
        });
        a.addFiles(Object.values(data.files || {}));
        a.scrollToContent();
      } catch (e) {
        console.error("Failed to open file", e);
        alert("Could not open file: " + e.message);
      }
    });

    const offSave = desktop.onRequestSave(() => {
      const a = apiRef.current;
      if (!a) return;
      const json = serializeAsJSON(
        a.getSceneElements(),
        a.getAppState(),
        a.getFiles(),
        "local",
      );
      desktop.saveFile(json);
    });

    const offNew = desktop.onNewFile(() => apiRef.current?.resetScene());

    return () => {
      offOpen();
      offSave();
      offNew();
    };
  }, []);

  // Preload the bundled public libraries as the default library.
  useEffect(() => {
    if (!api || localStorage.getItem("defaultLibraryLoaded") === "1") return;
    fetch("./default-library.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((items) =>
        api.updateLibrary({ libraryItems: items, merge: true, defaultStatus: "published" }),
      )
      .then(() => localStorage.setItem("defaultLibraryLoaded", "1"))
      .catch((e) => console.error("Failed to load default libraries", e));
  }, [api]);

  return <Excalidraw excalidrawAPI={setApi} />;
}

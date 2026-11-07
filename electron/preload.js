const { contextBridge, ipcRenderer } = require("electron");

const subscribe = (channel) => (cb) => {
  const handler = (_e, ...args) => cb(...args);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
};

contextBridge.exposeInMainWorld("desktop", {
  onOpenFile: subscribe("file:open"),
  onRequestSave: subscribe("file:request-save"),
  onNewFile: subscribe("file:new"),
  saveFile: (content) => ipcRenderer.invoke("file:save", content),
});

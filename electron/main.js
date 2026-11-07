const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require("electron");
const fs = require("fs/promises");
const path = require("path");

const devUrl = process.env.VITE_DEV_SERVER_URL;
const filters = [{ name: "Excalidraw", extensions: ["excalidraw"] }];
let win = null;
let currentPath = null;
let saveAs = false;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file://") && !(devUrl && url.startsWith(devUrl))) {
      e.preventDefault();
    }
  });

  if (devUrl) win.loadURL(devUrl);
  else win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  win.on("closed", () => (win = null));
}

async function openFile() {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openFile"],
    filters: [...filters, { name: "All files", extensions: ["*"] }],
  });
  if (canceled || !filePaths[0]) return;
  const content = await fs.readFile(filePaths[0], "utf8");
  currentPath = filePaths[0];
  win.setTitle(path.basename(currentPath));
  win.webContents.send("file:open", content);
}

function requestSave(asNew) {
  saveAs = asNew;
  win?.webContents.send("file:request-save");
}

ipcMain.handle("file:save", async (_e, content) => {
  if (typeof content !== "string") return false;
  let target = currentPath;
  if (!target || saveAs) {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      defaultPath: currentPath || "drawing.excalidraw",
      filters,
    });
    if (canceled || !filePath) return false;
    target = filePath.endsWith(".excalidraw") ? filePath : filePath + ".excalidraw";
  }
  await fs.writeFile(target, content, "utf8");
  currentPath = target;
  win?.setTitle(path.basename(target));
  return true;
});

function buildMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    ...(isMac ? [{ role: "appMenu" }] : []),
    {
      label: "File",
      submenu: [
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            currentPath = null;
            win?.setTitle("Excalidraw");
            win?.webContents.send("file:new");
          },
        },
        { label: "Open…", accelerator: "CmdOrCtrl+O", click: openFile },
        { label: "Save", accelerator: "CmdOrCtrl+S", click: () => requestSave(false) },
        {
          label: "Save As…",
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => requestSave(true),
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

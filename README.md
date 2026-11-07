# Excalidraw Desktop

An offline Electron desktop app wrapping the official [`@excalidraw/excalidraw`](https://www.npmjs.com/package/@excalidraw/excalidraw) React component, bundled with Vite.

- Secure Electron setup: `contextIsolation` on, `nodeIntegration` off, sandboxed renderer, preload bridge.
- Fully offline: Excalidraw fonts are bundled locally.
- Native **File > New / Open / Save / Save As** for `.excalidraw` files.

## Setup

Requires Node.js 20+.

```bash
npm install
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server + Electron with hot reload |
| `npm run build` | Build the web bundle into `dist/` |
| `npm start` | Build and launch the app |
| `npm run dist` | Package installers for the current OS into `release/` |
| `npm run dist:win` / `dist:linux` / `dist:mac` | Package for a specific OS (run on that OS) |

## Releases

Pushing a tag like `v0.1.0` triggers `.github/workflows/release.yml`, which builds on a Windows/Linux/macOS matrix and attaches to a GitHub Release:

- Windows: NSIS installer (`.exe`)
- Linux: `.AppImage`
- macOS: `.dmg` and `.zip`

```bash
git tag v0.1.0 && git push origin v0.1.0
```

Builds are unsigned (macOS users may need to right-click > Open; Windows may show SmartScreen).

## Staying current with upstream

`.github/workflows/update-excalidraw.yml` runs weekly (and on demand), installs the latest `@excalidraw/excalidraw`, verifies the build, and opens a PR. `ci.yml` builds on every push and PR.
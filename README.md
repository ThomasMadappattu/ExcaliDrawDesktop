# Excalidraw Desktop

An offline Electron desktop app wrapping the official [`@excalidraw/excalidraw`](https://www.npmjs.com/package/@excalidraw/excalidraw) React component, bundled with Vite.

- Secure Electron setup: `contextIsolation` on, `nodeIntegration` off, sandboxed renderer, preload bridge.
- Fully offline: Excalidraw fonts are bundled locally.
- All public [Excalidraw libraries](https://libraries.excalidraw.com) (~4,000 items) are preloaded into the library panel on first launch. They are fetched from `excalidraw/excalidraw-libraries` at build time (`npm run libraries` refreshes them).
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

- Windows: NSIS installer and portable (`.exe`)
- Linux: `.AppImage` (portable) and `.tar.gz`
- macOS: `.dmg` and `.zip` (portable, unzip and run)

```bash
git tag v0.1.0 && git push origin v0.1.0
```

Builds are not notarized. The macOS app is ad-hoc signed, so on first launch right-click > Open. If macOS still says the app is "damaged", clear the download quarantine flag:

```bash
xattr -cr "/Applications/Excalidraw Desktop.app"
```

Windows may show a SmartScreen warning.

## Staying current with upstream

`.github/workflows/update-excalidraw.yml` runs weekly (and on demand), installs the latest `@excalidraw/excalidraw`, verifies the build, and opens a PR. `ci.yml` builds on every push and PR.
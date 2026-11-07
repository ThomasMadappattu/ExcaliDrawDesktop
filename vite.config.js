import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    // Bundle Excalidraw fonts locally so the app works offline.
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@excalidraw/excalidraw/dist/prod/fonts/*",
          dest: "fonts",
        },
      ],
    }),
  ],
  define: { "process.env.IS_PREACT": JSON.stringify("false") },
  server: { port: 5173, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
});

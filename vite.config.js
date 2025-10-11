import { defineConfig } from "vite";

export default defineConfig({
  // Ensure proper base path for deployment
  base: "./",

  // Build configuration
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure proper asset handling
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
  },
});

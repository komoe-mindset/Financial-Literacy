import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) {
              return "firebase";
            }
            if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler")) {
              return "react-vendor";
            }
            if (id.includes("lucide-react") || id.includes("radix-ui") || id.includes("@radix-ui")) {
              return "ui-vendor";
            }
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});

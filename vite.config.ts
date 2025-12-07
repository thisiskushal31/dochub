import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages deployment base path
  // Change to '/dochub/' if deploying to GitHub Pages subdirectory
  // Use '/' for root domain deployment
  base: '/dochub/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'production' && viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
    mode === 'production' && viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ['**/*.md'],
  publicDir: 'public',
  build: {
    copyPublicDir: true,
    // Exclude repository folder from automatic copy (we'll copy it manually in CI)
    rollupOptions: {
      output: {
        // This doesn't directly exclude from publicDir, but we'll handle it in CI
      }
    }
  },
}));

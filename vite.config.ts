import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from 'vite-plugin-compression';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages deployment base path
  // Change to '/dochub/' if deploying to GitHub Pages subdirectory
  // Use '/' for root domain deployment
  base: '/dochub/',
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Allow serving files from the repository directory
      strict: false,
    },
    middlewareMode: false,
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
    // Plugin to serve repository files correctly in dev mode
    {
      name: 'serve-repository-files',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      configureServer(server: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        server.middlewares.use((req: any, res: any, next: any) => {
          // Only handle requests to repository files
          if (req.url?.startsWith('/dochub/repository/')) {
            // Decode the URL to handle special characters like # (%23)
            const decodedUrl = decodeURIComponent(req.url);
            const filePath = decodedUrl.replace('/dochub/repository/', '');
            const fullPath = path.join(process.cwd(), 'public', 'repository', filePath);
            
            // Check if file exists
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
              const content = fs.readFileSync(fullPath, 'utf-8');
              const ext = path.extname(fullPath);
              
              // Set appropriate content type
              if (ext === '.md') {
                res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
              } else if (ext === '.json') {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
              } else {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              }
              
              res.setHeader('Cache-Control', 'no-cache');
              res.end(content);
              return;
            }
          }
          next();
        });
      },
    },
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

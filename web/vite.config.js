import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import apiPlugin from './vite-api-plugin.js';

export default defineConfig(({ mode }) => {
  // Load env file based on current mode
  const env = loadEnv(mode, process.cwd(), '');

  // Populate process.env so local api middleware can access them
  process.env.MEGALLM_API_KEY = env.MEGALLM_API_KEY;
  process.env.MEGALLM_BASE_URL = env.MEGALLM_BASE_URL;
  process.env.MEGALLM_MODEL = env.MEGALLM_MODEL;

  return {
    plugins: [react(), apiPlugin()],
    server: {
      port: 5173,
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('three')) return 'vendor-three';
              if (id.includes('framer-motion') || id.includes('gsap')) return 'vendor-motion';
              if (id.includes('lucide-react') || id.includes('canvas-confetti')) return 'vendor-ui';
              if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
              return 'vendor-libs';
            }
          },
        },
      },
    },
  };
});

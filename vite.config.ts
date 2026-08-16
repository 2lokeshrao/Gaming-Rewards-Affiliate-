import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      emptyOutDir: false,
      minify: 'esbuild' as const,
      cssMinify: true,
      target: 'es2022',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['motion'],
            'vendor-ui': ['lucide-react', 'canvas-confetti'],
            'vendor-markdown': ['react-markdown', 'rehype-sanitize', '@uiw/react-md-editor'],
            'vendor-charts': ['recharts']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

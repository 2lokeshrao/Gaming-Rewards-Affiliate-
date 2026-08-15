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
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-is'],
            'vendor-ui': ['lucide-react', 'recharts'],
            'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
            'vendor-editor': ['@uiw/react-md-editor', 'react-markdown', 'dompurify', 'isomorphic-dompurify']
          }
        }
      },
      chunkSizeWarningLimit: 800
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

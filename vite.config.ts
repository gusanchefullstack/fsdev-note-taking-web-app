import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        replaceAttrValues: { '#0E121B': 'currentColor' },
      },
    }),
    react(),
  ],
});

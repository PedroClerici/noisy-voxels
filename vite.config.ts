import path from 'node:path';
import deno from '@deno/vite-plugin';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'three/webgpu': 'three/webgpu',
      '@three': 'three',
      three: 'three/webgpu',
    },
  },
});

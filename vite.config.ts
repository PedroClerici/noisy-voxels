import path from 'node:path';
import deno from '@deno/vite-plugin';
import { defineConfig } from 'vite';
import wasmImport from 'vite-plugin-wasm';

// biome-ignore lint/suspicious/noExplicitAny: https://github.com/denoland/deno/issues/16458
const wasm = wasmImport as any as typeof wasmImport.default;

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), wasm()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'three/webgpu': 'three/webgpu',
      '@three': 'three',
      three: 'three/webgpu',
    },
  },
});

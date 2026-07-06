import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3456,
    open: true,
    // Dracarys 资源：运行 npm run cases:sync-dracarys 后由 public/gl、public/audio、public/three 直接提供
    // 勿对 /gl 做 self-proxy，会触发 ECONNREFUSED
  },
  build: {
    target: 'esnext',
  },
});

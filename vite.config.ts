import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [react(), tailwindcss(), federation({
    name: "3d_frontend",
    filename: "remoteEntry.js",
    exposes: ['./src/ModelsReviewer'],
    shared: ['react', 'three', '@react-three/drei', '@react-three/fiber', 'three-stdlib']
  })],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext', // ✅ Allow top-level await
  },
  css: {
    modules: {
      generateScopedName: '[local]__[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  css: {
    modules: {
      // Customize the generated class names (optional)
      generateScopedName: '[local]__[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
        // You can add global SCSS variables or mixins here if needed
      },
    },
  },
});

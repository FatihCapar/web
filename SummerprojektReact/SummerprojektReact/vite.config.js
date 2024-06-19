import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3001',
      '/createTask': 'http://localhost:3001',
      '/tasks': 'http://localhost:3001',
      '/comments': 'http://localhost:3001',
      '/comments/:taskId': 'http://localhost:3001',
      '/users': 'http://localhost:3001',
    }
  }
});

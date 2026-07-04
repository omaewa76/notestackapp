import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({

  const env = loadEnv('', process.cwd(), '');

  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    'process.env.VITE_API_URL':JSON.stringify(process.env.VITE_API_URL)
  },
});
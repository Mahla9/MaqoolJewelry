import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    open: true,
     proxy: {
      "/api": {
        target: "http://localhost:5000", // آدرس سرور اکسپرست
        changeOrigin: true,
        secure: false,
        credentials: true,
        cookieDomainRewrite: "localhost", // این باعث میشه کوکی‌ها روی localhost تنظیم بشن
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

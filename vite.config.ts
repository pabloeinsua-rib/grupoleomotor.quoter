import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0'
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icon.svg'],
          injectRegister: 'auto',
          manifest: {
            name: 'Quoter Automotive',
            short_name: 'Quoter',
            description: 'Aplicación de gestión de ofertas y documentación',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/',
            icons: [
              {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            maximumFileSizeToCacheInBytes: 5000000
          },
          devOptions: {
            enabled: false,
            type: 'module'
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY || process.env.GEMINI_API_KEY || env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || process.env.API_KEY || env.API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname),
        }
      }
    };
});
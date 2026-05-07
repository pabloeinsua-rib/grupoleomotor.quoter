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
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-16x16.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT04gRk9MREVSIENPQ0hFL2ljb24tMTZ4MTYucG5nIiwiaWF0IjoxNzc3MDUxNzU2LCJleHAiOjI2NDA5NjUzNTZ9.RXxOnn8U9hFs9SdlwQ0ieMCdskLjCyTnrwRQK1jXkO0',
                sizes: '16x16',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-32x32.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05gRk9MREVSIENPQ0hFL2ljb24tMzJ4MzIucG5nIiwiaWF0IjoxNzc3MDUxODQ4LCJleHAiOjI2NDA5NjU0NDh9.k8ApV24iz27L6lfQmMdndY6Yk2HPVKpjQkkHftxLiRM',
                sizes: '32x32',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-48x48.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT04gRk9MREVSIENPQ0hFL2ljb24tNDh4NDgucG5nIiwiaWF0IjoxNzc3MDUxODczLCJleHAiOjI2NDA5NjU0NzN9.qA3JCCXhi3P78ubniz3skfMGMnfilQmkT-t0tAyHNxc',
                sizes: '48x48',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-64x64.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT04gRk9MREVSIENPQ0hFL2ljb24tNjR4NjQucG5nIiwiaWF0IjoxNzc3MDUxOTAwLCJleHAiOjI2NDA5NjU1MDB9.khtJ6IX4oiypXlXgfRcnqecJqkQRqkmTOZ-_VpU2Hd0',
                sizes: '64x64',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-72x72.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT04gRk9MREVSIENPQ0hFL2ljb24tNzJ4NzIucG5nIiwiaWF0IjoxNzc3MDUxOTE2LCJleHAiOjI2NDA5NjU1MTZ9.gVNjdBwkV6VD40Hg83qfaXdlmnjXX2wLl9ZLjB_gdWc',
                sizes: '72x72',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-96x96.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT04gRk9MREVSIENPQ0hFL2ljb24tOTZ4OTYucG5nIiwiaWF0IjoxNzc3MDUxOTI3LCJleHAiOjI2NDA5NjU1Mjd9.AVtSXVjkIvqaICV7Z5lw35TIlSu6VouXkqW9UnFHg3o',
                sizes: '96x96',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-128x128.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT04gRk9MREVSIENPQ0hFL2ljb24tMTI4eDEyOC5wbmciLCJpYXQiOjE3NzcwNTE2MzQsImV4cCI6MjY0MDk2NTIzNH0.JDnmujlbObUP8kweGTmlzUVEXReR4x5nEKSCTQEetZU',
                sizes: '128x128',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-144x144.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT04gRk9MREVSIENPQ0hFL2ljb24tMTQ0eDE0NC5wbmciLCJpYXQiOjE3NzcwNTE3MjAsImV4cCI6MjY0MDk2NTMyMH0.IhCZCLsTjp2OfdsnyUHIybLZjJVLbTU1-bnZLptgMu4',
                sizes: '144x144',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-152x152.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT04gRk9MREVSIENPQ0hFL2ljb24tMTUyeDE1Mi5wbmciLCJpYXQiOjE3NzcwNTE3MzgsImV4cCI6MjY0MDk2NTMzOH0.QYvp412yJy-mOMOmNx3wRnZFhCeB6No189bxRwaDwHM',
                sizes: '152x152',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-180x180.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05gRk9MREVSIENPQ0hFL2ljb24tMTgweDE4MC5wbmciLCJpYXQiOjE3NzcwNTE4MDQsImV4cCI6MjY0MDk2NTQwNH0.zzAT9YH8FZKEY6PDHuiieCtwUGqcGE5KUxvJ6WYhoIo',
                sizes: '180x180',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-192x192.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05gRk9MREVSIENPQ0hFL2ljb24tMTkyeDE5Mi5wbmciLCJpYXQiOjE3NzcwNTE4MTcsImV4cCI6MjY0MDk2NTQxN30.4EjAvl6KlSGsi8E6xCNrborJOFgvDEg0vI4liLEcLhA',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-256x256.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05gRk9MREVSIENPQ0hFL2ljb24tMjU2eDI1Ni5wbmciLCJpYXQiOjE3NzcwNTE4MzIsImV4cCI6MjY0MDk2NTQzMn0.TkTCn_ZAVjLXBzSCQgWkyJaknEG4R6rv75aLR6i2QTc',
                sizes: '256x256',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-384x384.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05gRk9MREVSIENPQ0hFL2ljb24tMzg0eDM4NC5wbmciLCJpYXQiOjE3NzcwNTE4NjEsImV4cCI6MjY0MDk2NTQ2MX0.ub3prGtxmENFFyzbZEMm2gW8vnBdNZJfwGl-TEO0mZo',
                sizes: '384x384',
                type: 'image/png'
              },
              {
                src: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-512x512.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05gRk9MREVSIENPQ0hFL2ljb24tNTEyeDUxMi5wbmciLCJpYXQiOjE3NzcwNTE4ODgsImV4cCI6MjY0MDk2NTQ4OH0.TgtTeCi7eLg44Q_nP2b-10RmTJbafPpz8xCtsd-44vc',
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
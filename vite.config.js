// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        // Esto activa la minificación automática
        minify: 'esbuild',
        lib: {
            entry: 'src/index.js',        // ¿Dónde está tu código?
            name: 'KoruCountdown',        // Nombre global
            fileName: 'koru-widget',      // Nombre del archivo final
            formats: ['umd']              // Formato universal (funciona en todos los navegadores)
        },
        rollupOptions: {
            // Asegura que el SDK se incluya DENTRO del archivo final
            output: {
                extend: true
            }
        }
    }
});
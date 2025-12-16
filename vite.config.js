import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools(), basicSsl(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },

    server: {
        https: true,
        port: 8666,
        host: '0.0.0.0',
        hmr: {
            host: 'dev.smit.team',
            port: 8666,
            protocol: 'wss'
        }
    }
})

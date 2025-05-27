import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
       resolve: {
              alias: {
                     $lib: fileURLToPath(new URL('./src/lib', import.meta.url))
              },
       },
       plugins: [svelte()],
})
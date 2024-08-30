import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
       resolve: {
              alias: {
                     $lib: path.resolve("./src/lib"),
              },
       },
       plugins: [svelte()],
       // base: "./",
})
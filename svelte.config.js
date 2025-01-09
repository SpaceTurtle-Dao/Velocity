import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  alias: {
    "@/*": "./path/to/lib/*",

    "@stores/*": "./src/lib/stores/*",
  },
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
};

<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Search } from "lucide-svelte";
  //@ts-ignore
  import debounce from "lodash/debounce";

  export let open = false;
  export let onSelect: (url: string) => void;

  const GIPHY_API_KEY = "www.giphy.com";
  let searchTerm = "";
  let gifs: Array<{ id: string; url: string; preview: string }> = [];
  let isLoading = false;

  const searchGifs = debounce(async (term: string) => {
    if (!term) {
      gifs = [];
      return;
    }
    
    isLoading = true;
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(term)}&limit=10`
      );
      const data = await response.json();
      gifs = data.data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.original.url,
        preview: gif.images.fixed_height.url
      }));
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      gifs = [];
    } finally {
      isLoading = false;
    }
  }, 500);

  function handleSelect(gif: { url: string }) {
    onSelect(gif.url);
    open = false;
    searchTerm = "";
    gifs = [];
  }

  function handleClose() {
    open = false;
    searchTerm = "";
    gifs = [];
  }

  $: if (searchTerm) {
    searchGifs(searchTerm);
  }
</script>

<Dialog.Root bind:open on:close={handleClose}>
  <Dialog.Content class="w-full max-w-2xl">
    <Dialog.Header>
      <Dialog.Title class="text-primary">Search GIFs</Dialog.Title>
      <Dialog.Description>
        Search and select a GIF to add to your post
      </Dialog.Description>
    </Dialog.Header>
    
    <div class="space-y-4">
      <div class="relative">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search GIFs..."
          bind:value={searchTerm}
          class="pl-8 text-white"
        />
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
        {#if isLoading}
          <div class="col-span-full text-center py-4">Loading....</div>
        {:else if gifs.length === 0 && searchTerm}
          <div class="col-span-full text-center py-4">No GIFs found</div>
        {:else}
          {#each gifs as gif (gif.id)}
            <button
              class="relative aspect-video w-full overflow-hidden rounded-lg hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary"
              on:click={() => handleSelect(gif)}
            >
              <img
                src={gif.preview}
                alt="GIF"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          {/each}
        {/if}
      </div>
    </div>
    
    <Dialog.Footer>
      <Button variant="ghost"
      on:click={handleClose}
      class="text-gray-400 hover:text-gray-300 hover:bg-gray-800"
      >Cancel</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
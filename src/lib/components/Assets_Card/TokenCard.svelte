<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Coins, Eye } from "lucide-svelte";

  export let name: string = "";
//   export let price: number = 0;
  export let imageUrl: string = "";
  export let bannerUrl: string = "";
  export let assetUrl: string = "";

  //@ts-ignore
  function handleView(event) {
    event.stopPropagation();
    
    window.open(assetUrl, "_blank", "noopener,noreferrer");
    dispatch("view", { name, url: assetUrl });
  }

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<div class="bg-background-800 rounded-lg overflow-hidden shadow-md border border-border w-full h-60 relative">
  <!-- Banner Background -->
  <div class="absolute inset-0 w-full h-full overflow-hidden">
    {#if bannerUrl}
      <img
        src={bannerUrl.startsWith("http") ? bannerUrl : `https://arweave.net/${bannerUrl}`}
        alt="Banner"
        class="w-full h-full object-cover opacity-60"
      />
    {:else}
      <div class="w-full h-full bg-gradient-to-br from-background-700 to-background-900"></div>
    {/if}
    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
  </div>
  
  <div class="relative z-10 flex flex-col h-full p-4">
    <div class="mb-2">
      <div class="text-white font-bold text-lg truncate">{name}</div>
    </div>
    
    <div class="flex-grow flex items-center justify-center mb-4">
      {#if imageUrl}
        <img
          src={imageUrl.startsWith("http") ? imageUrl : `https://arweave.net/${imageUrl}`}
          alt={name}
          class="w-28 h-28 object-contain drop-shadow-lg"
        />
      {:else}
        <div class="w-28 h-28 bg-background-700 rounded-full flex items-center justify-center">
          <Coins class="w-12 h-12 text-primary opacity-70" />
        </div>
      {/if}
    </div>
    
    <div class="mt-auto flex items-center justify-between">
      <span class="text-white font-medium text-lg"></span>
      <Button
        variant="default"
        size="sm"
        class="py-1 px-4 h-8 bg-primary hover:bg-primary/90"
        on:click={handleView}
      >
        <Eye class="w-4 h-4 mr-1" />
        View
      </Button>
    </div>
  </div>
</div>
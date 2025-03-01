<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Coins } from "lucide-svelte";
  import { ucmService } from "$lib/services/UCMService";
  import { onMount } from "svelte";

  let collections = [];

  onMount(async () => {
    collections = await ucmService.fetchCollections("JAHF1fo4MECRZZFKGcT0B6XM94Lqe-3FtB4Ht_kTEK0");
    console.log("Fetched Collections:", collections);
  });

  function handleBuy(collectionId: string) {
    console.log("View clicked for collection ID:", collectionId);
    const url = `https://bazar.arweave.net/#/collection/${collectionId}/assets/`;
    window.open(url, '_blank');
  }

  function truncateCreator(creator: string): string {
    return creator.slice(0, 14);
  }
  
  function truncateTitle(title: string): string {
    if (title.length > 30) {
      return title.slice(0, 30) + "....";
    }
    return title;
  }
</script>

<div class="bg-background-800 rounded-lg p-4 shadow-lg border border-border">
  <h2 class="text-lg font-medium text-primary mb-3">Trending Collections</h2>

  <div class="space-y-2 max-h-96 overflow-y-auto">
    {#each collections as collection (collection.id)}
      <div class="flex items-center justify-between bg-background-700 rounded-lg p-2 w-full border border-border">
        <div class="flex items-center gap-2">
          {#if collection.thumbnail}
            <img
              src={`https://arweave.net/${collection.thumbnail}`}
              alt={collection.title}
              class="w-8 h-8 rounded-full object-cover"
            />
          {:else}
            <div class="w-8 h-8 bg-background-600 rounded-full flex items-center justify-center">
              <Coins class="w-4 h-4 text-primary opacity-70" />
            </div>
          {/if}

          <div class="flex flex-col">
            <span class="text-sm text-primary font-medium">{truncateTitle(collection.title)}</span>
            <span class="text-xs text-muted-foreground">
              Creator: {truncateCreator(collection.creator)}.....
            </span>
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          class="text-xs h-7 px-3 py-1 bg-primary hover:bg-primary/90"
          on:click={() => handleBuy(collection.id)}
        >
          View
        </Button>
      </div>
    {/each}
  </div>
</div>
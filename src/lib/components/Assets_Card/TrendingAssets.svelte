<script lang="ts">
  import { Image, Coins } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { ucmService } from "$lib/services/UCMService";
  import { onMount } from "svelte";
  //@ts-ignore
  import { type CollectionType } from '@permaweb/libs';
  import { isMobile } from "$lib/stores/is-mobile.store";
  import TrendingAssetHoverCard from "./TrendingAssetsHoverCard.svelte";
  
  let collections: CollectionType[] = [];
  let isLoading = true;
  const MAX_COLLECTIONS = 200;
  
  onMount(async () => {
    try {
      const allCollections = await ucmService.fetchCollections();
      // Take only the first 200 collections
      collections = allCollections.slice(0, MAX_COLLECTIONS);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      isLoading = false;
    }
  });
  
  function handleBuy(collectionId: string) {
    const url = `https://bazar.arweave.net/#/collection/${collectionId}/assets/`;
    window.open(url, '_blank');
  }
  
  function truncateAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }
  
  function truncateTitle(title: string): string {
    if (title && title.length > 20) {
      return title.slice(0, 20) + "...";
    }
    return title || "Untitled";
  }
</script>

{#if $isMobile}
  <div class="w-full px-3 py-4 bg-background">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-primary">Trending Collections</h2>
      <Button variant="ghost" size="sm" class="text-sm text-primary">View All</Button>
    </div>
    
    {#if isLoading}
      <div class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    {:else}
      <div class="space-y-2">
        {#each collections.slice(0, 4) as collection, index}
          <TrendingAssetHoverCard {collection}>
            <div 
              class="flex items-center p-3 bg-background-800 rounded-lg border border-border hover:border-primary transition-colors duration-200"
              on:click={() => handleBuy(collection.id)}
              on:keydown={(e) => e.key === 'Enter' && handleBuy(collection.id)}
              tabindex="0"
              role="button"
            >
              <div class="flex-shrink-0 mr-3 relative">
                <div class="absolute -top-1 -left-1 bg-background-700 rounded-full w-5 h-5 flex items-center justify-center text-xs text-primary font-semibold">
                  {index + 1}
                </div>
                {#if collection.thumbnail}
                  <img
                    src={`https://arweave.net/${collection.thumbnail}`}
                    alt={collection.title}
                    class="w-12 h-12 rounded-md object-cover border border-border"
                  />
                {:else}
                  <div class="w-12 h-12 bg-background-600 rounded-md flex items-center justify-center border border-border">
                    <Coins class="w-6 h-6 text-primary opacity-70" />
                  </div>
                {/if}
              </div>
              
              <div class="flex-1">
                <h3 class="text-primary font-medium text-sm">{truncateTitle(collection.title)}</h3>
                <p class="text-muted-foreground text-xs">
                  {truncateAddress(collection.creator)}
                </p>
              </div>
            </div>
          </TrendingAssetHoverCard>
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div class="bg-background-800 rounded-lg p-4 shadow-lg border border-border">
    <h2 class="text-lg font-medium text-primary mb-3">Trending Collections</h2>

    {#if isLoading}
      <div class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    {:else}
      <div class="space-y-2 max-h-96 overflow-y-auto scrollbar-hidden">
        {#each collections as collection (collection.id)}
          <TrendingAssetHoverCard {collection}>
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
                    Creator: {truncateAddress(collection.creator)}
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
          </TrendingAssetHoverCard>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .scrollbar-hidden {
    scrollbar-width: none;
  }
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
</style>
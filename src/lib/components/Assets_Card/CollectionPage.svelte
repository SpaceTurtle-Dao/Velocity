<script lang="ts">
  import { isMobile } from "$lib/stores/is-mobile.store";
  import MobileCollectionsView from "./TrendingAssets.svelte";
  import { Button } from "$lib/components/ui/button";
  import { ucmService } from "$lib/services/UCMService";
  import { onMount } from "svelte";
  //@ts-ignore
  import { type CollectionType } from '@permaweb/libs';
  import { Coins, Search, Filter } from "lucide-svelte";
  
  let collections: CollectionType[] = [];
  let isLoading = true;
  let searchTerm = "";
  let isSearchFocused = false;
  const MAX_COLLECTIONS = 200;
  
  onMount(async () => {
    try {
      const allCollections = await ucmService.fetchCollections();
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
  
  function handleBlur() {
    setTimeout(() => {
      isSearchFocused = false;
    }, 200);
  }
  
  $: filteredCollections = collections.filter(collection => 
    collection.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<div class="w-full mt-4">
  {#if $isMobile}
    <!-- Mobile View -->
    <div class="p-3">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold text-primary">Collections</h1>
        <!-- Commented out Filter button
        <Button variant="outline" size="sm" class="px-3">
          <Filter class="w-4 h-4 mr-2 bg-background-700" />
          Filter
        </Button>
        -->
      </div>
      
      <div class="mb-4 relative">
        <div
          class="flex items-center space-x-2 bg-background-700 rounded-full p-2 border border-opacity-30 transition-all duration-200"
          class:border-primary={isSearchFocused}
          class:border-border={!isSearchFocused}
          class:ring-2={isSearchFocused}
          class:ring-primary-400={isSearchFocused}
          class:ring-opacity-50={isSearchFocused}
        >
          <Search class="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search collections..."
            class="bg-transparent focus:outline-none text-primary w-full"
            on:focus={() => isSearchFocused = true}
            on:blur={handleBlur}
          />
        </div>
      </div>
      
      {#if isLoading}
        <div class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      {:else}
        <div class="space-y-2">
          {#each filteredCollections as collection, index}
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
          {/each}
          
          {#if filteredCollections.length === 0}
            <div class="py-8 text-center text-muted-foreground">
              No collections found matching your search.
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {:else}
    <!-- Desktop View -->
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary">Collections</h1>
        <div class="relative">
          <div
            class="flex items-center space-x-2 bg-background-700 rounded-full p-2 border border-opacity-30 transition-all duration-200 w-64"
            class:border-primary={isSearchFocused}
            class:border-border={!isSearchFocused}
            class:ring-2={isSearchFocused}
            class:ring-primary-400={isSearchFocused}
            class:ring-opacity-50={isSearchFocused}
          >
            <Search class="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              bind:value={searchTerm}
              placeholder="Search collections..."
              class="bg-transparent focus:outline-none text-primary w-full"
              on:focus={() => isSearchFocused = true}
              on:blur={handleBlur}
            />
          </div>
          
          <!-- Commented out Filter button
          <Button variant="outline" class="ml-2">
            <Filter class="w-4 h-4 mr-2" />
            Filter
          </Button>
          -->
        </div>
      </div>
      
      {#if isLoading}
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each filteredCollections as collection}
            <div 
              class="bg-background-800 rounded-lg p-4 border border-border hover:border-primary transition-colors duration-200 cursor-pointer"
              on:click={() => handleBuy(collection.id)}
              on:keydown={(e) => e.key === 'Enter' && handleBuy(collection.id)}
              tabindex="0"
              role="button"
            >
              <div class="aspect-square mb-3 overflow-hidden rounded-md">
                {#if collection.thumbnail}
                  <img
                    src={`https://arweave.net/${collection.thumbnail}`}
                    alt={collection.title}
                    class="w-full h-full object-cover"
                  />
                {:else}
                  <div class="w-full h-full bg-background-600 flex items-center justify-center">
                    <Coins class="w-12 h-12 text-primary opacity-70" />
                  </div>
                {/if}
              </div>
              <h3 class="text-primary font-medium">{collection.title || "Untitled"}</h3>
              <p class="text-muted-foreground text-sm">
                Creator: {truncateAddress(collection.creator)}
              </p>
            </div>
          {/each}
          
          {#if filteredCollections.length === 0}
            <div class="col-span-full py-12 text-center text-muted-foreground">
              No collections found matching your search.
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
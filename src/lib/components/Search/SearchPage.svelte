<script lang="ts">
  import { Search as SearchIcon, X as XIcon } from "lucide-svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { HUB_REGISTRY_ID, toUrl } from "$lib/constants";
  import type { Zone } from "$lib/models/Zone";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import { isMobile } from "$lib/stores/is-mobile.store";

  // Internal state - no props needed
  let searchQuery = "";
  let searchResults: Zone[] = [];
  let isLoading = false;
  let debounceTimer: NodeJS.Timeout;
  let isSearchFocused = false;
  let clickedProfile = false;
  let searchInput: HTMLInputElement;

  async function handleSearch() {
    if (!searchQuery.trim() || !isSearchFocused) {
      searchResults = [];
      isLoading = false;
      return;
    }

    isLoading = true;
    try {
      searchResults = await hubRegistryService.search(
        HUB_REGISTRY_ID(),
        searchQuery.toLowerCase(),
        0,
        100
      );
    } catch (error) {
      console.error("Search error:", error);
      searchResults = [];
    } finally {
      isLoading = false;
    }
  }

  function handleBlur() {
    if (!clickedProfile) {
      isSearchFocused = false;
      setTimeout(() => {
        if (!isSearchFocused && !clickedProfile) {
          searchResults = [];
        }
        clickedProfile = false;
      }, 200);
    }
  }

  function handleFocus() {
    isSearchFocused = true;
    if (searchQuery.trim()) {
      handleSearch();
    }
  }

  function navigateToProfile(address: string, event: MouseEvent) {
    clickedProfile = true;
    push(`/profile/${address}`);
    setTimeout(() => {
      searchQuery = "";
      searchResults = [];
      isSearchFocused = false;
      clickedProfile = false;
    }, 100);
  }

  function debounceSearch() {
    clearTimeout(debounceTimer);
    if (searchQuery.trim() && isSearchFocused) {
      debounceTimer = setTimeout(handleSearch, 300);
    } else {
      searchResults = [];
    }
  }

  function clearSearch() {
    searchQuery = "";
    searchResults = [];
    searchInput?.focus();
  }

  onMount(() => {
    return () => {
      clearTimeout(debounceTimer);
    };
  });
</script>

<div class="relative w-full p-5">
  <div
    class="flex items-center space-x-3 bg-background-700 rounded-full p-{$isMobile ? '3' : '2'} border border-opacity-30 transition-all duration-300 ease-in-out"
    class:border-primary={isSearchFocused}
    class:border-border={!isSearchFocused}
    class:ring-2={isSearchFocused}
    class:ring-primary-400={isSearchFocused}
    class:ring-opacity-50={isSearchFocused}
    class:shadow-lg={isSearchFocused}
    class:hover:border-primary-500={!isSearchFocused}
  >
    <SearchIcon 
      class="w-{$isMobile ? '5' : '4'} h-{$isMobile ? '5' : '4'} text-muted-foreground flex-shrink-0" 
    />
    
    <input
      bind:this={searchInput}
      type="text"
      bind:value={searchQuery}
      placeholder="Search profiles..."
      class="bg-transparent focus:outline-none text-primary flex-1 text-{$isMobile ? 'base' : 'sm'} placeholder:text-muted-foreground"
      on:input={debounceSearch}
      on:focus={handleFocus}
      on:blur={handleBlur}
    />
    
    {#if searchQuery}
      <button
        type="button"
        on:click={clearSearch}
        class="p-1 rounded-full hover:bg-background-600 transition-colors duration-200 flex-shrink-0"
        aria-label="Clear search"
      >
        <XIcon class="w-4 h-4 text-muted-foreground" />
      </button>
    {/if}
  </div>

  {#if isLoading}
    <div class="absolute top-full left-0 right-0 mt-2 flex justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
    </div>
  {/if}

  {#if searchResults.length > 0 && isSearchFocused}
    <div
      class="absolute top-full left-0 right-0 mt-2 bg-card text-card-foreground border border-border rounded-lg shadow-xl backdrop-blur-sm z-50 overflow-y-auto"
      class:max-h-[60vh]={$isMobile}
      class:max-h-[320px]={!$isMobile}
    >
      <div class="p-2 space-y-1">
        {#each searchResults as zone, index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            on:click={(e) => navigateToProfile(zone.owner, e)}
            on:mousedown={() => (clickedProfile = true)}
            class="group cursor-pointer transition-all duration-200 rounded-lg overflow-hidden hover:bg-background-600 hover:shadow-sm"
            class:animate-fade-in-up={index < 5}
            style="animation-delay: {index * 50}ms"
          >
            <div class="flex items-center space-x-3 p-3">
              <!-- Profile Image/Avatar -->
              <div class="relative flex-shrink-0">
                {#if zone.spec.profile.thumbnail}
                  <img
                    src={toUrl(zone.spec.profile.thumbnail)}
                    alt={zone.spec.profile.displayName || zone.spec.profile.userName}
                    class="w-{$isMobile ? '12' : '10'} h-{$isMobile ? '12' : '10'} rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary-400 transition-all duration-200"
                  />
                {:else}
                  <div
                    class="w-{$isMobile ? '12' : '10'} h-{$isMobile ? '12' : '10'} bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center rounded-full ring-2 ring-transparent group-hover:ring-primary-400 transition-all duration-200"
                  >
                    <span class="text-{$isMobile ? 'xl' : 'lg'} font-semibold text-white">
                      {(zone.spec.profile.displayName || zone.spec.profile.userName)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                {/if}
                
                <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-primary font-medium truncate text-{$isMobile ? 'base' : 'sm'} group-hover:text-primary-400 transition-colors duration-200">
                  {zone.spec.profile.displayName || zone.spec.profile.userName}
                </h3>
                {#if zone.spec.profile.description}
                  <p class="text-{$isMobile ? 'sm' : 'xs'} text-muted-foreground line-clamp-1 mt-0.5">
                    {zone.spec.profile.description}
                  </p>
                {/if}
              </div>

              <!-- Arrow indicator -->
              <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if searchQuery && isSearchFocused && !isLoading}
    <div
      class="absolute top-full left-0 right-0 mt-2 bg-card text-card-foreground border border-border rounded-lg shadow-xl backdrop-blur-sm z-50"
    >
      <div class="p-8 text-center">
        <SearchIcon class="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p class="text-muted-foreground text-sm">No profiles found for "{searchQuery}"</p>
        <p class="text-muted-foreground text-xs mt-1">Try searching with different keywords</p>
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out forwards;
    opacity: 0;
  }
  
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
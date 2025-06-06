<script lang="ts">
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { Search as SearchIcon } from "lucide-svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import TrendingAssets from "$lib/components/Assets_Card/TrendingAssets.svelte";
  import { HUB_REGISTRY_ID, toUrl } from "$lib/constants";
  import type { Zone } from "$lib/models/Zone";
  import { hubRegistryService } from "$lib/services/HubRegistryService";

  let searchQuery = "";
  let searchResults: Zone[] = [];
  let isLoading = false;
  let debounceTimer: NodeJS.Timeout;
  let isSearchFocused = false;
  let clickedProfile = false;

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

  async function handleSearch() {
    if (!searchQuery.trim() || !isSearchFocused) {
      searchResults = [];
      isLoading = false;
      return;
    }

    isLoading = true;
    console.log(searchQuery.toLowerCase());
    try {
      //create a way to search through a list of known hubs
      searchResults = await hubRegistryService.search(
        HUB_REGISTRY_ID(),
        searchQuery.toLowerCase(),
        0,
        100,
      );
      console.log(searchResults);
      if (isSearchFocused && searchQuery.trim()) {
      }
    } catch (error) {
      console.log("Search error:", error);
      searchResults = [];
    } finally {
      isLoading = false;
    }
  }

  function navigateToProfile(address: string, event: MouseEvent) {
    //event.preventDefault();
    //event.stopPropagation();
    //clickedProfile = true;
    push(`/profile/${address}`);
  }

  function debounceSearch() {
    clearTimeout(debounceTimer);
    // Only trigger search if query is not empty and search is focused
    if (searchQuery.trim() && isSearchFocused) {
      debounceTimer = setTimeout(handleSearch, 300);
    } else {
      searchResults = [];
    }
  }

  const assetData = {
    name: "Llama Coin",
    owners: 12722,
    price: 0.2555,
    quantity: 425.9468,
    maxQuantity: 54485.4198,
    imageUrl: "",
  };

  onMount(() => {
    return () => {
      clearTimeout(debounceTimer);
    };
  });
</script>

{#if !$isMobile}
  <div class="flex flex-col px-5 w-1/3">
    <div class="bg-background-800 p-4">
      <div class="relative pt-6">
        <div
          class="flex items-center space-x-2 bg-background-700 rounded-full p-2 border border-opacity-30 transition-all duration-200"
          class:border-primary={isSearchFocused}
          class:border-border={!isSearchFocused}
          class:ring-2={isSearchFocused}
          class:ring-primary-400={isSearchFocused}
          class:ring-opacity-50={isSearchFocused}
        >
          <SearchIcon class="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search profiles..."
            class="bg-transparent focus:outline-none text-primary"
            on:input={debounceSearch}
            on:focus={() => {
              isSearchFocused = true;
              if (searchQuery.trim()) {
                handleSearch();
              }
            }}
            on:blur={handleBlur}
          />
        </div>
      </div>

      {#if isLoading}
        <div class="flex justify-center mt-4">
          <div
            class="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"
          ></div>
        </div>
      {:else if searchResults.length > 0 && isSearchFocused}
        <div
          class="mt-4 max-h-[320px] overflow-y-auto bg-card text-card-foreground border border-border rounded shadow-sm p-2"
        >
          <div class="space-y-2">
            {#each searchResults as zone}
              <!-- Changed from link to on:click handler -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                on:click={(e) => navigateToProfile(zone.owner, e)}
                on:mousedown={() => (clickedProfile = true)}
                class="block hover:bg-background-600 cursor-pointer transition-colors duration-200 rounded-lg overflow-hidden"
              >
                <div class="flex items-center space-x-3 p-3 bg-background-700">
                  {#if zone.spec.profile.thumbnail}
                    <img
                      src={toUrl(zone.spec.profile.thumbnail)}
                      alt={zone.spec.profile.displayName || zone.spec.profile.userName}
                      class="w-10 h-10 rounded-full object-cover"
                    />
                  {:else}
                    <div
                      class="w-10 h-10 bg-background-600 flex items-center justify-center"
                    >
                      <span class="text-lg text-primary">
                        {(zone.spec.profile.displayName || zone.spec.profile.userName)
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  {/if}

                  <div class="flex-1 min-w-0">
                    <h3 class="text-primary font-medium truncate">
                      {zone.spec.profile.displayName || zone.spec.profile.userName}
                      <!-- Implement when address is there -->
                      <!-- {profile.displayName || profile.userName || profile.address.slice(0, 8) + '...'} -->
                    </h3>
                    {#if zone.spec.profile.description}
                      <p class="text-sm text-muted-foreground line-clamp-1">
                        {zone.spec.profile.description}
                      </p>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else if searchQuery && isSearchFocused}
        <p class="text-center text-muted-foreground mt-4">No profiles found</p>
      {/if}
    </div>
    <div class="px-5">
      <TrendingAssets />
    </div>
  </div>
{/if}

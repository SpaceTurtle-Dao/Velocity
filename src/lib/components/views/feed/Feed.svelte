<script lang="ts">
  import PostComponent from "$lib/components/posts/Post.svelte";
  import type { Post } from "$lib/models/Post";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { onMount, onDestroy } from "svelte";
  import { hubService } from "$lib/services/HubService";
  import { profileService } from "$lib/services/ProfileService";
  import { currentUser } from "$lib/stores/currentUser.store";
  import { timestampService } from "$lib/utils/date-time";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import { HUB_REGISTRY_ID } from "$lib/constants";
  import type { Zone } from "$lib/models/Zone";

  let feed: Array<Post> = [];
  let isLoadingFeed = true;
  let isLoadingMore = false;
  let lastLoadedTimestamp: number | null = null;
  let scrollContainer: HTMLElement | null = null;
  let hubId: string;
  let address: string;

  hubService.subscribe(async (posts) => {
    feed = posts.values().toArray();
  });

  /*hubRegistryService.subscribe(async (hubs) => {
    if (address && hubs.has(address)) {
      hub = hubs.get(address)!;
      hubId = hub.spec.processId;
      fetchFeedEvents();
    }
  });*/

  currentUser.subscribe(async (value) => {
    if (value.address && value.zone && value.hub) {
      address = value.address;
      hubId = value.zone.spec.processId;
      fetchFeedEvents();
      //hubRegistryService.getZoneById(HUB_REGISTRY_ID(), address);
    }
  });

  async function fetchFeedEvents() {
    const now = new Date();
    let since = timestampService.subtract(new Date(), 10, "days").getTime();
    let until = now.getTime();
    if(lastLoadedTimestamp){
      since = lastLoadedTimestamp
    }
    try {
      hubService.fetchPost(hubId, since, until);
      
      lastLoadedTimestamp = until;
    } catch (error) {
    } finally {
      isLoadingFeed = false;
    }
  }

  function handleScroll() {
    if (!scrollContainer) return;

    const scrollPosition =
      scrollContainer.scrollTop + scrollContainer.clientHeight;
    const scrollHeight = scrollContainer.scrollHeight;
    const threshold = 200;

    if (scrollHeight - scrollPosition < threshold && !isLoadingMore) {
      fetchFeedEvents();
    }
  }

  onMount(async () => {
    let isConnected = await currentUser.isConnected();
    if (!isConnected) {
      await currentUser.connectWallet();
    }
    scrollContainer = document.querySelector(".scrollbar-hidden");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    } else {
      console.error(
        "Could not find scrollable container with class .scrollbar-hidden",
      );
    }
  });

  onDestroy(() => {
    if (scrollContainer) {
      scrollContainer.removeEventListener("scroll", handleScroll);
    }
  });
</script>

{#if address}
  <div class="relative">
    <div class="md:mt-10 mt-5 max-w-prose w-full">
      <Tabs.Root value="for you" class="max-w-prose">
        <Tabs.List class="grid grid-cols-1 md:mx-0 mx-4">
          <Tabs.Trigger
            class="underline-tabs-trigger"
            on:click={fetchFeedEvents}
            value="for you">For You</Tabs.Trigger
          >
        </Tabs.List>

        <Tabs.Content value="for you">
          {#if feed.length === 0}
            <div class="flex justify-center items-center py-16">
              <div
                class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
              <span class="ml-3 text-muted-foreground">Loading posts...</span>
            </div>
          {:else}
            <div>
              {#each feed as post}
                <div class="max-w-prose">
                  <PostComponent {post} />
                </div>
              {/each}

              <div class="sticky bottom-0 bg-background/80 backdrop-blur-sm">
                {#if isLoadingMore}
                  <div class="flex justify-center items-center py-4">
                    <div
                      class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
                      role="status"
                    >
                      <span class="sr-only">Loading more...</span>
                    </div>
                    <span class="ml-3 text-muted-foreground"
                      >Loading more posts...</span
                    >
                  </div>
                {/if}
              </div>

              <div id="scroll-sentinel" class="h-4"></div>
            </div>
          {/if}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
{/if}
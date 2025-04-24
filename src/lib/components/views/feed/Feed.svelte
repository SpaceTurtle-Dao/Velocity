<script lang="ts">
  import PostComponent from "$lib/components/posts/Post.svelte";
  import type { Post } from "$lib/models/Post";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { onMount, onDestroy } from "svelte";
  import { hubService } from "$lib/services/HubService";
  import { profileService } from "$lib/services/ProfileService";
  import { addressStore } from "$lib/stores/address.store";
  import { timestampService } from "$lib/utils/date-time";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import { HUB_REGISTRY_ID } from "$lib/constants";
  import type { Zone } from "$lib/models/Zone";

  let feed: Array<Post> = [];
  let following: Array<Post> = [];
  let isLoadingFeed = true;
  let isLoadingFollowing = false;
  let isLoadingMore = false;
  let lastLoadedTimestamp: number | null = null;
  let scrollContainer: HTMLElement | null = null;
  let hubId: string;
  let hub: Zone;
  let address: string;

  hubService.subscribe(async (posts) => {
    feed = posts.values().toArray();
    console.log(feed);
  });

  hubRegistryService.subscribe(async (hubs) => {
    if (address && hubs.has(address)) {
      hub = hubs.get(address)!;
      hubId = hub.spec.processId;
      console.log("Hub", hub);
      console.log("Hub id:", hubId);
      fetchFeedEvents();
    }
  });

  addressStore.subscribe(async (value) => {
    if (value.address) {
      address = value.address;
      hubRegistryService.getZoneById(HUB_REGISTRY_ID(), address);
    }
  });

  async function fetchFeedEvents() {
    console.log(address);
    const now = new Date();
    let since = timestampService.subtract(new Date(), 10, "days").getTime();
    let until = now.getTime();
    if(lastLoadedTimestamp){
      since = lastLoadedTimestamp
    }
    try {
      console.log("getting Post");
      console.log(hubId);
      console.log(since);
      console.log(until);
      await hubService.fetchPost(hubId, since, until);
      console.log("Initial feed posts loaded:", feed.length);
      lastLoadedTimestamp = until;
    } catch (error) {
      console.log("Error fetching feed events:", error);
    } finally {
      isLoadingFeed = false;
    }
  }

  async function fetchFollowingEvents() {
    if (!address) return;
    isLoadingFollowing = true;

    try {
      //let profile = await profileService.get(address);
      // following = await hubService.fetchPostWithAuthors($currentHubId, profile.followList);
    } catch (error) {
      console.log("Error fetching following events:", error);
    } finally {
      isLoadingFollowing = false;
    }
  }

  /*async function loadMorePosts() {
    if (hubId == undefined) return;
    if (isLoadingMore || !lastLoadedTimestamp) return;

    isLoadingMore = true;
    console.log("Loading more posts...");
    console.log("Current feed size:", feed.length);

    try {
      const until = lastLoadedTimestamp;
      const since = timestampService
        .subtract(new Date(until), 10, "days")
        .getTime();

      const olderPosts = await hubService.fetchPost(hubId, since, until);
      console.log("Older posts fetched:", olderPosts.length);
      if (olderPosts.length > 0) {
        const existingIds = new Set(feed.map((post) => post.id));
        const uniqueOlderPosts = olderPosts.filter(
          (post) => !existingIds.has(post.id),
        );

        if (uniqueOlderPosts.length > 0) {
          feed = [...feed, ...uniqueOlderPosts];
          console.log("Added more posts", uniqueOlderPosts.length);
          lastLoadedTimestamp = since;
        } else {
          console.log("No new unique posts to load");
        }
      } else {
        console.log("No more posts to load");
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      isLoadingMore = false;
    }
  }*/

  function handleScroll() {
    if (!scrollContainer) return;

    const scrollPosition =
      scrollContainer.scrollTop + scrollContainer.clientHeight;
    const scrollHeight = scrollContainer.scrollHeight;
    const threshold = 200;

    if (scrollHeight - scrollPosition < threshold && !isLoadingMore) {
      console.log("Scroll threshold reached!", scrollHeight - scrollPosition);
      fetchFeedEvents();
    }
  }

  onMount(async () => {
    let isConnected = await addressStore.isConnected();
    if (!isConnected) {
      await addressStore.connectWallet();
    }
    scrollContainer = document.querySelector(".scrollbar-hidden");
    if (scrollContainer) {
      console.log("Found scroll container, attaching event listener");
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
  <div class="relative h-full">
    <div class="md:mt-10 mt-5 max-w-prose w-full">
      <Tabs.Root value="for you" class="max-w-prose">
        <Tabs.List class="grid grid-cols-2 md:mx-0 mx-4">
          <Tabs.Trigger
            class="underline-tabs-trigger"
            on:click={fetchFeedEvents}
            value="for you">For You</Tabs.Trigger
          >
          <Tabs.Trigger on:click={fetchFollowingEvents} value="following"
            >Following</Tabs.Trigger
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

        <Tabs.Content value="following">
          {#if isLoadingFollowing}
            <div class="flex justify-center items-center py-16">
              <div
                class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
              <span class="ml-3 text-muted-foreground"
                >Loading following...</span
              >
            </div>
          {:else}
            <div>
              {#each following as post}
                <div class="max-w-prose">
                  <PostComponent {post} />
                </div>
              {/each}
            </div>
          {/if}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
{/if}

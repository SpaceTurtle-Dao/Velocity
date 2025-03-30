<script lang="ts">
  import PostComponent from "$lib/components/posts/Post.svelte";
  import type { Post } from "$lib/models/Post";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { onMount, onDestroy } from "svelte";
  import { hubService } from "$lib/services/HubService";
  import { profileService } from "$lib/services/ProfileService";
  import { addressStore } from "$lib/stores/address.store";
  import { timestampService } from "$lib/utils/date-time";

  let feed: Array<Post> = [];
  let following: Array<Post> = [];
  let isLoadingFeed = true;
  let isLoadingFollowing = false;
  let isLoadingMore = false;
  let lastLoadedTimestamp: number | null = null;
  let scrollContainer: HTMLElement | null = null;

  postService.subscribe(async (posts) => {
    feed = posts.values().toArray();
    // console.log("feed",feed);
  });

  async function fetchFeedEvents() {
    isLoadingFeed = true;

    try {
      const now = new Date();
      const since = timestampService.subtract(new Date(), 10, "days").getTime();
      const until = now.getTime();
      
      if (feed.length === 0) {
        feed = await hubService.fetchPost(since, until);
        lastLoadedTimestamp = since;
      } else {
        setTimeout(async () => {
          const latestPostTimestamp = feed[0].timestamp;
          const newPosts = await hubService.fetchPost(since, latestPostTimestamp);
          // Filter out duplicates based on post ID
          const existingIds = new Set(feed.map(post => post.id));
          const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
          feed = [...uniqueNewPosts, ...feed];
        }, 5000);
      }
    } catch (error) {
      console.error("Error fetching feed events:", error);
    } finally {
      isLoadingFeed = false;
    }
  }

  async function fetchFollowingEvents() {
    if (!$addressStore.address) return;
    isLoadingFollowing = true;
    
    try {
      //console.log("will get feed");
      let profile = await profileService.get($addressStore.address);
      following = await hubService.fetchPostWithAuthors(profile.followList);
      //console.log(posts);
    } catch (error) {
      //console.error("Error fetching feed events:", error);
    } finally {
      //isFetchingAlready = false;
      isLoadingFollowing = false;
    }
  }

  async function loadMorePosts() {
    if (isLoadingMore || !lastLoadedTimestamp) return;
    
    isLoadingMore = true;
    console.log("Loading more posts...");
    
    try {
      const until = lastLoadedTimestamp;
      const since = timestampService.subtract(new Date(until), 10, "days").getTime();
      
      const olderPosts = await hubService.fetchPost(since, until);
      if (olderPosts.length > 0) {
        // Filter out duplicates based on post ID
        const existingIds = new Set(feed.map(post => post.id));
        const uniqueOlderPosts = olderPosts.filter(post => !existingIds.has(post.id));
        
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
  }

  function handleScroll() {
    // Get the correct scrollable container
    if (!scrollContainer) return;
    
    const scrollPosition = scrollContainer.scrollTop + scrollContainer.clientHeight;
    const scrollHeight = scrollContainer.scrollHeight;
    const threshold = 200; // Increased threshold for better detection
    
    if (scrollHeight - scrollPosition < threshold && !isLoadingMore) {
      console.log("Scroll threshold reached!", scrollHeight - scrollPosition);
      loadMorePosts();
    }
  }

  onMount(() => {
    scrollContainer = document.querySelector('.scrollbar-hidden');
    
    if (scrollContainer) {
      console.log("Found scroll container, attaching event listener");
      scrollContainer.addEventListener('scroll', handleScroll);
      
      // Initialize feed
      fetchFeedEvents();
    } else {
      console.error("Could not find scrollable container with class .scrollbar-hidden");
    }
  });

  onDestroy(() => {
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', handleScroll);
    }
  });
</script>

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
        {#if isLoadingFeed && feed.length === 0}
          <div class="flex justify-center items-center py-16">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
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
                  <div class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
                    <span class="sr-only">Loading more...</span>
                  </div>
                  <span class="ml-3 text-muted-foreground">Loading more posts...</span>
                </div>
              {/if}
            </div>
            
            <!-- Sentinel element for intersection observer alternative -->
            <div id="scroll-sentinel" class="h-4"></div>
          </div>
        {/if}
      </Tabs.Content>

      <Tabs.Content value="following">
        {#if isLoadingFollowing}
          <div class="flex justify-center items-center py-16">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <span class="ml-3 text-muted-foreground">Loading following...</span>
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
<script lang="ts">
  import PostComponent from "$lib/components/posts/Post.svelte";
  import type { Post } from "$lib/models/Post";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { onMount } from "svelte";
  import { postService } from "$lib/services/PostService";
  import { profileService } from "$lib/services/ProfileService";
  import { addressStore } from "$lib/stores/address.store";
  import { timestampService } from "$lib/utils/date-time";

  let feed: Array<Post> = [];
  let following: Array<Post> = [];
  let isLoadingFeed = true;
  let isLoadingFollowing = false;

  async function fetchFeedEvents() {
    //if (isFetchingAlready || !$currentUser) return;
    isLoadingFeed = true;

    try {
      let now = new Date(Date.now());
      let since = timestampService.subtract(now, 7, "day");
      console.log("since",since)
      if(feed.length == 0){
        feed = await postService.fetchPost(0, 10000);
        console.log("feed 0",feed)
      }
      else{
        feed = await postService.fetchPost(feed[feed.length - 1].timestamp, 10);
        console.log("feed",feed)
      }
      //console.log(posts);
    } catch (error) {
      //console.error("Error fetching feed events:", error);
    } finally {
      //isFetchingAlready = false;
      isLoadingFeed = false;
    }
  }

  async function fetchFollowingEvents() {
    if (!$addressStore.address) return;
    isLoadingFollowing = true;
    
    try {
      //console.log("will get feed");
      let profile = await profileService.get($addressStore.address);
      following = await postService.fetchPostWithAuthors(profile.followList);
      //console.log(posts);
    } catch (error) {
      //console.error("Error fetching feed events:", error);
    } finally {
      //isFetchingAlready = false;
      isLoadingFollowing = false;
    }
  }

  let container;
  function handleScroll(event: Event) {
    //const target = event.target as HTMLDivElement;
    //const threshold = 100; // pixels from bottom to trigger load
    //console.log("we are scrolling");
    /*if (
      target.scrollHeight - (target.scrollTop + target.clientHeight) 
        threshold &&
      !loading &&
      hasMore
    ) {
      if (
        profiles.length == ITEMS_PER_PAGE &&
        profiles[profiles.length - 1].created_at != since
      ) {
        since = profiles[profiles.length - 1].created_at;
        loadMoreProfiles();
      }
    }*/
  }

  // Initialize feed
  onMount(async () => {
    fetchFeedEvents();
  });

  // Handle new post notifications
  /*notifyNewPostStore.subscribe(async (value) => {
    if (value) {
      await fetchFeedEvents();
      // Reset the notification store
      notifyNewPostStore.set(0);
    }
  });*/
</script>

<div class="relative">
  <div bind:this={container} on:scroll={handleScroll}>
    <div class="md:mt-10 mt-5 max-w-prose w-full">
      <Tabs.Root value="for you" class="max-w-prose">
        <Tabs.List class="grid grid-cols-2 md:mx-0 mx-4 ">
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
          {#if isLoadingFeed}
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
                <div class="border border-border max-w-prose">
                  <PostComponent {post} />
                </div>
              {/each}
            </div>
          {/if}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
</div>
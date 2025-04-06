<script lang="ts">
  import PostComponent from "$lib/components/posts/Post.svelte";
  import type { Post } from "$lib/models/Post";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { onMount } from "svelte";
  import { hubService } from "$lib/services/HubService";
  import { profileService } from "$lib/services/ProfileService";
  import { addressStore } from "$lib/stores/address.store";
  import { timestampService } from "$lib/utils/date-time";

  let feed: Array<Post> = [];
  let following: Array<Post> = [];
  let isLoadingFeed = true;
  let isLoadingFollowing = false;
  let hubId: string = "";

  hubService.subscribe(async (posts) => {
    // feed = posts.values().toArray();
  });

  async function fetchFeedEvents() {
    isLoadingFeed = true;

    try {
      const now = new Date();
      const since = timestampService.subtract(new Date(), 10, "days").getTime();
      const until = now.getTime();
      feed = await hubService.fetchPost(hubId, since, until);
      console.log("Feed posts loaded:", feed.length);
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
      let profile = await profileService.get($addressStore.address);
      // following = await hubService.fetchPostWithAuthors($currentHubId, profile.followList);
    } catch (error) {
      console.error("Error fetching following events:", error);
    } finally {
      isLoadingFollowing = false;
    }
  }

  onMount(async () => {
    if ($addressStore.address) {
      const profile = await profileService.get($addressStore.address);
      hubId = profile.hubId;
      console.log('Hub ID from feed:', hubId);
      fetchFeedEvents();
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
<script lang="ts">
  import Post from "$lib/components/posts/Post.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { onMount } from "svelte";
  import { fetchEvents } from "$lib/ao/relay";
  import { currentUser } from "$lib/stores/current-user.store";
  import { notifyNewPostStore } from "$lib/stores/notify-new-post.store";

  let events: Array<any> = [];
  let filters: Array<any> = [];
  let isFetchingAlready = false;

  function processEvents(rawEvents: any) {
    const postMap = new Map();
    const topLevelPosts: any = [];

    //@ts-ignore
    rawEvents.forEach((event) => {
      // Create a new object to avoid reference issues
      postMap.set(event.Id, { ...event, replies: [] });
    });

    // Second pass: Organize posts and replies
    //@ts-ignore
    rawEvents.forEach((event) => {
      if (event.Tags["marker"] === "reply") {
        const parentId = event.Tags["e"];
        const parent = postMap.get(parentId);
        if (parent) {
          parent.replies.push(postMap.get(event.Id));
        } else {
          // If parent not found, treat as top-level post
          topLevelPosts.push(postMap.get(event.Id));
        }
      } else if (event.Tags["marker"] === "root" || !event.Tags["marker"]) {
        topLevelPosts.push(postMap.get(event.Id));
      }
    });

    // Sort posts by timestamp, newest first
    //@ts-ignore
    return topLevelPosts.sort((a, b) => b.Timestamp - a.Timestamp);
  }

  async function fetchFeedEvents() {
    if (isFetchingAlready || !$currentUser) return;

    try {
      isFetchingAlready = true;

      const filter = {
        kinds: ["1", "6"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        tags: { marker: ["root"] },
      };

      const _filters = JSON.stringify([filter]);
      const _events = await fetchEvents(_filters);

      // Process and update events
      events = processEvents(_events);
      console.log("Updated events:", events);
    } catch (error) {
      console.error("Error fetching feed events:", error);
    } finally {
      isFetchingAlready = false;
    }
  }

  async function fetchFollowingEvents() {
    if (!$currentUser?.followList) return;

    try {
      const filter = {
        kinds: ["1", "6"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        tags: { marker: ["root"] },
        // authors: $currentUser.followList,
      };

      const _filters = JSON.stringify([filter]);
      const _events = await fetchEvents(_filters);
      events = processEvents(_events);
    } catch (error) {
      console.error("Error fetching following events:", error);
    }
  }

  function handleNewReply(event: any) {
    const newReply = event.detail;
    // Process events including the new reply
    events = processEvents([...events.flat(), newReply]);
  }

  // Initialize feed
  onMount(async () => {
    await fetchFeedEvents();
  });

  // Handle new post notifications
  notifyNewPostStore.subscribe(async (value) => {
    if (value) {
      await fetchFeedEvents();
      // Reset the notification store
      notifyNewPostStore.set(0);
    }
  });
</script>

{#if $currentUser}
  <div class="flex justify-center max-w-[653px] w-full mb-10">
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
          <div>
            {#each events as event (event.Id)}
              <div class="border border-border max-w-prose">
                <Post
                  {event}
                  replies={event.replies}
                  on:newReply={handleNewReply}
                />
              </div>
            {/each}
          </div>
        </Tabs.Content>

        <Tabs.Content value="following">
          <div>
            {#each events as event (event.Id)}
              <div class="border border-border max-w-prose">
                <Post
                  {event}
                  replies={event.replies}
                  on:newReply={handleNewReply}
                />
              </div>
            {/each}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
{/if}

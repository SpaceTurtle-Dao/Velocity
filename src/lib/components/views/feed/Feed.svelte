<script lang="ts">
  import Post from "$lib/components/posts/Post.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { onMount } from "svelte";
  import { fetchEvents } from "$lib/ao/relay";
  import { currentUser } from "$lib/stores/current-user.store";
  import { notifyNewPostStore } from "$lib/stores/notify-new-post.store";

  let events: Array<any> = [];
  let filters: Array<any> = [];
  let followers: Array<String> = ["exampleFollower1", "exampleFollower2"]; // Example followers

  function processEvents(rawEvents: any) {
    const postMap = new Map();
    const topLevelPosts: any = [];

    //@ts-ignore
    rawEvents.forEach((event) => {
      postMap.set(event.Id, { ...event, replies: [] });
    });

    //@ts-ignore
    rawEvents.forEach((event) => {
      if (event.Tags["marker"] === "reply") {
        const parentId = event.Tags["e"];
        const parent = postMap.get(parentId);
        if (parent) {
          parent.replies.push(postMap.get(event.Id));
        } else {
          topLevelPosts.push(postMap.get(event.Id));
        }
      } else if (event.Tags["marker"] === "root" || !event.Tags["marker"]) {
        topLevelPosts.push(postMap.get(event.Id));
      }
    });
    //@ts-ignore
    return topLevelPosts;
  }

  async function fetchFollowingEvents() {
    if ($currentUser) {
      let filter = {
        kinds: ["1", "6"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        tags: { marker: ["root"] },
        authors: $currentUser.followList,
      };
      filters.push(filter);
      let _filters = JSON.stringify(filters);
      if ($currentUser) {
        let _events = await fetchEvents(_filters);
        events = processEvents(_events);
      }
    }
    filters = [];
  }

  let isFetchingAlready = false;
  async function fetchFeedEvents() {
    // To avoid double calling of fetchFeedEvents
    if (isFetchingAlready) return;

    isFetchingAlready = true;
    if ($currentUser) {
      let filter = {
        kinds: ["1", "6"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        tags: { marker: ["root"] },
        // authors: [$currentUser.address],
      };
      filters.push(filter);
      let _filters = JSON.stringify(filters);
      if ($currentUser) {
        let _events = await fetchEvents(_filters);
        events = processEvents(_events);
        console.log("Events-1", events);
      }
    }
    filters = [];

    isFetchingAlready = false;
  }

  onMount(async () => {
    await fetchFeedEvents();
  });

  function handleNewReply(event: any) {
    const newReply = event.detail;
    events = processEvents([...events.flat(), newReply]);
  }

  // This will be called when a new post is created (works as a notifier)
  notifyNewPostStore.subscribe((value) => {
    if (value) {
      fetchFeedEvents();
    }
  });
</script>

{#if $currentUser}
  <div class="mt-10 max-w-prose">
    <Tabs.Root value="for you" class="max-w-prose">
      <Tabs.List class="grid grid-cols-2">
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
        <div class="">
          {#each events as event}
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
        <div class="">
          {#each events as event}
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
{/if}

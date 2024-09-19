<script lang="ts">
  import { eventStore } from "../../stores/events.store"; // Import the store
  import Tweet from "./TweetVideoNip.svelte";
  import Repost from "./Repost.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import type { Event } from "$lib/models/Event"; 
  import { onMount } from "svelte";

  let events: Event[] = [];
  let loading = false;

  // Subscribe to the store to pull events and loading state
  eventStore.subscribe(store => {
    events = store.events;
    loading = store.loading;
  });

  // Optionally, if you want to simulate adding new events on mount
  onMount(() => {
    // Any additional logic on mount can go here
  });


</script>

<div class="max-w-4xl mx-auto p-4 bg-background-500">
  {#if loading}
    <div>
      <Spinner />
    </div>
  {:else}
    <div class="space-y-6">
      {#each events as event (event.id)}
      {#if event.kind === 6}
        <Repost {event} />``
      {:else if event.kind === 1}
        <Tweet {event} />
      {/if}
      {/each}
    </div>
  {/if}
</div>

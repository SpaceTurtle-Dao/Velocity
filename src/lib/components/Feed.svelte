<script lang="ts">
  import { eventStore } from "../stores/events.store"; // Import the store
  import Tweet from "./TweetVideoNip.svelte";
  import Repost from "./Repost.svelte";
  // import Spinner from "$lib/components/Spinner.svelte";
  import type { Event } from "$lib/models/Event"; 
  import { onMount } from "svelte";

  import Post from "$lib/components/PostMedia.svelte";
// =======
//   import Post from "$lib/components/Post.svelte";
//   import { fetchMemes } from "$lib/ao/relay";
//   import type { Meme } from "$lib/models/Meme";
// >>>>>>> development
  import Spinner from "$lib/components/Spinner.svelte";
  // import type { Event } from "$lib/models/Event"; // Define your Event model here or import it

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
        <Tweet {event} />
      {/each}
    </div>
  {/if}
</div>

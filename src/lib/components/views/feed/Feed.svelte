<script lang="ts">
  import { onMount } from "svelte";

  import Tweet from "$lib/components/views/feed/Tweet.svelte";
  import Spinner from "$lib/components/views/xyz/Spinner.svelte";
  import type { Event } from "../../../models/Event"; // Define your Event model here or import it
  let events: Event[] = [];
  let loading = true;

  // Simulating the fetchEvents function with dummy data
  async function fetchEvents(): Promise<Event[]> {
    return [
      {
        id: "8f4e867bcf2c4a63944c2c04bbd28be3",
        pubkey: "a3b35fe237529f80798e4a5c4f6d12be",
        created_at: 1684312352,
        kind: 34235,
        content: "Check out this cool video about Svelte!",
        tags: [
          ["title", "Svelte Introduction"],
          [
            "thumb",
            "https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY",
          ],
          ["published_at", "1684312352"],
          [
            "url",
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          ],
          ["m", "video/mp4"],
          ["size", "1048576"],
          ["duration", "180"],
          ["dim", "1280x720"],
        ],
      },
      {
        id: "9f8e762bc2d4b859443e1a05bbd29cf4",
        pubkey: "b3c45ae138739f80897f5b6d5e7e24cf",
        created_at: 1685312452,
        kind: 34236,
        content: "A deep dive into web development trends.",
        tags: [
          ["title", "Web Development Trends 2024"],
          [
            "thumb",
            "https://arweave.net/Ive8YUyCU0FQEBSc8UjfTlQYFZY5s8t45gqsNf3uJMw",
          ],
          ["published_at", "1685312452"],
          [
            "url",
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          ],
          ["m", "video/mp4"],
          ["size", "2097152"],
          ["duration", "240"],
          ["dim", "1920x1080"],
        ],
      },
    ];
  }

  // Fetching the events when the component mounts
  onMount(async () => {
    try {
      events = await fetchEvents();
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      loading = false;
    }
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
        <Post {event} />
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Add custom styles here if needed */
</style>

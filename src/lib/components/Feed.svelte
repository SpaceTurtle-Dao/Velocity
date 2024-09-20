<script lang="ts">
  import { onMount } from "svelte";

  import Post from "$lib/components/PostMedia.svelte";
// =======
//   import Post from "$lib/components/Post.svelte";
//   import { fetchMemes } from "$lib/ao/relay";
//   import type { Meme } from "$lib/models/Meme";
// >>>>>>> development
  import Spinner from "$lib/components/Spinner.svelte";
  import type { Event } from "$lib/models/Event"; // Define your Event model here or import it

  import { Card, CardContent, CardFooter, CardHeader } from "$lib/components/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { Heart, MessageCircle, Repeat } from 'lucide-svelte';

  let events: Event[] = [];
  let loading = true;

  // Simulating the fetchEvents function with dummy data
  async function fetchEvents(): Promise<Array<Event>> {
    return [
      {
        id: "1",
        pubkey: "pubkey1",
        created_at: 1684312352,
        kind: 1,
        tags: [
          ["title", "Just created a new meme!"],
          ["image", "https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY"],
          ["author", "Charazard"],
          ["handle", "@vd97vAnBhKD7"],
          ["avatar", "https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY"],
        ],
        content: "Just created a new meme! Check it out! #MemeMarket",
      },
      {
        id: "2",
        pubkey: "pubkey2",
        created_at: 1684312353,
        kind: 1,
        tags: [
          ["title", "Another day, another meme"],
          ["image", "https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY"],
          ["author", "MemeQueen"],
          ["handle", "@memeQueen123"],
          ["avatar", "https://arweave.net/Ov0Xea2kWa5GS1DCEmeF0aoct8rbJwDmizmTo9bQrtY"],
        ],
        content: "Another day, another meme. Who's ready to laugh?",
      }
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

  function getTagValue(event: Event, key: string): string {
    const tag = event.tags.find(tag => tag[0] === key);
    return tag ? tag[1] : '';
  }
</script>

<div class="max-w-4xl mx-auto p-4 bg-background-500">
  {#if loading}
    <div>
      <Spinner />
    </div>
  {:else}
    <div class="space-y-6">
      {#each events as event (event.id)}
        <!--<Post {event} />-->
      {/each}
    </div>
  {/if}
</div>
<script lang="ts">
    import { getTagValue } from "./utils"; // Helper to get tag values
    import { eventStore } from "../../stores/events.store"; // Import the store
    import Tweet from "$lib/components/TweetVideoNip.svelte";
    import { onMount } from "svelte";
    import { formatTime } from "./utils"; // Import the formatTime function
    import type { Event } from "$lib/models/Event";
  import { Repeat } from "lucide-svelte";
  import { Card } from "flowbite-svelte";
  import { CardContent, CardHeader } from "./ui/card";

    export let event: Event;

    let originalEvent: Event | null = null;

    // Find the original post from the store using its ID
    onMount(() => {
        const originalId = getTagValue(event.tags, "e");
        eventStore.subscribe(store => {
            originalEvent = store.events.find(e => e.id === originalId) || null;
        });
    });
</script>

<Card class="overflow-hidden transition-all duration-300 hover:shadow-lg w-full border-none rounded-s bg-background-600">
    <CardHeader class="px-6">
        <div class="flex items-center space-x-4">
            <div>
                <h3 class="text-sm font-bold text-white">
                    {event.pubkey.slice(0, 12)}
                </h3>
                <p class="text-sm text-gray-500">
                    @{event.pubkey.slice(0, 12)} · {formatTime(event.created_at)}
                </p>
                <div class="flex items-center text-gray-400 mt-1">
                    <Repeat class="w-4 h-4 mr-1" />
                    <span>Reposted</span>
                </div>
            </div>
        </div>
    </CardHeader>

    <CardContent class="px-6">
        {#if originalEvent}
            <Tweet {event} />
        {:else}
            <p class="text-white">Original post not found.</p>
        {/if}
    </CardContent>
</Card>

<script lang="ts">
    import {
        HandCoins
    } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    // import { pump } from "$lib/ao/relay";
    import type { Meme } from "$lib/models/Meme";
    import { DEFAULT_QUANTITY } from "$lib/constants";
    import type { Event }  from "../../stores/events.store";

    export let meme: Meme;
    export let event: Event;

    async function _dump() {
        // await pump(DEFAULT_QUANTITY, "0", meme.Pool, meme.TokenA);
    console.log("Dumping", event);

    }
</script>

<Button size="sm" class="bg-blue-500 text-white" on:click={_dump}>
    <HandCoins class="w-4 h-4 mr-2" />
    Dump
</Button>

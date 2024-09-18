<script lang="ts">
    import {
        Rocket,
    } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { pump } from "$lib/ao/relay";
    import type { Meme } from "$lib/models/Meme";
    import { DEFAULT_QUANTITY } from "$lib/common/constants";

    export let meme: Meme;

    async function _pump() {
        await pump(DEFAULT_QUANTITY, "0", meme.Pool, meme.TokenB);
    }
</script>

<Button size="sm" class="bg-pink-500 text-white" on:click={_pump}>
    <Rocket class="w-4 h-4 mr-2" />
    Pump
</Button>

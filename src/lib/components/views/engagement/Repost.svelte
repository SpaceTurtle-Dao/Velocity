<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Repeat2 } from "lucide-svelte";
    import { onMount } from "svelte";

    let reposted = false;
    let count = 0

    function repost() {
        reposted = !reposted
    }
</script>

<Button
    variant="ghost"
    size="icon"
    class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    on:click={repost}
>
    {#if reposted}
        <Repeat2 strokeWidth={0.8} class="text-green-400" />
        <p class="font-thin text-green-400">{count}</p>
    {:else}
        <Repeat2 strokeWidth={0.8} class="text-primary"/>
        <p class="font-thin">{count}</p>
    {/if}
</Button>

<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Heart } from "lucide-svelte";
    import { onMount } from "svelte";

    let liked = false;
    let count = 0

    function like() {
        liked = !liked
    }
</script>

<Button
    variant="ghost"
    size="icon"
    class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    on:click={like}
>
    {#if liked}
        <Heart strokeWidth={0} class="fill-red-400" />
        <p class="font-thin text-red-400">{count}</p>
    {:else}
        <Heart strokeWidth={0.8} class="text-primary"/>
        <p class="font-thin">{count}</p>
    {/if}
</Button>


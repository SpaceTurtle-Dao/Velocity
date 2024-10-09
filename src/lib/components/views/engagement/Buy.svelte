<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { HandCoins } from "lucide-svelte";
    import { onMount } from "svelte";

    let count = 0;

    function buy() {}
</script>

<Button
    size="icon"
    class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    on:click={buy}
>
    <HandCoins strokeWidth={0.8} class="text-primary" />
    <p class="font-thin">{count}</p>
</Button>

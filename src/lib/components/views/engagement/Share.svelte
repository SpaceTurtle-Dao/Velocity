<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Share } from "lucide-svelte";
    import { onMount } from "svelte";

    function share() {
        
    }
</script>

<Button
    variant="ghost"
    size="icon"
    class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    on:click={share}
>
    <Share strokeWidth={0.8} class="text-primary" />
</Button>

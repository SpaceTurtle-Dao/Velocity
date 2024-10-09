<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { MessageCircle } from "lucide-svelte";
    import { onMount } from "svelte";

    let count = 0;

    function reply() {}
</script>

<Button
    variant="ghost"
    size="icon"
    class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    on:click={reply}
>
    <MessageCircle strokeWidth={0.8} class="text-primary" />
    <p class="font-thin">{count}</p>
</Button>

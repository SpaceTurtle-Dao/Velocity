<script lang="ts">
    // import { isSubscribed, subscribe, unsubscribe } from "$lib/ao/relay";
    import { Rocket } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { onMount } from "svelte";

    export let relay: string;
    export let userRelay: string;
    let isLoading = false;
    let _isSubscribed: boolean = false;

    onMount(async () => {
        // _isSubscribed = await isSubscribed(userRelay, relay);
    });

    async function _subscribe() {
        isLoading = true
        try {
            // await subscribe(userRelay, relay);
            _isSubscribed = !_isSubscribed
        } catch (e) {}
        isLoading = false
    }

    async function _unsubscribe() {
        isLoading = true
        try {
            // await unsubscribe(userRelay, relay);
            _isSubscribed = !_isSubscribed
        } catch (e) {}
        isLoading = false
    }
</script>

{#if _isSubscribed}
    <Button variant="outline" disabled={isLoading} size="sm" class="text-primary rounded" on:click={_unsubscribe}>
        Unsubscribe
    </Button>
{:else if _isSubscribed == false}
    <Button variant="outline" disabled={isLoading} size="sm" class="text-primary rounded" on:click={_subscribe}>
        Subscribe
    </Button>
{/if}

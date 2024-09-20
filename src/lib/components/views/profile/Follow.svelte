<script lang="ts">
    import { isSubscribed, subscribe, unsubscribe } from "$lib/ao/relay";
    import { Rocket } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { onMount } from "svelte";

    export let relay: string;
    export let userRelay: string;
    export let token: string;
    export let quantity: string;
    let _isSubscribed: boolean;

    onMount(async () => {
        _isSubscribed = await isSubscribed(userRelay, relay);
    });

    async function _subscribe() {
        try {
            await subscribe(token, quantity, userRelay, relay);
            _isSubscribed = !_isSubscribed
        } catch (e) {}
    }

    async function _unsubscribe() {
        try {
            await unsubscribe(userRelay, relay);
            _isSubscribed = !_isSubscribed
        } catch (e) {}
    }
</script>

{#if _isSubscribed}
    <Button size="sm" class="bg-pink-500 text-white" on:click={_unsubscribe}>
        Unsubscribe
    </Button>
{:else if _isSubscribed == false}
    <Button size="sm" class="bg-pink-500 text-white" on:click={_subscribe}>
        Subscribe
    </Button>
{/if}

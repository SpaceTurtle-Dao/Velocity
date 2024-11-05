<script lang="ts">
    import { isSubscribed, subscribe, unsubscribe } from "$lib/ao/relay";
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
    import { currentUser } from "$lib/stores/profile.store";
    import { onMount } from "svelte";

    export let targetProcess: string;
    export let isUserSubscribed: boolean;
    let loader = false;

    let isSubLoading = true;
    async function loadIsSubscribed() {
        isUserSubscribed = await isSubscribed(
            $currentUser.Process,
            targetProcess,
        );
    }

    onMount(async () => {
        await loadIsSubscribed();
        isSubLoading = false;
    });

    async function subscribeTarget() {
        loader = true;

        try {
            await subscribe($currentUser.Process, targetProcess);

            isUserSubscribed = true;
        } catch (error) {
            console.error(error);
        } finally {
            loader = false;
        }
    }

    async function unsubscribeTarget() {
        loader = true;

        try {
            await unsubscribe($currentUser.Process, targetProcess);

            isUserSubscribed = false;
        } catch (error) {
            console.error(error);
        } finally {
            loader = false;
        }
    }
</script>

{#if isSubLoading}
    <div class="h-8 w-[120px] bg-muted rounded-full animate-pulse"></div>
{:else if isUserSubscribed}
    <ButtonWithLoader
        {loader}
        class="group text-sm font-bold h-8 w-[120px]  rounded-full text-primary  hover:border-red-800 border-input bg-background hover:bg-accent hover:text-accent-foreground border"
        on:click={unsubscribeTarget}
        disabled={loader}
    >
        <span class="group-hover:hidden">Subscribed</span>
        <span class="hidden group-hover:block text-red-500">Unsubscribe </span>
    </ButtonWithLoader>
{:else}
    <ButtonWithLoader
        {loader}
        class="group text-sm font-bold h-8 w-[102px] rounded-full"
        on:click={subscribeTarget}
        disabled={loader}
        >Subscribe
    </ButtonWithLoader>
{/if}

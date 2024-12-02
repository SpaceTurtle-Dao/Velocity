<script lang="ts">
    import { fetchFollowList, event } from "$lib/ao/relay";
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
    import type { Tag } from "$lib/models/Tag";
    import { currentUser } from "$lib/stores/profile.store";
    import { onMount } from "svelte";

    export let targetProcess: string;
    export let isUserSubscribed: boolean;
    let loader = false;

    let isSubLoading = true;
    async function loadIsSubscribed() {
        let followList = await fetchFollowList($currentUser.address)
        isUserSubscribed = followList.includes(targetProcess)
    }

    onMount(async () => {
        await loadIsSubscribed();
        isSubLoading = false;
    });

    async function subscribeTarget() {
        loader = true;

        try {
            let followList = await fetchFollowList($currentUser.address)
            followList.push(targetProcess)
            let kind: Tag = {
                name: "Kind",
                value: "3",
            };
            let pTag: Tag = {
                name: "p",
                value: JSON.stringify(followList),
            };
            let _tags: Array<Tag> = [kind, pTag];
            await event(_tags);

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
            let followList = await fetchFollowList($currentUser.address)
            followList.filter(p => p != targetProcess)
            let kind: Tag = {
                name: "Kind",
                value: "3",
            };
            let pTag: Tag = {
                name: "p",
                value: JSON.stringify(followList),
            };
            let _tags: Array<Tag> = [kind, pTag];
            await event(_tags);

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

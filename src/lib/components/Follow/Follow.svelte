<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { onMount } from "svelte";
    import { fetchFollowList } from "$lib/ao/relay";
    import { currentUser } from "$lib/stores/current-user.store";
    import type { Tag } from "$lib/models/Tag";
    import { event } from "$lib/ao/relay";

    let isLoading = false;
    let _isSubscribed: boolean = false;
    export let address:string;

    onMount(async () => {
        let followList = await fetchFollowList($currentUser.address)
        _isSubscribed = followList.includes(address)
    });

    async function _subscribe() {
        isLoading = true
        try {
            let followList = await fetchFollowList($currentUser.address)
            followList.push(address)
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
            _isSubscribed = !_isSubscribed
        } catch (e) {}
        isLoading = false
    }

    async function _unsubscribe() {
        isLoading = true
        try {
            let followList = await fetchFollowList($currentUser.address)
            followList.filter(p => p != address)
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
            _isSubscribed = !_isSubscribed
        } catch (e) {}
        isLoading = false
    }
</script>

{#if _isSubscribed}
    <Button
        variant="outline"
        disabled={isLoading}
        size="sm"
        class="text-primary rounded"
        on:click={_unsubscribe}
    >
        Unsubscribe
    </Button>
{:else if _isSubscribed == false}
    <Button
        variant="outline"
        disabled={isLoading}
        size="sm"
        class="text-primary rounded"
        on:click={_subscribe}
    >
        Subscribe
    </Button>
{/if}

<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import type { Tag } from "$lib/models/Tag";
    import { Heart } from "lucide-svelte";
    import { onMount } from "svelte";
    import { event, fetchEvents } from "$lib/ao/relay";
    import { currentUser, userEvents } from "$lib/stores/profile.store";

    export let id: string;
    export let pubkey: string;

    let liked = false;
    let count = 0;
    let _tags: Array<Tag> = [];

    let kind: Tag = {
        name: "Kind",
        value: "7",
    };

    async function like() {
        let contentTag: Tag = {
            name: "Content",
            value: "+",
        };
        let eventTag: Tag = {
            name: "e",
            value: id,
        };
        let pubkeyTag: Tag = {
            name: "p",
            value: pubkey,
        };
        _tags.push(kind);
        _tags.push(contentTag);
        _tags.push(eventTag);
        _tags.push(pubkeyTag);
        liked = !liked;
        await event(_tags, pubkey);
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
        <Heart strokeWidth={0.8} class="text-primary" />
        <p class="font-thin">{count}</p>
    {/if}
</Button>

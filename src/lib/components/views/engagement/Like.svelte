<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import type { Tag } from "$lib/models/Tag";
    import { Heart } from "lucide-svelte";
    import { onMount } from "svelte";
    import { _fetchEvents, event, fetchEvents } from "$lib/ao/relay";
    import { currentUser, userEvents } from "$lib/stores/profile.store";

    export let _event: any;

    let liked = false;
    let likes: Array<any> = [];
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
            value: JSON.stringify([_event.Id]),
        };
        let pubkeyTag: Tag = {
            name: "p",
            value: JSON.stringify([_event.From]),
        };
        _tags.push(kind);
        _tags.push(contentTag);
        _tags.push(eventTag);
        _tags.push(pubkeyTag);
        liked = !liked;
        await event(_tags, _event.From);
        await fetchLikes()
    }

    async function fetchLikes() {
        let filters: Array<any> = [];
        likes = [];
        let filter = {
            kinds: ["7"],
            //since: Number(timestamp),
            //until: Date.now(),
            //limit: 100,
            tags: {
                e: [_event.Id]
            },
        };
        filters.push(filter);
        let _filters = JSON.stringify(filters);
        likes = await _fetchEvents(_event.From, _filters);
        for(var i=0; i < likes.length; i++){
            if(likes[i].From == $currentUser.Process){
                liked = true
            }
        }
        filters = [];
    }

    onMount(async () => {
        console.log($currentUser.Process)
        console.log("getting likes for id");
        console.log(_event.Id)
        await fetchLikes()
        console.log("got "+likes.length+" likes for id");
        console.log(_event.Id)
        console.log(likes);
    });
</script>

<Button
    variant="ghost"
    size="icon"
    class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    on:click={like}
>
    {#if liked}
        <Heart strokeWidth={0} class="fill-red-400" />
        <p class="font-thin text-red-400">{likes.length}</p>
    {:else}
        <Heart strokeWidth={0.8} class="text-primary hover:fill-red-400 hover:text-red-400" />
        <p class="font-thin">{likes.length}</p>
    {/if}
</Button>

<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import type { Tag } from "$lib/models/Tag";
    import { Heart } from "lucide-svelte";
    import { onMount } from "svelte";
    import { fetchEvents, event } from "$lib/ao/relay";
    import { currentUser } from "$lib/stores/current-user.store";
    import type { Post } from "$lib/models/Post";
    import { hubService } from "$lib/services/HubService";
    import { addressStore } from "$lib/stores/address.store";

    export let post: Post;

    let liked = false;
    let likes: Array<any> = [];

    let kind: Tag = {
        name: "Kind",
        value: "7",
    };

    async function like() {
        let _tags: Array<Tag> = [];

        let contentTag: Tag = {
            name: "Content",
            value: "+",
        };
        let eventTag: Tag = {
            name: "e",
            value: post.id,
        };
        let pubkeyTag: Tag = {
            name: "p",
            value: post.from,
        };
        _tags.push(kind);
        _tags.push(contentTag);
        _tags.push(eventTag);
        _tags.push(pubkeyTag);
        if (liked) {
            let temp = likes.filter((like) => {
                return like.From != $addressStore.address;
            });
            likes = temp;
            liked = false;
        } else {
            let temp = likes;
            temp.push({});
            likes = temp;
            liked = true;
        }
        await event(_tags);
        hubService.fetchLikes(post.id).then((_likes) => {
            likes = _likes;
            let temp = likes.filter((like) => {
                return like.From == $addressStore.address;
            });
            liked = temp.length > 0;
        });
    }

    onMount(async () => {
        hubService.fetchLikes(post.id).then((_likes) => {
            likes = _likes;
            let temp = likes.filter((like) => {
                return like.From == $addressStore.address;
            });
            liked = temp.length > 0;
        });
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
        <Heart
            strokeWidth={0.8}
            class="text-primary hover:fill-red-400 hover:text-red-400"
        />
        <p class="font-thin">{likes.length}</p>
    {/if}
</Button>

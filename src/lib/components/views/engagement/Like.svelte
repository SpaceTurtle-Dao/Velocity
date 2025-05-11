<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import type { Tag } from "$lib/models/Tag";
    import { Heart } from "lucide-svelte";
    import { onMount } from "svelte";
    import { event } from "$lib/ao/relay";
    import type { Post } from "$lib/models/Post";
    import { hubService } from "$lib/services/HubService";
    import { currentUser } from "$lib/services/userService";
    import { profileService } from "$lib/services/ProfileService";
    import { hubRegistryService } from "$lib/services/HubRegistryService";
    import { postService } from "$lib/services/PostService";

    export let post: Post;

    let liked = false;
    let likes: Array<any> = [];

    let kind: Tag = {
        name: "Kind",
        value: "7",
    };

    async function like() {
        if(!$currentUser) return
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
            console.log("**Likes**");
            let temp = likes.filter((like) => {
                console.log(like.From);
                console.log($currentUser.hub?.spec.processId);
                console.log(like);
                return like.From != $currentUser.hub?.spec.processId;
            });
            likes = temp;
            liked = false;
        } else {
            let temp = likes;
            temp.push({});
            likes = temp;
            liked = true;
        }
        await event(post.from, _tags);
        postService.fetchLikes(post.from, post.id).then((_likes) => {
            likes = _likes;
            console.log("**Likes**");
            let temp = likes.filter((like) => {
                console.log(like.From);
                console.log($currentUser.hub?.spec.processId);
                console.log(like);
                return like.From == $currentUser.hub?.spec.processId;
            });
            liked = temp.length > 0;
        });
    }

    onMount(async () => {
        if (post.from) {
            postService.fetchLikes(post.from, post.id).then((_likes) => {
                likes = _likes;
                console.log("**Likes**");
                let temp = likes.filter((like) => {
                    console.log(like.From);
                    console.log($currentUser?.hub.spec.processId);
                    console.log(like);
                    return like.From == $currentUser?.hub.spec.processId;
                });
                liked = temp.length > 0;
            });
        }
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

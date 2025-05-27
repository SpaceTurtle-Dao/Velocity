<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import type { Tag } from "$lib/models/Tag";
    import { Heart } from "lucide-svelte";
    import { onMount } from "svelte";
    import type { Post } from "$lib/models/Post";
    import { currentUser } from "$lib/services/CurrentUser";
    import { postService } from "$lib/services/postService";

    export let post: Post;

    let liked = false;
    let likes: Array<any> = [];

    let kind: Tag = {
        name: "Kind",
        value: "7",
    };

    async function like() {
        if (!$currentUser) return;
        let _tags: Array<Tag> = [];

        let contentTag: Tag = {
            name: "Content",
            value: "+",
        };
        let eventTag: Tag = {
            name: "e",
            value: post.original_Id,
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
            //console.log("**Likes**");
            let temp = likes.filter((like) => {
                //console.log(like.From);
                //console.log($currentUser.hub?.Spec.processId);
                //console.log(like);
                return like.From != $currentUser.hub?.Spec.processId;
            });
            likes = temp;
            liked = false;
        } else {
            let temp = likes;
            temp.push({});
            likes = temp;
            liked = true;
        }
        await currentUser.createEvent(post.from, _tags, "7");
        postService.fetchLikes(post.from, post.original_Id).then((_likes) => {
            likes = _likes;
            //console.log("**Likes**");
            for (var i = 0; i < likes.length; i++) {
                if (
                    likes[i].From == $currentUser?.address ||
                    likes[i].From == $currentUser?.hub.Spec.processId
                )
                    liked = true;
            }
        });
    }

    onMount(async () => {
        //console.log(post);
        likes = await postService.fetchLikes(post.from, post.original_Id);
        //console.log("**Likes**");
        //console.log(likes);
        for (var i = 0; i < likes.length; i++) {
            if (
                likes[i].From == $currentUser?.address ||
                likes[i].From == $currentUser?.hub.Spec.processId
            )
                liked = true;
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

<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import type { Tag } from "$lib/models/Tag";
  import { Repeat2 } from "lucide-svelte";
  import { onMount } from "svelte";
  import { event } from "$lib/ao/relay";
  import type { Post } from "$lib/models/Post";
  import { hubService } from "$lib/services/HubService";
  import { currentUser } from "$lib/services/CurrentUser";
  import { profileService } from "$lib/services/ProfileService";
    import { postService } from "$lib/services/postService";

  export let post: Post;

  let reposted = false;
  let reposts: Post[] = [];

  async function repost() {
    if (!$currentUser && !post) return;

    let _tags: Array<Tag> = [
      {
        name: "Kind",
        value: "6",
      },
      {
        name: "Content",
        value: JSON.stringify({
          ...post.event,
          repostedBy: !$currentUser?.address,
        }),
      },
      {
        name: "e",
        value: post.original_Id,
      },
      {
        name: "marker",
        value: "repost",
      },
    ];

    await currentUser.createEvent(post.from, _tags,"6");

    // Immediately update local state
    reposted = true;

    // Refresh reposts to ensure consistency
    await postService.fetchRepost(post.from, post.id);
  }

  onMount(async () => {
    if (post.from) {
      /*await postService.fetchRepost(post.from, post.original_Id);
      if($currentUser){
        reposted = reposts.filter((value) => value.from == $currentUser.hub?.Spec.processId).length > 0;
      }*/
    }
  });
</script>

<Button
  variant="ghost"
  size="icon"
  class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
  on:click={repost}
>
  {#if reposted}
    <Repeat2 strokeWidth={0.8} class="text-green-400" />
    <p class="font-thin text-green-400">{reposts.length}</p>
  {:else}
    <Repeat2 strokeWidth={0.8} class="text-primary hover:text-green-400" />
    <p class="font-thin">{reposts.length}</p>
  {/if}
</Button>

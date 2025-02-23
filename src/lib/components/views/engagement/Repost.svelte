<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import type { Tag } from "$lib/models/Tag";
  import { Repeat2 } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fetchEvents, event } from "$lib/ao/relay";
  import { currentUser } from "$lib/stores/current-user.store";
  import type { Post } from "$lib/models/Post";
    import { postService } from "$lib/services/PostService";
    import { addressStore } from "$lib/stores/address.store";

  export let post: Post;

  let reposted = false;
  let reposts: Post [] = [];
  let _tags: Array<Tag> = [];

  let kind: Tag = {
    name: "Kind",
    value: "6",
  };

  async function repost() {
    if (!post) return;

    let _tags: Array<Tag> = [
      {
        name: "Kind",
        value: "6",
      },
      {
        name: "Content",
        value: JSON.stringify({
          ...post.event,
          repostedBy: $currentUser.address,
        }),
      },
      {
        name: "e",
        value: post.id.toString(),
      },
      {
        name: "marker",
        value: "repost",
      },
    ];

    await event(_tags);

    // Immediately update local state
    reposted = true;

    // Refresh reposts to ensure consistency
    reposts = await postService.fetchRepost(post.id);
  }

  onMount(async () => {
    reposts = await postService.fetchRepost(post.id);
    if(!$addressStore.address) return
    reposted = (reposts.filter((value) => value.from == $addressStore.address)).length > 0
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
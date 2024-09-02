<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchMemesByIds, fetchReplies } from "$lib/ao/mememaker";
    import Tweet from "$lib/Tweet.svelte";
    import { Link } from "svelte-routing";
    import { Button } from "$lib/components/ui/ui/button";
    import { replies } from './feedpage.store';

    export let memeId: string;

    let meme;
    let memeReplies: Meme[] = [];

    replies.subscribe((value) => {
        memeReplies = value;
    });

    onMount(async () => {
        try {
            meme = await fetchMemesByIds(memeId);
        } catch (error) {
            console.error('Error fetching original meme:', error);
        }
    });

    onMount(async () => {
        try {
            await fetchReplies(memeId, '1', '100');
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    });

    function openReplyModal() {
        console.log("Reply button clicked!");
    }
</script>
  
<div class="max-w-4xl mx-auto p-4">
    {#if meme}
      <h2 class="text-2xl font-bold mb-4">Original Meme</h2>
      <Link to="/Feed/{meme.Pool}" class="block w-full max-w-3xl mx-auto">
        <Tweet {meme} />
      </Link>
  
      <div class="mt-4 text-right">
        <Button on:click={openReplyModal}>Reply</Button>
      </div>
    {/if}
  
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Replies</h2>
      {#each replies as reply}
        <Link to="/Feed/{reply.Pool}" class="block w-full max-w-3xl mx-auto mb-6">
          <Tweet {reply} />
        </Link>
      {/each}
    </div>
</div>
  
<style>
    :global(body) {
        background-color: #e3f2fd;
    }
</style>
<script lang="ts">
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { fetchMemesByIds, fetchReplies } from "$lib/ao/mememaker";
    import Tweet from "$lib/Tweet.svelte";
    import { Link } from "svelte-routing";
    import { Button } from "$lib/components/ui/ui/button";
    import CreatePost from "$lib/components/CreateMeme.svelte";  // Import CreatePost component
    
    export let memeId: string;
    
    let meme;
    let replies = [];
    let isCreatePostOpen = false;  // State for managing CreatePost modal
    onMount(async () => {
        try {
            meme = await fetchMemesByIds(memeId);
            replies = await fetchReplies(memeId, '1', '100');
            console.log(meme);
            console.log(replies);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });
  
    function openCreatePostModal() {
      isCreatePostOpen = true;
    }
  
    function closeCreatePostModal() {
      isCreatePostOpen = false;
    }
  </script>
  

  <!-- <h1>Hello</h1> -->
  <!-- {#if meme} -->
    <!-- <div class="max-w-4xl mx-auto p-4"> 
      <h2 class="text-2xl font-bold mb-4">Original Meme</h2>
      <Link to="/Feed/{meme.Pool}" class="block w-full max-w-3xl mx-auto">
        <Tweet {meme} />
      </Link>
-->
      <div class="mt-4 text-right">
        <Button on:click={openCreatePostModal}>Reply</Button>
      </div>
    
      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">Replies</h2>
        {#each replies as reply}
          <Link to="/Feed/{reply.Pool}" class="block w-full max-w-3xl mx-auto mb-6">
            <Tweet meme={reply} />
          </Link>
        {/each}
      </div>
    <!-- </div> -->
  <!-- {/if} -->
  
  {#if isCreatePostOpen}
    <CreatePost
      isOpen={isCreatePostOpen}
      parent={meme?.Pool}  
      on:close={() => isCreatePostOpen = false}
    />
  {/if}
  
  <style>
    :global(body) {
      background-color: #e3f2fd;
    }
  </style>
  
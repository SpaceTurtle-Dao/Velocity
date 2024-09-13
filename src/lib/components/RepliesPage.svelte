<script lang="ts">
  //@ts-nocheck
  import { onMount } from "svelte";
  import { fetchMemesByIds, fetchReplies, getMeme } from "$lib/ao/mememaker";
  import Tweet from "$lib/components/Tweet.svelte";
  import { Link } from "svelte-routing";
  import { Button } from "$lib/components/ui/button";
  import CreatePost from "$lib/components/CreateMeme.svelte";
  import SwapTransactions from "$lib/components/views/swap/SwapTransaction.svelte";
  import * as Tabs from "$lib/components/ui/tabs";
  export let memeId: string;

  let meme: Meme;
  let replies = [];
  let isCreatePostOpen = false;

  onMount(async () => {
    try {
      meme = await getMeme(memeId);
      replies = await fetchReplies(memeId, "1", "100");
      console.log(meme);
      console.log(replies);
    } catch (error) {
      console.error("Error fetching data:", error);
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

{#if meme}
  <div class="w-full mt-8 flex items-center justify-center">
    <Tabs.Root value="replies">
      <div class="flex flex-row justify-between">
        <Tabs.List class="grid w-[400px] grid-cols-2">
          <Tabs.Trigger value="transactions">Transactions</Tabs.Trigger>
          <Tabs.Trigger value="replies">Replies</Tabs.Trigger>
        </Tabs.List>
        <div class="text-right">
          <Button on:click={openCreatePostModal}>Reply</Button>
        </div>
      </div>

      <Tabs.Content value="transactions">
        <SwapTransactions {meme} />
      </Tabs.Content>
      <Tabs.Content value="replies">
        {#each replies as reply}
          <Link
            to="/Feed/{reply.Pool}"
            class="block w-full max-w-3xl mx-auto mb-6"
          >
            <Tweet meme={reply} />
          </Link>
        {/each}
      </Tabs.Content>
    </Tabs.Root>
  </div>
{:else}
  <!-- add some loading indicator or some kind of ui to handle the temorary time that meme is null -->
{/if}

<!-- </div> -->
<!-- {/if} -->

{#if isCreatePostOpen}
  <CreatePost
    isOpen={isCreatePostOpen}
    parent={meme?.Pool}
    on:close={() => (isCreatePostOpen = false)}
  />
{/if}

<style>
  :global(body) {
    background-color: #e3f2fd;
  }
</style>

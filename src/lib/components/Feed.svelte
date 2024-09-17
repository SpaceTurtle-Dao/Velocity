<script lang="ts">
  import { onMount } from "svelte";
  import Tweet from "$lib/components/Tweet.svelte";
  // import { fetchMemes } from "$lib/ao/relay";
  import type { Meme } from "$lib/models/Meme";
  import Spinner from "$lib/components/Spinner.svelte";

  let memes: Meme[] = [];
  let loading = true;

  // onMount(async () => {
  //   try {
  //     memes = await fetchMemes("1", "100");
  //   } catch (error) {
  //     console.error("Error fetching memes:", error);
  //   } finally {
  //     loading = false;
  //   }
  // });
</script>

<div class="max-w-4xl mx-auto p-4 bg-background-500">
  {#if loading}
    <div>
      <Spinner />
    </div>
  {:else}
    <div class="space-y-6">
      {#each memes as meme (meme.Pool)}
        <Tweet {meme} />
      {/each}
    </div>
  {/if}
</div>

<style>
</style>

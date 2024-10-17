<script lang="ts">
  import { onMount } from "svelte";
  import { Video } from "flowbite-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  export let event: any;
  let inlineUrl: string;

  function parseTags() {
    let match = event.Content.match(/https?:\/\/[^\s]+/);
    if (match == null) return;
    inlineUrl = match[0];
  }

  parseTags();
</script>

{#if event.mimeType && event.url && inlineUrl}
  <article class="pb-5 text-primary text-wrap ...">
    <p>{event.Content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  {#if event.mimeType.startsWith("image/")}
    <img class="border border-border" alt="The project logo" src={event.url} />
  {:else}
    <Video src={event.url} controls />
  {/if}
{:else if inlineUrl}
  <article class="justify-left text-primary text-wrap ...">
    <p>{event.Content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  <Button href={inlineUrl} variant="link" class="pl-11 pb-6 text-blue-500"
    >{inlineUrl}</Button
  >
{:else}
  <article class="text-primary text-wrap ...">
    <p>{event.Content}</p>
  </article>
{/if}

<style>
  img {
    border-radius: 2.5%;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import type { Event } from "$lib/models/Event";
  import { Video } from "flowbite-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  export let event: Event;
  let inlineUrl: string;
  let media: string;
  let mimeType: string;
  let thumb: string;

  function parseTags() {
    let isImeta = false;
    let match = event.content.match(/https?:\/\/[^\s]+/);
    if (match == null) return;
    inlineUrl = match[0];
    let tags = event.tags[0];
    for (var i in tags) {
      let tag = tags[i];
      if (tag == "imeta") {
        isImeta = true;
      }
    }
    if (isImeta) {
      for (var i in tags) {
        let tag = tags[i];
        if (tag.split(" ")[0] == "url" && inlineUrl == tag.split(" ")[1]) {
          media = tag.split(" ")[1];
        }
        if (tag.split(" ")[0] == "m") {
          mimeType = tag.split(" ")[1];
        }
        if (tag.split(" ")[0] == "thumb") {
          thumb = tag.split(" ")[1];
        }
      }
    }
  }

  parseTags();
</script>

{#if mimeType && media && inlineUrl}
  <article class="pb-5 text-primary text-wrap ...">
    <p>{event.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  {#if mimeType.startsWith("image/")}
    <img class="border border-border" alt="The project logo" src={media} />
  {:else}
    <Video src={media} controls />
  {/if}
{:else if inlineUrl}
  <article class="justify-left text-primary text-wrap ...">
    <p>{event.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  <Button href={inlineUrl} variant="link" class="pl-11 pb-6 text-blue-500"
    >{inlineUrl}</Button
  >
{:else}
  <article class="text-primary text-wrap ...">
    <p>{event.content}</p>
  </article>
{/if}

<style>
  img {
    border-radius: 2.5%;
  }
</style>

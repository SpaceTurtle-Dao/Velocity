<script lang="ts">
  import { onMount } from "svelte";
  import { Video } from "flowbite-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  
  export let event: any;
  let inlineUrl: string;
  let processedContent: string;

  function parseContent() {
    if (!event?.Content) return "";

    try {
      // Handle both string and object content formats
      let content = event.Content;
      
      // If content is an object, stringify it
      if (typeof content === 'object') {
        content = JSON.stringify(content);
      }

      // If content is stringified JSON, try to parse it
      if (content.startsWith('{') && content.endsWith('}')) {
        const parsed = JSON.parse(content);
        // For reposts, get the original content
        content = parsed.Content || parsed.content || content;
      }

      return content;
    } catch (error) {
      console.error('Error parsing content:', error);
      return event.Content; // Return original content if parsing fails
    }
  }

  function parseTags() {
    const content = parseContent();
    processedContent = content;
    
    let match = content.match(/https?:\/\/[^\s]+/);
    if (match == null) return;
    inlineUrl = match[0];
  }

  onMount(() => {
    parseTags();
  });
</script>

{#if event.mimeType && event.url && inlineUrl}
  <article class="pb-5 text-primary text-wrap ...">
    <p>{processedContent.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  {#if event.mimeType.startsWith("image/")}
    <img class="border border-border rounded-lg w-full" alt="The project logo" src={event.url} />
  {:else}
    <Video src={event.url} controls />
  {/if}
{:else if inlineUrl}
  <article class="justify-left text-primary text-wrap ...">
    <p>{processedContent.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  <Button href={inlineUrl} variant="link" class="pl-11 pb-6 text-blue-500">
    {inlineUrl}
  </Button>
{:else}
  <article class="text-primary text-wrap ...">
    <p>{processedContent}</p>
  </article>
{/if}

<style>
  img {
    border-radius: 2.5%;
  }
</style>
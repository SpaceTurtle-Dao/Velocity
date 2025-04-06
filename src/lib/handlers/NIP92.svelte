<script lang="ts">
  import { onMount } from "svelte";
  import { Video } from "flowbite-svelte";
  import type { Post } from "$lib/models/Post";

  import { ucmService } from "$lib/services/UCMService";
  import TokenCard from "$lib/components/Assets_Card/TokenCard.svelte";

  export let post: Post;
  let inlineUrl: string;
  let processedContent: string;
  let assetId: string | null = null;
  let collectionId: string | null = null;
  let assetDetails: any = null;
  let loading: boolean = false;
  let error: string | null = null;
  let isBazarLink: boolean = false;

  function parseTags() {
    if (post.content != undefined) {
      let match = post.content.toString().match(/https?:\/\/[^\s]+/);
      if (match == null) return;
      inlineUrl = match[0];

      isBazarLink = inlineUrl.includes("bazar.arweave.net");

      const bazarAssetRegex =
        /https:\/\/bazar\.arweave\.net\/#\/asset\/([a-zA-Z0-9_-]+)/;
      const bazarAssetMatch = inlineUrl.match(bazarAssetRegex);

      const bazarCollectionRegex =
        /https:\/\/bazar\.arweave\.net\/#\/collection\/([a-zA-Z0-9_-]+)\/assets\//;
      const bazarCollectionMatch = inlineUrl.match(bazarCollectionRegex);

      if (bazarAssetMatch && bazarAssetMatch[1]) {
        assetId = bazarAssetMatch[1];
        fetchCollectionDetails(assetId);
      } else if (bazarCollectionMatch && bazarCollectionMatch[1]) {
        collectionId = bazarCollectionMatch[1];
        fetchCollectionDetails(collectionId);
      }
    }
  }

  async function fetchAssetDetails(id: string) {
    loading = true;
    error = null;

    try {
      const asset = await ucmService.getAtomicAsset(id);
      assetDetails = asset;
    } catch (err) {
      console.log("Failed to fetch asset details:", err);
      error = "Failed to load asset details";
    } finally {
      loading = false;
    }
  }

  async function fetchCollectionDetails(id: string) {
    loading = true;
    error = null;

    try {
      const collection = await ucmService.getCollection(id);
      // console.log("Collection data:", collection);
      assetDetails = collection;
    } catch (err) {
      console.log("Failed to fetch collection details:", err);
      error = "Failed to load collection details";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    if (!post) return;
    parseTags();
  });
</script>

{#if post.mimeType && post.url && inlineUrl}
  <article class="pb-5 text-primary text-wrap ...">
    <p>{post.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>
  {#if post.mimeType.startsWith("image/")}
    <img
      class="border border-border rounded-lg w-full"
      alt="The project logo"
      src={post.url}
    />
  {:else}
    <Video src={post.url} controls />
  {/if}
{:else if inlineUrl}
  <article class="justify-left text-primary text-wrap ...">
    <p>{post.content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</p>
  </article>

  {#if (assetId || collectionId) && loading}
    <div class="py-4 text-center">
      <p>Loading asset details...</p>
    </div>
  {:else if (assetId || collectionId) && assetDetails}
    <div class="py-4">
      <TokenCard
        name={assetDetails.title || "Unknown Asset"}
        imageUrl={assetDetails.thumbnail || ""}
        bannerUrl={assetDetails.banner}
        assetUrl={inlineUrl}
      />
    </div>
  {/if}

  {#if !isBazarLink || (assetId === null && collectionId === null && !assetDetails)}
    <a
      href={inlineUrl}
      class="pl-0 pb-6 text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      on:click|stopPropagation={() => {}}
    >
      <p class="text-wrap">{inlineUrl}</p>
    </a>
  {/if}
{:else}
  <article class="text-primary text-wrap ...">
    <p>{post.content}</p>
  </article>
{/if}

<style>
  img {
    border-radius: 2.5%;
  }
</style>

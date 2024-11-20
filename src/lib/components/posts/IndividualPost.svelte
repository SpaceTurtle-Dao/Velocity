<script lang="ts">
  import { onMount } from "svelte";
  import { fetchEvents, event as aoEvent } from "$lib/ao/relay";
  import { currentUser } from "$lib/stores/profile.store";
  import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import Like from "$lib/components/views/engagement/Like.svelte";
  import Repost from "$lib/components/views/engagement/Repost.svelte";
  import Buy from "$lib/components/views/engagement/Buy.svelte";
  import Share from "$lib/components/views/engagement/Share.svelte";
  import Post from "$lib/components/posts/Post.svelte";
  import { Image } from "lucide-svelte";
  import { afterUpdate } from "svelte";
  import type { Tag } from "$lib/models/Tag";
  import { upload } from "$lib/ao/uploader";
  import { link, push, location } from "svelte-spa-router";
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";

  // Reactive declaration for URL parsing
  $: {
    const urlParts = $location.split("/");
    id = urlParts[urlParts.length - 1] || "/";
    user = urlParts[urlParts.length - 2] || "/";
    if (id !== "/" && user !== "/") {
      loadPost(user, id);
    }
  }

  let post: any = null;
  let replies: any[] = [];
  let _user: any;
  let profile: any;
  let id: string;
  let user: string;

  let replyContent = "";
  let isSubmitting = false;
  let fileInput: HTMLInputElement;
  let selectedMedia: File | null = null;
  let mediaPreviewUrl: string | null = null;

  async function loadPost(userId: string, postId: string) {
    try {
      // First, try to fetch the specific post
      let postFilter = JSON.stringify([
        {
          ids: [postId],
          kinds: ["1", "6"],
        },
      ]);

      let postResults = await fetchEvents(postFilter);

      if (postResults.length > 0) {
        post = postResults[0];
        post.Tags = post.Tags || {};
        // _user = await info(post.From);
        profile = _user?.Profile;

        // After loading the post, fetch its replies
        await fetchReplies(postId);
      } else {
        console.error("Post not found");
        post = null;
      }
    } catch (error) {
      console.error("Error loading post:", error);
      post = null;
    }
  }

  function findTagValue(tags: Tag[], tagName: string): string | undefined {
    if (!Array.isArray(tags)) return undefined;
    return tags.find((tag) => tag.name === tagName)?.value;
  }

  function clearFields() {
    replyContent = "";
    selectedMedia = null;
    mediaPreviewUrl = null;
    if (fileInput) fileInput.value = "";
  }

  async function refreshPage() {
    const scrollPos = window.scrollY;
    await loadPost(user, id);
    setTimeout(() => {
      window.scrollTo(0, scrollPos);
    }, 100);
  }

  onMount(async () => {
    if (id !== "/" && user !== "/") {
      await loadPost(user, id);
    }
  });

  async function fetchReplies(postId: string) {
    try {
      let replyFilter = JSON.stringify([
        {
          kinds: ["1"],
          limit: 100,
          tags: { marker: ["reply"] },
        },
        {
          tags: { e: [postId] },
        },
      ]);
      replies = await fetchEvents(replyFilter);
      replies = await Promise.all(
        replies.map(async (reply) => {
          // const replyUser = await info(reply.From);
          return {
            ...reply,
            Tags: reply.Tags || {},
            // user: replyUser,
            // profile: replyUser?.Profile,
          };
        })
      );
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  }

  function handleMediaSelect() {
    fileInput?.click();
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedMedia = target.files[0];
      mediaPreviewUrl = URL.createObjectURL(selectedMedia);
    }
  }

  function removeSelectedMedia() {
    selectedMedia = null;
    mediaPreviewUrl = null;
    if (fileInput) fileInput.value = "";
  }

  async function handleReply() {
    if (!replyContent.trim() && !selectedMedia) return;

    isSubmitting = true;
    try {
      const tags: Tag[] = [
        { name: "Kind", value: "1" },
        { name: "marker", value: "reply" },
        { name: "e", value: post.Id },
        { name: "p", value: post.From },
      ];

      const postTags: Tag[] = Array.isArray(post.Tags) ? post.Tags : [];
      const rootValue = findTagValue(postTags, "root");

      tags.push({
        name: "root",
        value: rootValue || post.Id,
      });

      let _content = replyContent;
      if (selectedMedia) {
        const media = await upload(selectedMedia);
        const dimensions = "";

        tags.push({ name: "url", value: media.url });
        tags.push({ name: "mimeType", value: media.mimeType || "" });
        tags.push({ name: "dim", value: dimensions });

        _content = _content + " " + media.url;
      }

      tags.push({ name: "Content", value: _content });
      tags.push({ name: "action", value: "reply" });

      await aoEvent(tags);

      clearFields();
      await refreshPage();
    } catch (error) {
      console.error("Error creating reply:", error);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleReplyClick(reply: any, e: MouseEvent) {
    e.preventDefault();
    await push(`/post/${reply.From}/${reply.Id}`);
  }
</script>

<div class="max-w-prose mx-auto mt-10 mb-10">
  {#if post}
    <div class="border border-border hover:bg-gray-900/5">
      <Post event={post} />

      <div class="border-t border-border p-4">
        <div class="flex space-x-3">
          <Avatar class="h-12 w-12">
            {#if $currentUser?.Profile?.picture}
              <AvatarImage
                src={$currentUser.Profile.picture}
                alt={$currentUser.Profile.name || "Current User"}
              />
            {:else}
              <AvatarFallback>
                {$currentUser?.Profile?.name?.[0] || "U"}
              </AvatarFallback>
            {/if}
          </Avatar>
          <div class="flex-1">
            <Textarea
              bind:value={replyContent}
              placeholder="Post your reply"
              class="w-full bg-background text-primary border-none focus:border-none outline-none focus:outline-none focus-visible:outline-none ring-none focus:ring-none focus-visible:ring-none text-lg"
            />
            {#if mediaPreviewUrl}
              <div class="relative mt-2">
                {#if selectedMedia?.type.startsWith("video")}
                  <!-- svelte-ignore a11y-media-has-caption -->
                  <video
                    src={mediaPreviewUrl}
                    controls
                    class="w-full h-48 object-cover rounded-md"
                  />
                {:else}
                  <img
                    src={mediaPreviewUrl}
                    alt="Selected media"
                    class="w-full object-cover rounded-md"
                  />
                {/if}
                <button
                  class="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  on:click={removeSelectedMedia}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            {/if}
            <div class="flex justify-between mt-4">
              <Button
                variant="ghost"
                on:click={handleMediaSelect}
                class="text-primary hover:bg-primary/10 rounded-full"
              >
                <Image size={24} />
              </Button>

              <ButtonWithLoader
                class="rounded-full  py-3 font-semibold px-6 w-24"
                on:click={handleReply}
                loader={isSubmitting}
                disabled={isSubmitting ||
                  (!replyContent.trim() && !selectedMedia)}
                >Reply
              </ButtonWithLoader>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              bind:this={fileInput}
              class="hidden"
              on:change={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>

    {#each replies as reply (reply.Id)}
      <div
        class="border border-border hover:bg-gray-900/5 cursor-pointer"
        on:click={(e) => handleReplyClick(reply, e)}
      >
        <Post event={reply} showFullPost={false} />
      </div>
    {/each}
  {:else}
    <div class="flex justify-center items-center h-32">
      <p class="text-gray-500">Loading...</p>
    </div>
  {/if}
</div>

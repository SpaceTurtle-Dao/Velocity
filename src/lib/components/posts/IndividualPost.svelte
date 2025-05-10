<script lang="ts">
  import { onMount } from "svelte";
  import { fetchEvents, event as aoEvent } from "$lib/ao/relay";
  import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import PostComponent from "$lib/components/posts/Post.svelte";
  import { Image } from "lucide-svelte";
  import type { Tag } from "$lib/models/Tag";
  import { upload } from "$lib/ao/uploader";
  import { link, push, location } from "svelte-spa-router";
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { hubService } from "$lib/services/HubService";
  import { profileService } from "$lib/services/ProfileService";
  import type { Post } from "$lib/models/Post";
  import { currentUser } from "$lib/stores/currentUser.store";
  import { PROFILE_REGISTRY_ID } from "$lib/constants";
  import type { Zone } from "$lib/models/Zone";
    import { postService } from "$lib/services/PostService";
    import type { Profile } from "$lib/models/Profile";

  export let params: { hubId?: string; id?: string } = {};

  const onAddressParamChange = async () => {
    await loadPost();
  };

  $: {
    if (params.hubId && params.id) {
      onAddressParamChange();
    }
  }

  let post: Post;
  let profile: Profile;
  let replies: Post[] = [];
  let replyCount = 0;
  let id: string;
  let user: string;
  let hubId: string;
  let replyContent = "";
  let isSubmitting = false;
  let fileInput: HTMLInputElement;
  let selectedMedia: File | null = null;
  let mediaPreviewUrl: string | null = null;

  postService.subscribe((posts) => {
    if (!params.hubId || !params.id) return;
    replies = posts
      .values()
      .filter((value) => value.e == params.id)
      .toArray();
    replyCount = replies.length;
    console.log(`got ${replyCount} Replies`);
  });

  profileService.subscribe((profiles) => {
    if (post && post.owner && profiles.has(post.owner)) {
      profile = profiles.get(post.owner)!;
    }
  });

  async function loadPost() {
    if (!params.hubId || !params.id) return;
    console.log(params.hubId);
    console.log(params.id);
    post = await postService.get(params.hubId, params.id);
    profileService.fetchProfiles(params.hubId, [post.owner]);
    console.log(post);
    //await postService.fetchReplies(hubId, id);
    //await postService.fetchRepost(hubId, id);
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
    await loadPost();
    setTimeout(() => {
      window.scrollTo(0, scrollPos);
    }, 100);
  }
  onMount(async () => {
    await loadPost();
  });

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
    if (!params.hubId || !params.id) return;
    if (!replyContent.trim() && !selectedMedia) return;

    isSubmitting = true;
    try {
      const tags: Tag[] = [
        { name: "Kind", value: "1" },
        { name: "marker", value: "reply" },
        { name: "e", value: post.id },
        { name: "p", value: post.from },
      ];

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

      await aoEvent(params.hubId, tags);

      clearFields();
      await refreshPage();
    } catch (error) {
      console.log("Error creating reply:", error);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleReplyClick(reply: any, e: MouseEvent) {
    e.preventDefault();
    await push(`/post/${reply.From}/${reply.Id}`);
  }
</script>

<div class="max-w-prose mx-auto mb-10 {$isMobile ? 'mt-0' : 'mt-10'}">
  {#if params.hubId && params.id && post}
    <div class="border border-border hover:bg-gray-900/5">
      <PostComponent {post} />

      <div class="border-t border-border p-4">
        <div class="flex space-x-3">
          {#if profile}
            <Avatar class="h-12 w-12 text-primary">
              {#if profile.thumbnail}
                <AvatarImage
                  src={`https://www.arweave.net/${profile.thumbnail}`}
                  alt={profile.displayName || "Current User"}
                />
              {:else}
                <AvatarFallback>
                  {profile.userName?.[0] || "U"}
                </AvatarFallback>
              {/if}
            </Avatar>
          {/if}
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
    {#each replies as reply}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="border border-border hover:bg-gray-900/5 cursor-pointer"
        on:click={(e) => handleReplyClick(reply, e)}
      >
        <PostComponent post={reply} />
      </div>
    {/each}
  {:else}
    <div class="flex justify-center items-center h-32">
      <p class="text-gray-500">Loading...</p>
    </div>
  {/if}
</div>

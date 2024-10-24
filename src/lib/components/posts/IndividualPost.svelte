<script lang="ts">
  import { onMount } from "svelte";
  import { fetchEvents, info, event as aoEvent } from "$lib/ao/relay";
  import { currentUser } from "$lib/stores/profile.store";
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import Like from "$lib/components/views/engagement/Like.svelte";
  import Repost from "$lib/components/views/engagement/Repost.svelte";
  import Buy from "$lib/components/views/engagement/Buy.svelte";
  import Share from "$lib/components/views/engagement/Share.svelte";
  import Post from "$lib/components/posts/Post.svelte";
  import { Image } from "lucide-svelte";
  import { afterUpdate } from "svelte";

  let url = window.location.href.split("/");
  let id = url.pop() || "/";
  let user = url.pop() || "/";
  
  let post: any = null;
  let replies: any[] = [];
  let _user: any;
  let profile: any;

  // For reply input
  let replyContent = "";
  let isSubmitting = false;
  let fileInput: HTMLInputElement;
  let selectedMedia: File | null = null;
  let mediaPreviewUrl: string | null = null;

  onMount(async () => {
    let postFilter = JSON.stringify([
      {
        kinds: ["1"],
        tags: { marker: ["root"] }
      }
    ]);
    let postResults = await fetchEvents(user, postFilter);
    if (postResults.length > 0) {
      post = postResults[0];
      _user = await info(post.From);
      profile = _user.Profile;
    }

    let replyFilter = JSON.stringify([
      {
        kinds: ["1"],
        limit: 100,
        tags: { marker: ["reply"] }
      },
      {
        tags: { e: [id] }
      }
    ]);
    replies = await fetchEvents($currentUser.Process, replyFilter);
  });

  async function handleReply() {
    if (!replyContent.trim() && !selectedMedia) return;
    isSubmitting = true;

    try {
      const tags = [
        { name: "Kind", value: "1" },
        { name: "marker", value: "reply" },
        { name: "e", value: post.Id },
        { name: "p", value: post.From },
        { name: "Content", value: replyContent }
      ];

      const newReply = await aoEvent(tags, $currentUser.Process);
      replies = [newReply, ...replies];
      replyContent = "";
      selectedMedia = null;
      mediaPreviewUrl = null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      isSubmitting = false;
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

  afterUpdate(() => {
    url = window.location.href.split("/");
    id = url.pop() || "/";
    user = url.pop() || "/";
  });
</script>

<div class="max-w-prose mx-auto mt-10 mb-10">
  {#if post}
    <!-- Main Post -->
    <div class="border border-border hover:bg-gray-900/5">
      <div class="p-4">
        <div class="flex space-x-3">
          <Avatar class="h-12 w-12">
            {#if profile?.picture}
              <AvatarImage src={profile.picture} alt={profile?.name || "User"} />
            {:else}
              <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
            {/if}
          </Avatar>
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-primary">{profile?.name || "User"}</span>
              {#if profile?.verified}
                <span class="text-blue-500">✓</span>
              {/if}
            </div>
            <p class="text-primary mt-1">{post.Content}</p>
            
            <!-- Engagement Stats -->
            <div class="flex justify-between mt-4 text-gray-500 max-w-md">
              <div class="flex items-center space-x-3">
                <button class="hover:text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </button>
                <Repost />
                <Like _event={post} />
                <Buy />
                <Share />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Inline Reply Field -->
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
              class="w-full bg-background border-none focus:border-none outline-none focus:outline-none focus-visible:outline-none ring-none focus:ring-none focus-visible:ring-none text-lg"
            />
            {#if mediaPreviewUrl}
              <div class="relative mt-2">
                {#if selectedMedia?.type.startsWith('video')}
                  <video src={mediaPreviewUrl} controls class="w-full h-48 object-cover rounded-md" />
                {:else}
                  <img src={mediaPreviewUrl} alt="Selected media" class="w-full object-cover rounded-md" />
                {/if}
                <button
                  class="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  on:click={removeSelectedMedia}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
              <Button
                on:click={handleReply}
                disabled={isSubmitting || (!replyContent.trim() && !selectedMedia)}
                class="bg-primary text-primary-foreground rounded-full px-4 py-2 font-semibold hover:bg-primary/90"
              >
                {isSubmitting ? "Replying..." : "Reply"}
              </Button>
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

    <!-- Replies -->
    {#each replies as reply (reply.Id)}
      <div class="border border-border hover:bg-gray-900/5">
        <Post event={reply} />
      </div>
    {/each}
  {:else}
    <div class="flex justify-center items-center h-32">
      <p class="text-gray-500">Loading...</p>
    </div>
  {/if}
</div>
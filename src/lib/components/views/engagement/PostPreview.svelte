<script lang="ts">
  import { formatTimestamp } from "$lib/utils/timestamp.utils";
  import type { Profile } from "$lib/models/Profile";
  import ProfilePictureHoverCard from "$lib/components/UserProfile/ProfilePictureHoverCard.svelte";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import { Repeat2Icon } from "lucide-svelte";
  import { onMount } from "svelte";
  import { PostType, type Post } from "$lib/models/Post";
  import { currentUser } from "$lib/services/CurrentUser";

  export let post: Post;
  export let profile: Profile;

  function formatContent(content: string): string {
    // console.log("hhhh", JSON.parse(content));
    // content = isRepost ? JSON.parse(content).Content : content;
    // console.log("hhhh", content);

    let urlReplaceContent = content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");

    if (urlReplaceContent.length < 400) {
      return urlReplaceContent;
    }

    return urlReplaceContent.slice(0, 400) + "...";
  }

  onMount(async () => {});
</script>

{#if post.type == PostType.Repost}
  <div class="flex items-center text-muted-foreground mb-2">
    <Repeat2Icon size={16} class="mr-2" />
    <span class="text-sm"
      >Reposted by
      {#if $currentUser && profile.owner == $currentUser.address}
        You
      {:else}
        @{profile.displayName}
      {/if}
    </span>
  </div>
{/if}

<div class="flex mt-4">
  <div class="h-full flex flex-col items-center">
    {#if post.rePost}
      <ProfilePictureHoverCard size="lg" {profile} />
    {/if}
    <div
      id="vertical-line"
      class="h-full bg-secondary w-[2px] flex-1 mt-3"
    ></div>
  </div>
  <div class="flex flex-col">
    <div
      class="h-12 w-full flex items-center min-w-0 overflow-hidden whitespace-nowrap"
    >
      {#if post.rePost}
        <ProfileHoverCard {profile}>
          <div class="flex space-x-1">
            <div class="text-primary text-base font-medium mr-1 ml-2">
              {profile.userName}
            </div>

            <div class="text-muted-foreground text-base font-light truncate">
              {"@" + profile.displayName}
            </div>
          </div>
        </ProfileHoverCard>
        <ProfileHoverCard {profile}>
          <div class="flex space-x-1">
            <div class="text-primary text-base font-medium mr-1 ml-2">
              {profile.userName}
            </div>

            <div class="text-muted-foreground text-base font-light truncate">
              {"@" + profile.displayName}
            </div>
          </div>
        </ProfileHoverCard>

        <span class="text-muted-foreground pl-1">
          · {formatTimestamp(post.rePost.timestamp)}</span
        >
      {/if}
    </div>
    {#if post.rePost}
      <div class="text-primary text-start mt-4">
        {formatContent(post.rePost.content)}
      </div>
    {/if}

    <div class="text-start text-muted-foreground mt-5">
      {"Replying to "}
      <span class="text-sky-500">{"@" + profile.displayName}</span>
    </div>
  </div>
</div>

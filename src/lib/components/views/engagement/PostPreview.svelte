<script lang="ts">
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import { formatTimestamp } from "$lib/utils/timestamp.utils";
  import type { Profile } from "$lib/models/Profile";
  import ProfilePictureHoverCard from "$lib/components/UserProfile/ProfilePictureHoverCard.svelte";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";

  export let event: any;
  export let user: Profile | undefined;

  function formatContent(content: string): string {
    let urlReplaceContent = content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");

    if (urlReplaceContent.length < 400) {
      return urlReplaceContent;
    }

    return urlReplaceContent.slice(0, 400) + "...";
  }

  let isUserSubscribed: boolean;
</script>

<div class="flex mt-4">
  <div class="h-full flex flex-col items-center">
    {#if user}
      <ProfilePictureHoverCard size="lg" profile={user} bind:isUserSubscribed />
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
      {#if user}
        <ProfileHoverCard profile={user} bind:isUserSubscribed>
          <div class="flex space-x-1">
            <div class="text-primary text-base font-medium mr-1 ml-2">
              {user?.name}
            </div>

            <div class="text-muted-foreground text-base font-light truncate">
              {"@" + user?.display_name}
            </div>
          </div>
        </ProfileHoverCard>
      {/if}

      <span class="text-muted-foreground pl-1">
        · {formatTimestamp(event.Timestamp)}</span
      >
    </div>
    <div class="text-primary text-start mt-4">
      {formatContent(event.Content)}
    </div>

    <div class="text-start text-muted-foreground mt-5">
      {"Replying to "}
      <span class="text-sky-500">{"@" + user?.display_name}</span>
    </div>
  </div>
</div>

<script lang="ts">
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import { formatTimestamp } from "$lib/utils/timestamp.utils";
  import type { Profile } from "$lib/models/Profile";
  import ProfilePictureHoverCard from "$lib/components/UserProfile/ProfilePictureHoverCard.svelte";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import { Repeat2Icon } from "lucide-svelte";
  import { currentUser } from "$lib/stores/current-user.store";
    import { profileService } from "$lib/services/ProfileService";

  export let event: any;
  export let user: Profile | undefined;
  export let isRepost: boolean;

  let originalPostEvent = isRepost ? JSON.parse(event.Content) : event;

  let profile = profileService.get(event.From);

  let originalPostProfile = profileService.get(originalPostEvent.From);

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
</script>

{#if isRepost}
  <div class="flex items-center text-muted-foreground mb-2">
    <Repeat2Icon size={16} class="mr-2" />
    <span class="text-sm"
      >Reposted by
      {#if profile?.address == $currentUser?.address}
        You
      {:else}
        @{profile?.display_name}
      {/if}
    </span>
  </div>
{/if}

<div class="flex mt-4">
  <div class="h-full flex flex-col items-center">
    {#if originalPostProfile}
      <ProfilePictureHoverCard size="lg" profile={originalPostProfile} />
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
      {#if isRepost && originalPostProfile}
        <ProfileHoverCard profile={originalPostProfile}>
          <div class="flex space-x-1">
            <div class="text-primary text-base font-medium mr-1 ml-2">
              {originalPostProfile?.name}
            </div>

            <div class="text-muted-foreground text-base font-light truncate">
              {"@" + originalPostProfile?.display_name}
            </div>
          </div>
        </ProfileHoverCard>
      {:else if profile}
        <ProfileHoverCard {profile}>
          <div class="flex space-x-1">
            <div class="text-primary text-base font-medium mr-1 ml-2">
              {profile?.name}
            </div>

            <div class="text-muted-foreground text-base font-light truncate">
              {"@" + profile?.display_name}
            </div>
          </div>
        </ProfileHoverCard>
      {/if}

      <span class="text-muted-foreground pl-1">
        · {formatTimestamp(originalPostEvent.Timestamp)}</span
      >
    </div>
    <div class="text-primary text-start mt-4">
      {formatContent(originalPostEvent.Content)}
    </div>

    <div class="text-start text-muted-foreground mt-5">
      {"Replying to "}
      <span class="text-sky-500">{"@" + profile?.display_name}</span>
    </div>
  </div>
</div>

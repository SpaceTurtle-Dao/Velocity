<script lang="ts">
  import { type Profile } from "$lib/models/Profile";
  import Follow from "$lib/components/Follow/Follow.svelte";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import { getDisplayUrl } from "$lib/utils/url.utils";
  import { profileService } from "$lib/services/ProfileService";
  import { onMount } from "svelte";
  import { hubService } from "$lib/services/HubService";
  import ProfilePictureHoverCard from "$lib/components/UserProfile/ProfilePictureHoverCard.svelte";
  import type { Zone } from "$lib/models/Zone";
  import { toUrl, HUB_REGISTRY_ID, PROFILE_REGISTRY_ID } from "$lib/constants";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import type { Hub } from "$lib/models/Hub";

  export let hubId: string;
  let hub: Hub;
  let profile: Profile;

  profileService.subscribe((profiles) => {
    let _profile = profiles.get(hubId)
    if (_profile) {
      profile = _profile;
    }
  });
  
  onMount(async () => {
    //console.log("**Loading Profile card**");
    hubService.info(hubId).then((_hub) => hub = _hub);
    profileService.fetchProfiles(hubId, [hubId]);
  });
</script>

{#if profile}
  <div class="flex items-center justify-between min-w-0">
    <div class="flex gap-2 sm:gap-3">
      <div class="flex justify-center pt-1.5">
        <ProfilePictureHoverCard {profile} size="sm" />
      </div>
      <div class="grid overflow-hidden flex-1">
        <ProfileHoverCard {profile}>
          <span class="font-medium text-sm sm:text-base">{profile.userName}</span>
        </ProfileHoverCard>

        <p class="text-muted-foreground text-xs sm:text-sm truncate">
          @{profile.displayName}
        </p>
        {#if profile.description}
          <p class="line-clamp-2 text-xs sm:text-sm" id={profile.owner}>
            {profile.description}
          </p>
        {/if}
        {#if profile.website}
          <a
            class="text-blue-500 hover:underline text-xs sm:text-sm"
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getDisplayUrl(profile.website)}
          </a>
        {/if}
      </div>
    </div>
    <div class="ml-3 font-medium">
      <!-- <Follow address={profile.address} /> -->
    </div>
  </div>
{/if}
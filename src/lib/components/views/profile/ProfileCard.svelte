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
  import { profileRegistryService } from "$lib/services/ProfileRegistryService";
  import type { Zone } from "$lib/models/Zone";
  import { PROFILE_REGISTRY_ID } from "$lib/constants";

  export let hubId: string;
  let profile: Zone;
  let address: string;

  profileRegistryService.subscribe((zones) => {
    if (address && zones.has(address)) {
      profile = zones.get(address)!;
      console.log(profile);
    }
  });

  function toUrl(tx: string) {
    return `https://arweave.net/${tx}`;
  }

  onMount(async () => {
    let hub = await hubService.info(hubId);
    address = hub.User;
    profileRegistryService.getZoneById(PROFILE_REGISTRY_ID(), address);
  });
</script>

{#if profile}
  <div class="flex items-center justify-between min-w-0">
    <div class="flex gap-2">
      <div class="hidden sm:flex justify-center pt-1.5">
        <ProfilePictureHoverCard {profile} size="lg" />
      </div>
      <div class="grid overflow-hidden">
        <ProfileHoverCard {profile}>
          {profile.spec.userName}
        </ProfileHoverCard>

        <p class="text-muted-foreground text-sm truncate">
          @{profile.spec.displayName}
        </p>
        {#if profile.spec.description}
          <p class="line-clamp-2" id={profile.owner}>
            {profile.spec.description}
          </p>
        {/if}
        {#if profile.spec.website}
          <a
            class="text-blue-500 hover:underline"
            href={profile.spec.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getDisplayUrl(profile.spec.website)}
          </a>
        {/if}
      </div>
    </div>
    <div class="ml-3 font-medium">
      <!-- <Follow address={profile.address} /> -->
    </div>
  </div>
{/if}

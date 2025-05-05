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
  import { HUB_REGISTRY_ID, PROFILE_REGISTRY_ID } from "$lib/constants";
  import { hubRegistryService } from "$lib/services/HubRegistryService";

  export let hubId: string;
  let address: string;
  let profile: Zone;

  hubRegistryService.subscribe((zones) => {
    let zone = zones
      .values()
      .toArray()
      .find((zone) => {
        zone.spec.processId == hubId;
      });

    if (zone) {
      console.log("**Got Hub Zone**");
      address = zone.owner
      console.log(zone.owner)
      if (!profile) {
        profileRegistryService.getZoneById(PROFILE_REGISTRY_ID(), zone.owner);
      }
    } else {
      console.log("No zone found");
      hubService
      .info(hubId)
      .then(async (_hub) => {
        console.log("**Got Info**");
        //console.log(_hub)
        address = _hub.User;
        hubRegistryService.getZoneById(HUB_REGISTRY_ID(),_hub.User)
        profileRegistryService.getZoneById(PROFILE_REGISTRY_ID(), _hub.User);
      })
      .catch(console.log);
    }
  });

  profileRegistryService.subscribe((zones) => {
    if (address && zones.has(address)) {
      console.log("**Got Profile Zone**");
      profile = zones.get(address)!;
      console.log(profile.owner);
    }
  });

  function toUrl(tx: string) {
    return `https://arweave.net/${tx}`;
  }

  onMount(async () => {
    console.log("**Loading Profile card**");
    
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
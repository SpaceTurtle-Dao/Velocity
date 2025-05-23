<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card";
  import ProfilePicture from "./ProfilePicture.svelte";
  import { link } from "svelte-spa-router";
  import { getDisplayUrl } from "$lib/utils/url.utils";
  import { onMount } from "svelte";
  import type { Profile } from "$lib/models/Profile";
  import Follow from "../Follow/Follow.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { currentUser } from "$lib/services/UserService";
  import { hubService } from "$lib/services/HubService";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import type { Hub } from "$lib/models/Hub";
  import { HUB_REGISTRY_ID } from "$lib/constants";
  import type { Zone } from "$lib/models/Zone";

  export let profile: Profile | undefined;
  let hub: Hub;
  let isCurrentUser = $currentUser && $currentUser.address === profile?.owner;

  hubService.subscribe(async (hubs) => {
    if(profile?.owner && hubs.has(profile?.owner)){
      hub = hubs.get(profile?.owner)!
    }
  })

  onMount(async () => {
    if (!profile) return;
    console.log(profile)
    hubService.info(profile.from);
  });
</script>

{#if profile }
  <HoverCard.Root>
    <HoverCard.Trigger>
      <a href="/profile/{profile.owner}" use:link>
        <slot />
      </a>
    </HoverCard.Trigger>
    <HoverCard.Content align="start">
      <div class="flex justify-between">
        {#if profile.thumbnail}
          <a href="/profile/{profile.owner}" use:link>
            <ProfilePicture
              name={profile.displayName}
              src={`https://www.arweave.net/${profile.thumbnail}`}
              size="xl"
            />
          </a>
        {:else}
          <a href="/profile/{profile.owner}" use:link>
            <ProfilePicture name={profile.displayName} src="" size="xl" />
          </a>
        {/if}

        {#if !isCurrentUser}
          <Follow hubId={profile.owner} />
        {/if}
      </div>

      <div class="text-primary text-lg font-bold">
        <a href="/profile/{profile.owner}" use:link>{profile.userName}</a>
      </div>

      <div class="text-muted-foreground text-base font-normal">
        <a href="/profile/{profile.owner}" use:link
          >@{profile.displayName}</a
        >
      </div>

      {#if profile.description}
        <div class="text-primary text-base font-normal mt-4">
          {profile.description}
        </div>
      {/if}

      {#if profile.website}
        <div class="mt-4">
          <a
            class="text-blue-500 hover:underline"
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getDisplayUrl(profile.website)}
          </a>
        </div>
      {/if}

      <div class="flex justify-between mt-4 items-center">
        {#if !hub}
          <Skeleton class="h-4 w-[92px] rounded-full" />
        {:else}
          <div>
            <span class="text-sm font-bold">{hub.Following.length}</span>

            <span class="text-sm font-normal text-muted-foreground"
              >Subscribing</span
            >
          </div>
          <div>
            <span class="text-sm font-bold">{hub.Followers.length}</span>
            <span class="text-sm font-normal text-muted-foreground"
              >Subscribers</span
            >
          </div>
        {/if}
      </div>
    </HoverCard.Content>
  </HoverCard.Root>
{/if}

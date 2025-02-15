<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card";
  import ProfilePicture from "./ProfilePicture.svelte";
  import { link } from "svelte-spa-router";
  import { getDisplayUrl } from "$lib/utils/url.utils";
  import { onMount } from "svelte";
  import type { Profile } from "$lib/models/Profile";
  import Follow from "../Follow/Follow.svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import { fetchFollowList } from "$lib/ao/relay";
  import { Skeleton } from "$lib/components/ui/skeleton";

  export let profile: Profile;

  let numberOfFollowing = 0;

  let isCurrentUser = $currentUser.address === profile.address;

  let followListLoading = false;

  onMount(() => {
    if (isCurrentUser) {
      numberOfFollowing = $currentUser.followList.length;
    } else {
      followListLoading = true;
      fetchFollowList(profile.address)
        .then((followList) => {
          numberOfFollowing = followList.length;
          followListLoading = false;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });
</script>

{#if profile}
  <HoverCard.Root>
    <HoverCard.Trigger>
      <a href="/profile/{profile.address}" use:link>
        <slot />
      </a>
    </HoverCard.Trigger>
    <HoverCard.Content align="start">
      <div class="flex justify-between">
        {#if profile.picture}
        <a href="/profile/{profile.address}" use:link>
          <ProfilePicture name={profile.name} src={profile.picture} size="xl" />
        </a>
        {/if}

        {#if !isCurrentUser}
          <Follow address={profile.address} />
        {/if}
      </div>

      <div class="text-primary text-lg font-bold">
        <a href="/profile/{profile.address}" use:link>{profile.name}</a>
      </div>

      <div class="text-muted-foreground text-base font-normal">
        <a href="/profile/{profile.address}" use:link>@{profile.display_name}</a
        >
      </div>

      {#if profile.about}
        <div class="text-primary text-base font-normal mt-4">
          {profile.about}
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
        {#if followListLoading}
          <Skeleton class="h-4 w-[92px] rounded-full" />
        {:else}
          <div>
            <span class="text-sm font-bold">{numberOfFollowing}</span>

            <span class="text-sm font-normal text-muted-foreground"
              >Subscribing</span
            >
          </div>
        {/if}

        <div>
          <!-- <span class="text-sm font-bold">{userInfo.Subs}</span> -->
          <!--<span class="text-sm font-normal text-muted-foreground"
          >Subscribers</span
        >-->
        </div>
      </div>
    </HoverCard.Content>
  </HoverCard.Root>
{/if}

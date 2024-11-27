<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { currentUser } from "$lib/stores/profile.store";
  import {
    profileFromEvent,
    type Profile,
    type UserInfo,
  } from "$lib/models/Profile";
  import Follow from "$lib/components/Follow/Follow.svelte";
  import { onMount } from "svelte";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import SubUnsubButton from "$lib/components/UserProfile/SubUnsubButton.svelte";

  export let profile: Profile;
  let textWithUrl = "";
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  let isUserSubscribed: boolean;
</script>

<div class="flex items-center justify-between w-full min-w-0">
  <div class="flex gap-2">
    <div class="hidden sm:flex">
      <ProfilePicture src={profile.picture} name={profile.name} />
    </div>
    <div class="grid gap-1 overflow-hidden">
      <ProfileHoverCard {profile} bind:isUserSubscribed>
        {profile.name}
      </ProfileHoverCard>

      <p class="text-muted-foreground text-sm truncate">
        @{profile.display_name}
      </p>
    </div>
  </div>
  <div class="ml-3 font-medium">
    <SubUnsubButton targetProcess={profile.address} bind:isUserSubscribed />
  </div>
</div>

<script lang="ts">
  import type { Profile } from "$lib/models/Profile";
  import ProfileHoverCard from "./ProfileHoverCard.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";

  export let profile: Profile;
  export let size: "sm" | "base" | "lg" | "xl" = "sm";
</script>

{#if profile}
  <ProfileHoverCard {profile}>
    {#if profile.profileImage}
      <ProfilePicture
        name={profile.displayName}
        src={`https://www.arweave.net/${profile.profileImage}`}
        {size}
      />
    {:else}
      <ProfilePicture name={profile.displayName} src="" {size} />
    {/if}
  </ProfileHoverCard>
{/if}

<script lang="ts">
  import type { Profile } from "$lib/models/Profile";
  import ProfileHoverCard from "./ProfileHoverCard.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";
  export let profile: Profile | undefined;
  export let size: "sm" | "base" | "lg" | "xl" = "sm";
</script>

{#if profile}
  <ProfileHoverCard {profile}>
    {#if profile.thumbnail}
      <ProfilePicture
        name={profile.displayName}
        src={`https://www.arweave.net/${profile.thumbnail}`}
        {size}
      />
    {:else}
      <ProfilePicture name={profile.displayName} src="" {size} />
    {/if}
  </ProfileHoverCard>
{/if}

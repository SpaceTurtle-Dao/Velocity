<script lang="ts">
  import type { Profile } from "$lib/models/Profile";
  import type { Zone } from "$lib/models/Zone";
  import ProfileHoverCard from "./ProfileHoverCard.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";

  export let profile: Zone | undefined;
  export let size: "sm" | "base" | "lg" | "xl" = "sm";
</script>

{#if profile}
  <ProfileHoverCard {profile}>
    {#if profile.spec.thumbnail}
      <ProfilePicture
        name={profile.spec.displayName}
        src={`https://www.arweave.net/${profile.spec.thumbnail}`}
        {size}
      />
    {:else}
      <ProfilePicture name={profile.spec.displayName} src="" {size} />
    {/if}
  </ProfileHoverCard>
{/if}

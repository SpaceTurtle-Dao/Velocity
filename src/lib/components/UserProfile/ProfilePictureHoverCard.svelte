<script lang="ts">
  import type { Profile } from "$lib/models/Profile";
  import ProfileHoverCard from "./ProfileHoverCard.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";

  export let profile: Profile;
  export let size: "sm" | "base" | "lg" | "xl" = "sm";

  // this for binding parent component and letting parent know that the subscription updated
  export let isUserSubscribed: boolean;
</script>

<ProfileHoverCard {profile} bind:isUserSubscribed>
  <ProfilePicture name={profile.name} src={profile.picture} {size} />
</ProfileHoverCard>

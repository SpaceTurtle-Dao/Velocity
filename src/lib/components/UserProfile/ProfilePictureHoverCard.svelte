<script lang="ts">
  import type { Profile } from "$lib/models/Profile";
  import ProfileHoverCard from "./ProfileHoverCard.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";

  export let userInfo: Profile;
  export let size: "sm" | "base" | "lg" | "xl" = "sm";

  // this for binding parent component and letting parent know that the subscription updated
  export let isUserSubscribed: boolean;
</script>

<ProfileHoverCard {userInfo} bind:isUserSubscribed>
  <ProfilePicture name={userInfo.name} src={userInfo.picture} {size} />
</ProfileHoverCard>

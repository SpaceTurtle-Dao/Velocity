<script lang="ts">
  import type { Profile } from "$lib/models/Profile";
  import ProfileHoverCard from "./ProfileHoverCard.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";

  export let profile: Profile;
  export let size: "sm" | "base" | "lg" | "xl" = "sm";
</script>

<ProfileHoverCard {profile}>
  <ProfilePicture name={profile.name} src={profile.picture} {size} />
</ProfileHoverCard>

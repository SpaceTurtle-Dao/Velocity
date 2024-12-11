<script lang="ts">
  import { type Profile } from "$lib/models/Profile";
  import Follow from "$lib/components/Follow/Follow.svelte";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";

  export let profile: Profile;
</script>

<div class="flex items-center justify-between w-full min-w-0">
  <div class="flex gap-2">
    <div class="hidden sm:flex">
      <ProfilePicture src={profile.picture} name={profile.name} />
    </div>
    <div class="grid gap-1 overflow-hidden">
      <ProfileHoverCard {profile}>
        {profile.name}
      </ProfileHoverCard>

      <p class="text-muted-foreground text-sm truncate">
        @{profile.display_name}
      </p>
    </div>
  </div>
  <div class="ml-3 font-medium">
    <Follow address={profile.address} />
  </div>
</div>

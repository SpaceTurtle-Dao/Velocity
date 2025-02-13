<script lang="ts">
  import { type Profile } from "$lib/models/Profile";
  import Follow from "$lib/components/Follow/Follow.svelte";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import { getDisplayUrl } from "$lib/utils/url.utils";

  export let profile: Profile;
</script>

{#if profile}
  <div class="flex items-center justify-between min-w-0">
    <div class="flex gap-2">
      <div class="hidden sm:flex justify-center pt-1.5">
        <ProfilePicture src={profile.picture} name={profile.name} />
      </div>
      <div class="grid overflow-hidden">
        <ProfileHoverCard {profile}>
          {profile.name}
        </ProfileHoverCard>

        <p class="text-muted-foreground text-sm truncate">
          @{profile.display_name}
        </p>
        {#if profile.about}
          <p class="line-clamp-2" id={profile.address}>
            {profile.about}
          </p>
        {/if}
        {#if profile.website}
          <a
            class="text-blue-500 hover:underline"
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getDisplayUrl(profile.website)}
          </a>
        {/if}
      </div>
    </div>
    <div class="ml-3 font-medium">
      <Follow address={profile.address} />
    </div>
  </div>
{/if}

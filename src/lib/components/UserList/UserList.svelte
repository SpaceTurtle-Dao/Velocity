<script lang="ts">
  import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { usersProfile } from "$lib/stores/users-profile.store";
  import { currentUser } from "$lib/stores/current-user.store";
  import type { Profile } from "$lib/models/Profile";

  let profiles;

  usersProfile.subscribe((value) => {
    profiles = value.values();
  });
</script>

{#if $usersProfile.size > 0}
  <div class="w-full h-full">
    <Card.Root
      data-x-chunk-name="UserList"
      data-x-chunk-description="A card showing a list of users."
      class="border-border rounded p-0 min-w-[280px] max-w-[400px]"
    >
      <Card.Header>
        <Card.Title>You might like</Card.Title>
      </Card.Header>
      <Card.Content class="w-full">
        <div
          class="grid gap-6 lg:gap-8 max-h-[60vh] lg:max-h-[80vh] overflow-y-auto scrollable-element pr-2 lg:pr-3"
        >
          {#each $usersProfile.values() as profile}
            {#if profile.address !== $currentUser.address}
              <ProfileCard {profile} />
            {/if}
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
{/if}

<style>
  .scrollable-element {
    scrollbar-color: hsl(0, 0%, 45%) hsl(0 0% 14.9%);
    scrollbar-width: thin;
  }
</style>
<script lang="ts">
  import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { usersProfile } from "$lib/stores/users-profile.store";
  import { currentUser } from "$lib/stores/current-user.store";
  import type { Profile } from "$lib/models/Profile";
  import { onMount } from "svelte";
  import { fetchProfiles } from "$lib/ao/relay";

  export let title = "You might like";
  export let addresses: Array<string> = [];
  let profiles: Array<Profile> = [];

  onMount(async () => {
    profiles = await fetchProfiles(addresses);
    console.log(`we got ${profiles.length} profiles`)
  });
</script>

{#if profiles.length > 0}
  <div class="w-full h-full">
    <Card.Root
      data-x-chunk-name="UserList"
      data-x-chunk-description="A card showing a list of users."
      class="border-border rounded p-0 min-w-[280px]"
    >
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content class="w-full">
        <div
          class="grid gap-8 max-h-[80vh] overflow-y-auto scrollable-element pr-3"
        >
          {#each profiles as profile}
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

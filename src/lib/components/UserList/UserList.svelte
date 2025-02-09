<script lang="ts">
  import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { usersProfile } from "$lib/stores/users-profile.store";
  import { currentUser } from "$lib/stores/current-user.store";
  import type { Profile } from "$lib/models/Profile";
  import { onMount } from "svelte";

  const ITEMS_PER_PAGE = 10;
  let currentPage = 0;
  let profiles: Profile[] = [];
  let containerRef: HTMLDivElement;
  let loading = false;
  let hasMore = true;

  usersProfile.subscribe((value) => {
    profiles = Array.from(value.values());
  });

  $: usersProfile.isLoading.subscribe((value) => {
    loading = value;
  });

  $: usersProfile.hasMore.subscribe((value) => {
    hasMore = value;
  });

  onMount(() => {
    loadInitialProfiles();
  });

  async function loadInitialProfiles() {
    await usersProfile.fetchProfiles(currentPage, ITEMS_PER_PAGE);
  }

  async function loadMoreProfiles() {
    if (loading || !hasMore) return;
    
    currentPage++;
    await usersProfile.fetchProfiles(currentPage, ITEMS_PER_PAGE);
  }

  function handleScroll(event: Event) {
    const target = event.target as HTMLDivElement;
    const threshold = 100; // pixels from bottom to trigger load
    
    if (
      target.scrollHeight - (target.scrollTop + target.clientHeight) < threshold &&
      !loading &&
      hasMore
    ) {
      loadMoreProfiles();
    }
  }
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
          bind:this={containerRef}
          on:scroll={handleScroll}
          class="grid gap-6 lg:gap-8 max-h-[60vh] lg:max-h-[80vh] overflow-y-auto scrollable-element pr-2 lg:pr-3"
        >
          {#each profiles as profile}
            {#if profile.address !== $currentUser.address}
              <ProfileCard {profile} />
            {/if}
          {/each}
          
          {#if loading}
            <div class="flex justify-center p-4">
              <div class="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
            </div>
          {/if}
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
<script lang="ts">
  import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { usersProfile } from "$lib/stores/users-profile.store";

  let title = "You might like";
</script>

{#if $usersProfile.size > 0}
  <div class="w-full h-full">
    <Card.Root
      data-x-chunk-name="UserList"
      data-x-chunk-description="A card showing a list of users."
      class="border-border rounded p-0 max-w-[380px] min-w-[280px]"
    >
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content class="w-full">
        <div
          class="grid gap-8 max-h-[80vh] overflow-y-auto scrollable-element pr-3 w-full max-w-full"
        >
          {#each $usersProfile.values() as profile}
            <ProfileCard {profile} />
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

<script lang="ts">
  import { currentUser } from "$lib/stores/current-user.store";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { House, MessagesSquare, User, UserRound } from "lucide-svelte";
  import { link, location } from "svelte-spa-router";
</script>

{#if $isMobile}
  <nav
    class="sticky bottom-0 border-t border-gray-800 w-full text-white flex justify-evenly py-3 bg-background"
  >
    <a href="/feed" use:link
      ><House
        class={$location === "/feed" ? "" : "text-muted-foreground"}
        size={28}
      /></a
    >

    <a href="/profile/{$currentUser.address}" use:link
      ><User
        class={$location === `/profile/${$currentUser.address}`
          ? ""
          : "text-muted-foreground"}
        size={28}
      /></a
    >

    <a href="/messages" use:link
      ><MessagesSquare
        class={$location === "/messages" ? "" : "text-muted-foreground"}
        size={28}
      /></a
    >
  </nav>
{/if}

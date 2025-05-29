<script lang="ts">
  import { currentUser } from "$lib/services/CurrentUser";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { House, MessagesSquare, User, TestTube, Search } from "lucide-svelte";
  import { link, location } from "svelte-spa-router";
</script>

{#if $isMobile}
  <nav
    class="sticky bottom-0 border-t border-border w-full flex justify-evenly py-3 bg-background/95 backdrop-blur-md shadow-lg"
  >
    <a href="/" use:link
      ><House
        class={$location === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}
        size={28}
      /></a
    >

    <a href="/search" use:link
      ><Search
        class={$location === "/search" ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}
        size={28}
      /></a
    >

    <a href="/messages" use:link
      ><MessagesSquare
        class={$location === "/messages" ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}
        size={28}
      /></a
    >

    <a href="/collections" use:link
      ><TestTube
        class={$location === "/collections" ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}
        size={28}
      /></a
    >

    <a href="/profile/{$currentUser?.address}" use:link
      ><User
        class={$location === `/profile/${$currentUser?.address}`
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground transition-colors"}
        size={28}
      /></a
    >
  </nav>
{/if}
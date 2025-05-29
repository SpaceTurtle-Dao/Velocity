<script lang="ts">
  import { currentUser } from "$lib/services/CurrentUser";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { House, MessagesSquare, User, TestTube, Search } from "lucide-svelte";
  import { link, location } from "svelte-spa-router";
</script>

{#if $isMobile}
  <nav
    class="sticky bottom-0 border-t border-gray-300 dark:border-gray-800 w-full text-gray-700 dark:text-white flex justify-evenly py-3 bg-white dark:bg-background shadow-lg"
  >
    <a href="/" use:link
      ><House
        class={$location === "/" ? "text-blue-600 dark:text-white" : "text-gray-500 dark:text-muted-foreground"}
        size={28}
      /></a
    >

    <a href="/search" use:link
      ><Search
        class={$location === "/search" ? "text-blue-600 dark:text-white" : "text-gray-500 dark:text-muted-foreground"}
        size={28}
      /></a
    >

    <a href="/messages" use:link
      ><MessagesSquare
        class={$location === "/messages" ? "text-blue-600 dark:text-white" : "text-gray-500 dark:text-muted-foreground"}
        size={28}
      /></a
    >

    <a href="/collections" use:link
      ><TestTube
        class={$location === "/collections" ? "text-blue-600 dark:text-white" : "text-gray-500 dark:text-muted-foreground"}
        size={28}
      /></a
    >

    <a href="/profile/{$currentUser?.address}" use:link
      ><User
        class={$location === `/profile/${$currentUser?.address}`
          ? "text-blue-600 dark:text-white"
          : "text-gray-500 dark:text-muted-foreground"}
        size={28}
      /></a
    >
  </nav>
{/if}
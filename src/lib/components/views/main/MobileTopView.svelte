<script lang="ts">
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { currentUser } from "$lib/stores/current-user.store";
  import Logo from "../../../../assets/Logo2.png";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
  // import { onMount, onDestroy } from "svelte";

  // onMount(() => {
  //   window.addEventListener("scroll", handleScroll, true);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // });

  let opacity = "opacity-100";
</script>

<!--For Making opacity of CreatePostModal dynamic -->
<svelte:window
  on:scroll|capture={() => {
    opacity = "opacity-10";
  }}
  on:scrollend|capture={(event) => {
    opacity = "opacity-25";
  }}
/>

{#if $isMobile}
  <div class="px-4 py-2 flex justify-between border-b border-gray-800">
    <ProfilePicture
      size="sm"
      src={$currentUser.picture}
      name={$currentUser.name}
    />

    <img src={Logo} class="size-8" alt="velocity logo" />

    <div class="size-8"></div>
  </div>

  <!--For Making opacity of CreatePostModal dynamic -->
  <div
    class="rounded-full fixed bottom-16 right-6 z-50 {opacity} transition-opacity duration-400 ease-in-out"
    on:touchstart|capture={() => {
      opacity = "opacity-100";
    }}
    on:mouseenter={() => {
      opacity = "opacity-100";
    }}
    tabindex="0"
    role="button"
  >
    <CreatePostModal />
  </div>
{/if}

<script>
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { currentUser } from "$lib/stores/current-user.store";
  import Logo from "../../../../assets/Logo2.png";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
</script>

{#if $isMobile}
  <div class="px-4 py-2 flex justify-between">
    <ProfilePicture
      size="sm"
      src={$currentUser.picture}
      name={$currentUser.name}
    />

    <img src={Logo} class="size-8" alt="velocity logo" />

    <div class="size-8"></div>
  </div>

  <CreatePostModal />
{/if}

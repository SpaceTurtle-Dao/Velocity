<script lang="ts">
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { currentUser } from "$lib/stores/current-user.store";
  import Logo from "../../../../assets/Logo2.png";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
  import DisconnectWallet from "$lib/components/DisconnectWallet/DisconnectWallet.svelte";

  let opacity = "opacity-100";
  let showDisconnect = false;

  function toggleDisconnect() {
    showDisconnect = !showDisconnect;
  }

  // Close menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      showDisconnect = false;
    }
  }
</script>

<svelte:window
  on:scroll|capture={() => {
    opacity = "opacity-10";
  }}
  on:scrollend|capture={() => {
    opacity = "opacity-25";
  }}
  on:click={handleClickOutside}
/>

{#if $isMobile}
  <div class="px-4 py-2 flex justify-between border-b border-gray-800 relative">
    <!-- Profile picture with click handler -->
    <div class="profile-menu relative">
      <button 
        on:click={toggleDisconnect}
        class="focus:outline-none"
      >
        <ProfilePicture
          size="sm"
          src={$currentUser.picture}
          name={$currentUser.name}
        />
      </button>

      <!-- Circular menu that appears when profile is clicked -->
      {#if showDisconnect}
        <div 
          class="absolute top-0 left-0"
        >
          <div class="p-2">
            <DisconnectWallet />
          </div>
        </div>
      {/if}
    </div>

    <img src={Logo} class="size-8" alt="velocity logo" />

    <div class="size-8"></div>
  </div>

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
<script lang="ts">
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import Logo from "../../../../assets/Logo2.png";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
  import { writable } from "svelte/store";
  import { currentUser } from "$lib/services/userService"; // Make sure to import your address store
  import { walletService } from "$lib/services/walletService";

  let opacity = "opacity-100";
  let showDisconnect = false;

  async function handleDisconnect() {
    try {
      // Disconnect the wallet
      await walletService.disconnectWallet();

      // This will clear the stores
      const { subscribe, set } = writable();
      set(undefined);

      // Reset location and force a clean state
      window.location.href = "/";
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
    showDisconnect = false;
  }

  function toggleDisconnect() {
    showDisconnect = !showDisconnect;
  }

  // Close menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".profile-menu")) {
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
  <div class="px-4 py-2 flex justify-between border-b border-gray-800">
    <div class="profile-menu relative">
      <button on:click={toggleDisconnect} class="focus:outline-none">
        {#if $currentUser}
          <!--{#await profileService.get($currentUser.address) then profile}
            <ProfilePicture
              size="sm"
              src={profile.thumbnail}
              name={profile.userName}
            />
          {/await}-->
        {/if}
      </button>

      {#if showDisconnect}
        <div class="absolute top-full left-0 mt-2 z-50">
          <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-40">
            <button
              on:click={handleDisconnect}
              class="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2 transition-colors duration-150"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      {/if}
    </div>

    <img src={Logo} class="size-8" alt="velocity logo" />

    <div class="size-8"></div>
  </div>

  <div
    class="rounded-full size-14 fixed bottom-32 right-6 z-50 {opacity} transition-opacity duration-400 ease-in-out"
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

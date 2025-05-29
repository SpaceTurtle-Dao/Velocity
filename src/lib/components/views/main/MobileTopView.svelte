<script lang="ts">
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import Logo from "../../../../assets/Logo2.png";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
  import { currentUser } from "$lib/services/CurrentUser";
  import { walletService } from "$lib/services/walletService";
  import { Loader } from "lucide-svelte";
  import Connect from "$lib/components/wallet/connect.svelte";
  import CreateProfile from "../profile/CreateProfile.svelte";
  import { onMount } from "svelte";
  import { postService } from "$lib/services/postService";
  import { toUrl } from "$lib/constants";

  let opacity = "opacity-100";
  let showDisconnect = false;
  let loader = false;
  let isLoadingProfile = false;
  let currentPath = "";

  onMount(() => {
    walletService.isConnected();
    
    // Track route changes
    currentPath = window.location.hash;
    
    // Listen for hash changes
    const handleHashChange = () => {
      currentPath = window.location.hash;
    };
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  });

  walletService.subscribe((address) => {
    if (!address) return;
    isLoadingProfile = true;
    currentUser.setup(address).then(() => {
      loader = false;
      isLoadingProfile = false;
    }).catch(() => {
      isLoadingProfile = false;
    });
  });

  addEventListener("walletSwitch", async (e) => {
    console.log(e);
    //@ts-ignore
    const { address } = e.detail;
    postService.delete();
    isLoadingProfile = true;
    try {
      await currentUser.setup(address);
    } finally {
      isLoadingProfile = false;
    }
  });

  async function handleDisconnect() {
    try {
      // Disconnect the wallet
      await walletService.disconnectWallet();
      
      // Clear the current user store
      currentUser.set(undefined);

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

  // Check if current route is a profile page
  $: isProfilePage = currentPath.includes('#/profile/');
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
      <button 
        on:click={toggleDisconnect} 
        class="focus:outline-none"
        aria-expanded={showDisconnect}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {#if $currentUser}
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-white">
              {#if $currentUser.profile.thumbnail}
                <ProfilePicture
                  src={toUrl($currentUser.profile.thumbnail)}
                  name={$currentUser.profile.userName}
                />
              {:else}
                <ProfilePicture src="" name={$currentUser.profile.userName} />
              {/if}
            </span>
          </div>
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

  {#if !isProfilePage && !$currentUser && !$walletService}
    <div class="fixed inset-0 flex items-center justify-center z-40 bg-background/50 backdrop-blur-sm">
      <div class="bg-background border border-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <img src={Logo} class="w-16 h-16 mx-auto mb-4" alt="velocity logo" />
        <h2 class="text-xl font-semibold text-white mb-2">Welcome to Velocity</h2>
        <p class="text-gray-400 mb-6">Connect your wallet to get started</p>
        
        {#if loader}
          <div class="flex items-center justify-center">
            <Loader class="animate-spin w-8 h-8 text-primary" />
          </div>
        {:else}
          <Connect {loader} />
        {/if}
      </div>
    </div>
  {:else if !isProfilePage && $walletService && !$currentUser}
    <div class="fixed inset-0 flex items-center justify-center z-40 bg-background/50 backdrop-blur-sm">
      <div class="bg-background border border-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {#if isLoadingProfile}
          <img src={Logo} class="w-16 h-16 mx-auto mb-4" alt="velocity logo" />
          <h2 class="text-xl font-semibold text-white mb-2">Loading Profile</h2>
          <p class="text-gray-400 mb-6">Searching for your profile...</p>
          <div class="flex items-center justify-center">
            <Loader class="animate-spin w-8 h-8 text-primary" />
          </div>
        {:else}
          <CreateProfile />
        {/if}
      </div>
    </div>
  {/if}

  {#if $currentUser}
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
{/if}
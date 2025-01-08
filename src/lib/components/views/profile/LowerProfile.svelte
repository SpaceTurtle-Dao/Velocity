<script lang="ts">
  import { onMount } from "svelte";
  import { MoreHorizontal } from "lucide-svelte";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import DisconnectButton from "$lib/components/DisconnectWallet/DisconnectWallet.svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import { addressStore } from "$lib/stores/address.store";
  import { writable } from "svelte/store";

  let isMenuOpen = false;
  let menuRef: HTMLDivElement;

  // Function to format Arweave transaction URLs
  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  async function handleDisconnect() {
    try {
      // Disconnect the wallet
      await addressStore.disconnectWallet();
      
      // Clear all relevant stores
      const { subscribe, set } = writable();
      set(undefined);
                  
      // Reset location and force a clean state
      window.location.href = '/';
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }

  // Close menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (menuRef && !menuRef.contains(event.target as Node)) {
      isMenuOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

{#if $currentUser}
  <div class="relative" bind:this={menuRef}>
    <button 
      on:click={toggleMenu}
      class="flex items-center space-x-4 focus:outline-none"
    >
      <ProfilePicture src={$currentUser.picture} name={$currentUser.name} />
      <div class="flex-grow text-left">
        <p class="font-semibold text-white">{$currentUser.name}</p>
        <p class="text-sm text-white">@{$currentUser.display_name}</p>
      </div>
      <MoreHorizontal class="w-5 h-5 text-white" />
    </button>

    {#if isMenuOpen}
          <DisconnectButton />
    {/if}
  </div>
{/if}
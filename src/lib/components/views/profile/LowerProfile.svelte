<script lang="ts">
  import { onMount } from "svelte";
  import { MoreHorizontal } from "lucide-svelte";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import DisconnectButton from "$lib/components/DisconnectWallet/DisconnectWallet.svelte";
  import { currentUser } from "$lib/stores/currentUser.store";
  import { writable } from "svelte/store";
  import { profileService } from "$lib/services/ProfileService";
  import type { Profile } from "$lib/models/Profile";
    import type { Zone } from "$lib/models/Zone";
    import { profileRegistryService } from "$lib/services/ProfileRegistryService";

  let isMenuOpen = false;
  let menuRef: HTMLDivElement;

  let profile: Zone;

  profileRegistryService.subscribe((zones) => {
    if ($currentUser && zones.has($currentUser.address)) {
      profile = zones.get($currentUser.address)!;
    }
  });

  function toUrl(tx: string) {
    return "https://arweave.net/" + tx;
  }

  async function handleDisconnect() {
    try {
      await currentUser.disconnectWallet();

      const { subscribe, set } = writable();
      set(undefined);

      window.location.href = "/";
    } catch (error) {
      console.log("Error disconnecting wallet:", error);
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (menuRef && !menuRef.contains(event.target as Node)) {
      isMenuOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

{#if profile}
  <div class="relative" bind:this={menuRef}>
    <button
      on:click={toggleMenu}
      class="flex items-center space-x-4 focus:outline-none"
    >
      {#if profile.spec.thumbnail}
        <ProfilePicture
          src={toUrl(profile.spec.thumbnail)}
          name={profile.spec.userName}
        />
      {:else}
        <ProfilePicture src="" name={profile.spec.userName} />
      {/if}
      <div class="flex-grow text-left">
        <p class="font-semibold text-white">{profile.spec.displayName}</p>
        <p class="text-sm text-white">@{profile.spec.userName}</p>
      </div>
      <MoreHorizontal class="w-5 h-5 text-white" />
    </button>

    {#if isMenuOpen}
      <DisconnectButton />
    {/if}
  </div>
{/if}

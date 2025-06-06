<script lang="ts">
  import { onMount } from "svelte";
  import { MoreHorizontal } from "lucide-svelte";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import DisconnectButton from "$lib/components/DisconnectWallet/DisconnectWallet.svelte";
  import { currentUser } from "$lib/services/CurrentUser";
  import { writable } from "svelte/store";
  import { profileService } from "$lib/services/ProfileService";
  import type { Profile } from "$lib/models/Profile";
  import { walletService } from "$lib/services/walletService";
  import { toUrl } from "$lib/constants";

  let isMenuOpen = false;
  let menuRef: HTMLDivElement;

  export let profile: Profile;

  profileService.subscribe((profiles) => {
    if ($currentUser && profiles.has($currentUser.address)) {
      profile = profiles.get($currentUser.address)!;
    }
  });

  async function handleDisconnect() {
    try {
      await walletService.disconnectWallet();

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
      {#if profile.thumbnail}
        <ProfilePicture
          src={toUrl(profile.thumbnail)}
          name={profile.userName}
        />
      {:else}
        <ProfilePicture src="" name={profile.userName} />
      {/if}
      <div class="flex-grow text-left">
        <p class="font-semibold text-foreground">{profile.displayName}</p>
        <p class="text-sm text-muted-foreground">@{profile.userName}</p>
      </div>
      <MoreHorizontal class="w-5 h-5 text-muted-foreground" />
    </button>

    {#if isMenuOpen}
      <DisconnectButton />
    {/if}
  </div>
{/if}
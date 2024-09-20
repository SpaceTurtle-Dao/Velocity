<script lang="ts">
  import { onMount } from "svelte";
  import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
  import { MoreHorizontal } from "lucide-svelte";
  import { currentUser } from "../../../../stores/profile.store";
  import ConnectWalletButton from "$lib/components/views/wallet/wallet.svelte";
  import { navigate } from "svelte-routing";
  import { profileFromEvent, type Profile, type UserInfo } from "$lib/models/Profile";

  let userInfo: UserInfo;
  let userProfile: Profile;
  let isConnected = false;
  let isWalletConnected = false;

  // Check if the wallet is connected on mount
  onMount(async () => {
    await checkWalletConnection();
  });

  // Function to format Arweave transaction URLs
  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  // Subscribe to the current user store
  currentUser.subscribe((value) => {
    if (value){
      userInfo = value;
      userProfile = profileFromEvent(userInfo.Profile)
    }
  });

  // Function to check wallet connection status
  async function checkWalletConnection() {
    // @ts-ignore
    if (window.arweaveWallet) {
      try {
        // @ts-ignore
        const address = await window.arweaveWallet.getActiveAddress();
        if (address) {
          isConnected = true;
          isWalletConnected = true; // Mark wallet as connected
          await fetchProfile();
        }
      } catch (error) {
        console.error("Failed to get active address:", error);
      }
    }
  }

  // Function to fetch the user's profile
  async function fetchProfile() {
    if (!userProfile) {
      navigate("/CreateProfile", { replace: true });
    }
  }
</script>

<!-- UI Logic -->
{#if !isWalletConnected}
  <!-- Show Connect Wallet Button if not connected -->
  <ConnectWalletButton />
{:else if !isConnected}
  <!-- Redirect to CreateProfile if connected but no profile exists -->
  <p>Redirecting to create profile...</p>
{:else}
  {#if userInfo}
  <!-- Show Profile Info if connected and profile exists -->
  <button class="flex items-center space-x-4">
    <Avatar class="h-12 w-12 ring-4 ring-primary">
      <AvatarImage src={toUrl(userProfile.picture)} alt={userProfile.name} />
      <AvatarFallback>{userProfile.name}</AvatarFallback>
    </Avatar>
    <div class="flex-grow text-left">
      <p class="font-semibold text-white">{userProfile.name}</p>
      <p class="text-sm text-white">@{userInfo.Profile.pubkey.slice(0, 12)}</p>
    </div>
    <MoreHorizontal class="w-5 h-5 text-white" />
  </button>
  {/if}
{/if}

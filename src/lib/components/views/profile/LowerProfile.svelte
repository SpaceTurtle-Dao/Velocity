<script lang="ts">
  import { onMount } from "svelte";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  import { MoreHorizontal } from "lucide-svelte";
  import { currentUser } from "$lib/stores/profile.store";
  import ConnectWalletButton from "$lib/components/wallet/wallet.svelte";
  import { navigate } from "svelte-routing";
  import {
    profileFromEvent,
    type Profile  } from "$lib/models/Profile";
  import CreateProfile from "./CreateProfile.svelte";

  let userProfile: Profile;
  let isConnected = false;

;
  // Function to format Arweave transaction URLs
  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  // Subscribe to the current user store
  currentUser.subscribe((value) => {
    if (value) {
      console.log("Got user")
      console.log(value)
      userProfile = value;
    }
  });


</script>

{#if userProfile}
  <button class="flex items-center space-x-4">
    {#if userProfile.picture}
      <Avatar class="h-12 w-12">
        <AvatarImage src={userProfile.picture} alt={userProfile.name} />
        <AvatarFallback>{userProfile.name}</AvatarFallback>
      </Avatar>
    {/if}
    <div class="flex-grow text-left">
      <p class="font-semibold text-white">{userProfile.name}</p>
      <p class="text-sm text-white">@{userProfile.display_name}</p>
    </div>
    <MoreHorizontal class="w-5 h-5 text-white" />
  </button>
{/if}

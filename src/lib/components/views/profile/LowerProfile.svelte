<script lang="ts">
  import { onMount } from "svelte";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { MoreHorizontal } from "lucide-svelte";
  import ConnectWalletButton from "$lib/components/wallet/wallet.svelte";
  import { navigate } from "svelte-routing";
  import { profileFromEvent, type Profile } from "$lib/models/Profile";
  import CreateProfile from "./CreateProfile.svelte";
  import { currentUser } from "$lib/stores/current-user.store";

  // Function to format Arweave transaction URLs
  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }
</script>

{#if $currentUser}
  <button class="flex items-center space-x-4">
    {#if $currentUser.picture}
      <Avatar class="h-12 w-12">
        <AvatarImage src={$currentUser.picture} alt={$currentUser.name} />
        <AvatarFallback>{$currentUser.name}</AvatarFallback>
      </Avatar>
    {/if}
    <div class="flex-grow text-left">
      <p class="font-semibold text-white">{$currentUser.name}</p>
      <p class="text-sm text-white">@{$currentUser.display_name}</p>
    </div>
    <MoreHorizontal class="w-5 h-5 text-white" />
  </button>
{/if}

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
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";

  // Function to format Arweave transaction URLs
  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }
</script>

{#if $currentUser}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <button class="flex items-center space-x-4">
        <ProfilePicture src={$currentUser.picture} name={$currentUser.name} />
        <div class="flex-grow text-left">
          <p class="font-semibold text-white">{$currentUser.name}</p>
          <p class="text-sm text-white">@{$currentUser.display_name}</p>
        </div>
        <MoreHorizontal class="w-5 h-5 text-white" />
      </button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>Log out</DropdownMenu.Label>
        <!-- <DropdownMenu.Separator />
              <DropdownMenu.Item>Profile</DropdownMenu.Item>
              <DropdownMenu.Item>Billing</DropdownMenu.Item>
              <DropdownMenu.Item>Team</DropdownMenu.Item>
              <DropdownMenu.Item>Subscription</DropdownMenu.Item> -->
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/if}

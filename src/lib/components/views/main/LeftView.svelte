<script lang="ts">
  import { link } from "svelte-spa-router";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
  import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
  import Logo from "../../../../assets/Logo2.png";
  import {
    Home as HomeIcon,
    User,
    MoreHorizontal,
    Mail,
    Search,
    TestTube,
  } from "lucide-svelte";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { currentUser } from "$lib/stores/currentUser.store";
  import { Loader } from "lucide-svelte";
  import Connect from "$lib/components/wallet/connect.svelte";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import CreateProfile from "../profile/CreateProfile.svelte";
  import type { Zone } from "$lib/models/Zone";
  import { onMount } from "svelte";
  import { HUB_REGISTRY_ID } from "$lib/constants";

  let loader = false;
  let zone: Zone;

  hubRegistryService.subscribe((zones) => {
    if ($currentUser.address && zones.has($currentUser.address)) {
      zone = zones.get($currentUser.address)!;
    }
  });

  let menuItems = [
    { icon: HomeIcon, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: TestTube, label: "Collections", href: "/collections" },
  ];

  function menuItems2() {
    return [
      { icon: HomeIcon, label: "Home", href: "/" },
      { icon: Search, label: "Search", href: "/search" },
      {
        icon: User,
        label: "Profile",
        href: `/profile/${$currentUser.address}`,
      },
      { icon: Mail, label: "Messages", href: "/messages" },
      { icon: TestTube, label: "Collections", href: "/collections" },
    ];
  }

  onMount(() => {
    if ($currentUser.address) {
      hubRegistryService.getZoneById(HUB_REGISTRY_ID(), $currentUser.address);
    }
  });

</script>

{#if !$isMobile}
  <div class="flex p-4 lg:w-1/4 justify-start lg:justify-end">
    <div class="space-y-8 p-4">
      <nav>
        <ul class="space-y-3 overflow-hidden flex flex-col">
          <li>
            <img class="w-10 h-10" src={Logo} alt="Logo" />
          </li>
          {#if $currentUser.address}
            {#each menuItems2() as item}
              <li>
                <a
                  href={item.href}
                  use:link
                  class="flex items-center p-2 px-2 rounded-full hover:bg-background-700 transition-colors duration-200"
                >
                  <svelte:component
                    this={item.icon}
                    class="w-6 h-6 mr-4 text-primary"
                  />
                  <span class="text-lg font-medium text-primary"
                    >{item.label}</span
                  >
                </a>
              </li>
            {/each}
          {:else}
            {#each menuItems as item}
              <li>
                <a
                  href={item.href}
                  use:link
                  class="flex items-center p-2 px-2 rounded-full hover:bg-background-700 transition-colors duration-200"
                >
                  <svelte:component
                    this={item.icon}
                    class="w-6 h-6 mr-4 text-primary"
                  />
                  <span class="text-lg font-medium text-primary"
                    >{item.label}</span
                  >
                </a>
              </li>
            {/each}
          {/if}
          <li>
            <div
              class="flex items-center p-2 px-5 rounded-full hover:bg-background-700 transition-colors duration-200"
            >
              <MoreHorizontal class="w-6 h-6 mr-4 text-primary" />
              <span class="text-lg font-medium text-primary">More</span>
            </div>
          </li>
        </ul>
      </nav>
      {#if $currentUser.address}
        {#if zone}
          <CreatePostModal />
        {:else}
          <CreateProfile />
        {/if}
      {:else}
        <div class="mt-8 flex flex-col items-center justify-center">
          {#if loader}
            <Loader class="animate-spin w-12 h-12" />
          {:else}
            <Connect {loader} />
          {/if}
        </div>
      {/if}
      <div class="p-4">
        <LowerProfile />
      </div>
    </div>
  </div>
{/if}

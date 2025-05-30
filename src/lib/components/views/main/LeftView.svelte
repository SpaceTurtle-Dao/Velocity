<script lang="ts">
  import { link, push } from "svelte-spa-router";
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
  import { currentUser } from "$lib/services/CurrentUser";
  import { Loader } from "lucide-svelte";
  import Connect from "$lib/components/wallet/connect.svelte";
  import CreateProfile from "../profile/CreateProfile.svelte";
  import { onMount } from "svelte";
  import { walletService } from "$lib/services/walletService";
  import { postService } from "$lib/services/postService";
    import { PERMISSIONS } from "$lib/constants/wallet.constants";

  let loader = false;
  let address: string;
  let isLoadingProfile = false;

  let menuItems = [
    { icon: HomeIcon, label: "Home", href: "/" },
    // { icon: Search, label: "Search", href: "/search" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: TestTube, label: "Collections", href: "/collections" },
  ];

  function menuItems2() {
    return [
      { icon: HomeIcon, label: "Home", href: "/" },
      // { icon: Search, label: "Search", href: "/search" },
      {
        icon: User,
        label: "Profile",
        href: `/profile/${$currentUser?.address}`,
      },
      { icon: Mail, label: "Messages", href: "/messages" },
      { icon: TestTube, label: "Collections", href: "/collections" },
    ];
  }

  /*walletService.subscribe((address) => {
    console.log("got address")
    if (!address) return;
    isLoadingProfile = true;
    currentUser.setup(address).then(() => {
      loader = false;
      isLoadingProfile = false;
    }).catch(() => {
      isLoadingProfile = false;
    });
  });*/

  onMount(() => {
    walletService.isConnected();
  });

  // Export the loading states so MiddleView can access them
  export { isLoadingProfile, loader };
</script>

{#if !$isMobile}
  <div class="flex p-4 lg:w-1/4 justify-start lg:justify-end">
    <div class="space-y-8 p-4">
      <nav>
        <ul class="space-y-3 overflow-hidden flex flex-col">
          <li>
            <img class="w-10 h-10" src={Logo} alt="Logo" />
          </li>
          {#if $currentUser}
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
        </ul>
      </nav>
      {#if $currentUser}
        <CreatePostModal />
        <div class="p-4">
          <LowerProfile profile={$currentUser.profile} />
        </div>
      {:else if $walletService && !$currentUser}
        <!--{#if isLoadingProfile}
          <div
            class="mt-8 flex flex-col items-center justify-center text-center"
          >
            <Loader class="animate-spin w-12 h-12 text-primary mb-4" />
            <p class="text-gray-400">Loading Profile...</p>
          </div>
        {:else}
          <CreateProfile />
        {/if}-->
      {:else}
        <!--<div class="mt-8 flex flex-col items-center justify-center">
          {#if loader}
            <Loader class="animate-spin w-12 h-12" />
          {:else}
            <Connect {loader} />
          {/if}
        </div>-->
      {/if}
    </div>
  </div>
{/if}

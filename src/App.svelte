<script lang="ts">
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import { push, link } from "svelte-spa-router";
  import "./app.css";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
  import {
    Home as HomeIcon,
    User,
    MoreHorizontal,
    Plus,
    Mail,
  } from "lucide-svelte";
  import Profile from "$lib/components/views/profile/Profile.svelte";
  import { currentUser, isConnected, user } from "./lib/stores/profile.store";
  import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
  import RelayButtons from "$lib/components/relay/Relay.svelte";
  import CreateProfile from "$lib/components/views/profile/CreateProfile.svelte";
  import ConnectWalletButton from "$lib/components/wallet/wallet.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { fetchEvents, fetchFeed, info, relay, relays } from "$lib/ao/relay";
  import UserList from "$lib/components/UserList/UserList.svelte";
  import type { UserInfo } from "$lib/models/Profile";
  import { users } from "$lib/stores/main.store";
  import Feed from "$lib/components/views/feed/Feed.svelte";
  import IndividualProfile from "$lib/components/views/profile/IndividualProfile.svelte";
  import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
  import Spinner from "$lib/components/spinners/Spinner.svelte";

  let isCreatePostModalOpen = false;
  let isLoading = true;

  $: _isConnected = $isConnected;
  $: _currentUser = $currentUser;

  async function fetchPost() {
    if ($currentUser) {
      let filters = [{
        kinds: ["1"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
      }];
      let _filters = JSON.stringify(filters);
      await fetchFeed($currentUser.Process, _filters);
      await fetchEvents($currentUser.Process, _filters);
    }
  }

  async function checkWalletConnection() {
    if (window.arweaveWallet) {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        if (address) {
          isConnected.set(true);
          let _relay = await relay(address);
          if (_relay) {
            let _currentUser = await info(_relay);
            currentUser.set(_currentUser);
            user.set(_currentUser);
            await fetchPost();
            push('/feed');
          }
        }
      } catch (error) {
        console.error("Failed to get active address:", error);
        isConnected.set(false);
      }
    }
    isLoading = false;
  }

  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/feed" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Mail, label: "Messages", href: "/messages" },
  ];

  function toggleCreatePostModal() {
    isCreatePostModalOpen = !isCreatePostModalOpen;
  }

  const routes = {
    "/": LandingPage,
    "/feed": Feed,
    "/profile": Profile,
    "/messages": RelayButtons,
    "/profile/:process": IndividualProfile,
  };

  onMount(async () => {
    await checkWalletConnection();
  });

  function handleConnect() {
    checkWalletConnection();
  }
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-screen bg-background">
    <Spinner />
  </div>
{:else if !_isConnected}
  <LandingPage on:connect={handleConnect} />
{:else}
  <div class="bg-background h-screen">
    <div class="flex w-full bg-background justify-center">
      <div class="flex p-4 w-1/3 justify-end">
        <div class="space-y-8 p-4">
          <nav>
            <ul class="space-y-3">
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
                    <span class="text-lg font-medium text-primary">{item.label}</span>
                  </a>
                </li>
              {/each}
              <li>
                <button
                  on:click={toggleCreatePostModal}
                  class="flex items-center p-2 px-5 rounded-full hover:bg-background-700 transition-colors duration-200"
                >
                  <MoreHorizontal class="w-6 h-6 mr-4 text-primary" />
                  <span class="text-lg font-medium text-primary">More</span>
                </button>
              </li>
            </ul>
          </nav>
          {#if $currentUser == null || $currentUser == undefined}
            <CreateProfile />
          {:else}
            <CreatePostModal bind:isOpen={isCreatePostModalOpen} />
          {/if}
          {#if _currentUser}
            <div class="p-4">
              <LowerProfile />
            </div>
          {/if}
        </div>
      </div>
      <div class="overflow-y-scroll no-scrollbar h-screen w-1/3">
        <Router {routes} />
      </div>
      <div class="flex justify-start pt-10 pl-10 w-1/3">
        <UserList/>
      </div>
    </div>
  </div>
{/if}
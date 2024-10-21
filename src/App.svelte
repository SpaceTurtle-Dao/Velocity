<script lang="ts">
  import "./app.css";
  import { onMount } from "svelte";
  import {
    currentUser,
    isConnected,
    user,
    profileState,
    walletState,
    ProfileState,
    WalletState,
    aoconnect,
  } from "./lib/stores/profile.store";
  import Router from "svelte-spa-router";
  import { push, link } from "svelte-spa-router";
  import Feed from "$lib/components/views/feed/Feed.svelte";
  import Profile from "$lib/components/views/profile/Profile.svelte";
  import IndividualProfile from "$lib/components/views/profile/IndividualProfile.svelte";
  import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
  // import SideBar from "$lib/components/sidebar/SideBar.svelte";
  import UserList from "$lib/components/UserList/UserList.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton/index";
  import { info, relay, relays } from "$lib/ao/relay";
  import RelayButtons from "$lib/components/relay/Relay.svelte";
  import Navbar from "$lib/components/Navbar/Navbar.svelte";

  $: _walletState = $walletState;
  // $: _profileState = $profileState;
  // $: _currentUser = $currentUser;

  const routes = {
    // "/": LandingPage,
    "/": Feed,
    "/profile": Profile,
    "/messages": RelayButtons,
    "/profile/:process": IndividualProfile,
  };

  onMount(async () => {
    await aoconnect();
  });
</script>

<div class="bg-background h-screen">
  <div class="flex w-full bg-background justify-center">
    <!-- {#if} -->
    {#if _walletState == WalletState.Connected}
      <div class="flex p-3 w-1/5 justify-end">
        <Navbar />
      </div>
      <div class="overflow-y-scroll no-scrollbar h-screen w-1/2">
        <Router {routes} />
      </div>

      <div class="flex justify-start w-1/5">
        <UserList />
      </div>
    {:else if _walletState == WalletState.Disconnected}
      <LandingPage on:connect={aoconnect} />
    {/if}
  </div>
</div>

<!-- {#if $isLoading}
    <div class="flex items-center justify-center h-screen bg-background">
        <Spinner />
    </div>
{:else if !_isConnected}
{:else}{/if} -->

<!-- 

{#if isLoading}
  <div class="flex items-center justify-center h-screen bg-background">
    <Spinner />
  </div>
{:else if !_isConnected}
  <LandingPage on:connect={handleConnect} />
{:else}
  <div class="bg-background">
    <div class="flex w-full bg-background justify-center">
      <div class="flex p-4 w-1/3 justify-end">
        <div class="space-y-8 p-4">
          <nav>
            <ul class="space-y-3 overflow-hidden flex flex-col">
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
      <div class="h-screen w-1/3 overflow-auto scrollbar-hidden">
        <Router {routes} />
      </div>
      <div class="flex justify-start pt-10 pl-10 w-1/3">
        <UserList />
      </div>
    </div>
  </div>
{/if}

<style>
  .scrollbar-hidden {
    scrollbar-width: none;
  }
</style> -->

<script lang="ts">
  import { onMount } from "svelte";
  import { Router, Route } from "svelte-routing";
  import "./app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import UserProfile from "$lib/components/views/profile/UserProfile.svelte";
  import CreatePostModal from "$lib/components/CreateMeme.svelte";
  import Feed from "$lib/components/Feed.svelte";
  //import Explore from "$lib/components/views/explore/Explore.svelte";
  import ProfileCreation from "$lib/components/views/profile/CreateProfile.svelte";
  import {
    Home as HomeIcon,
    Search,
    Bell,
    User,
    MoreHorizontal,
    Plus,
    Zap, // New icon for Relay
    Edit,
    LayoutDashboard,
  } from "lucide-svelte";
  import RepliesPage from "$lib/components/RepliesPage.svelte";
  import Profile from "$lib/components/views/profile/Profile.svelte";
  import {
    currentUser,
    userRelay,
    isConnected,
  } from "./lib/stores/profile.store";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
  import RelayButtons from "$lib/components/Relay.svelte";
  import Dashboard from "$lib/components/views/dashboard/dashboard.svelte";
  import CreateProfile from "$lib/components/views/profile/CreateProfile.svelte";
  import ConnectWalletButton from "$lib/components/wallet.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { relay } from "$lib/ao/relay";
  export let url = "";

  let isCreatePostModalOpen = false;
  let _isConnected = false;
  let _relay: string = "";

  userRelay.subscribe((value) => {
    console.log("got relay");
    console.log(value);
    _relay = value;
  });

  isConnected.subscribe((value) => {
    _isConnected = value;
  });

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  // Function to check wallet connection status
  async function checkWalletConnection() {
    // @ts-ignore
    if (window.arweaveWallet) {
      try {
        // @ts-ignore
        const address = await window.arweaveWallet.getActiveAddress();
        if (address) {
          console.log(address);
          console.log(_isConnected);
          _isConnected = true;
          let _userRelay = await relay(address);
          if (_userRelay) {
            userRelay.set(_userRelay);
          }
        }
      } catch (error) {
        console.log(_isConnected);
        console.error("Failed to get active address:", error);
      }
    }
  }

  onMount(async () => {
    await checkWalletConnection();
  });

  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/feed" },
    //{ icon: Search, label: "Explore", href: "/explore" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Zap, label: "Relay", href: "/relay" },
  ];

  function toggleCreatePostModal() {
    isCreatePostModalOpen = !isCreatePostModalOpen;
  }

  //@ts-ignore
  async function handlePostSubmit(event) {
    console.log("New post submitted:", event.detail.content);
  }
</script>

<div class="bg-background h-screen">
  <Router {url}>
    <div class="flex justify-center w-full bg-background">
      <div class="flex flex-col space-y-10 p-4">
        <div class="space-y-4 pt-16">
          <nav>
            <ul class="space-y-2">
              {#each menuItems as item}
                <li>
                  <a
                    href={item.href}
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
              <li>
                <a
                  href={"/dash"}
                  class="flex items-center p-2 px-2 rounded-full hover:bg-background-700 transition-colors duration-200"
                >
                  <svelte:component
                    this={LayoutDashboard}
                    class="w-6 h-6 mr-4 text-primary"
                  />
                  <span class="text-lg font-medium text-primary">{"Dash"}</span>
                </a>
              </li>
            </ul>
          </nav>
          {#if !_isConnected}
            <ConnectWalletButton />
          {:else if _relay == null || _relay == undefined}
            <CreateProfile />
          {:else}
            <Button
              on:click={toggleCreatePostModal}
              class="w-44 h-12 bg-primary text-secondary rounded-full py-3 font-bold text-lg hover:bg-ring transition-colors duration-200 flex items-center justify-center"
            >
              <Plus class="w-5 h-5 mr-2" />
              Post
            </Button>
            <!-- svelte-ignore missing-declaration -->
          {/if}
        </div>
        {#if _relay}
          <div class="p-4">
            <LowerProfile />
          </div>
        {/if}
      </div>

      <div class="w-1/3">
        <Route path="/feed" component={Feed} />
        <Route path="/profile" component={Profile} />
        <Route path="/" component={Feed} />
        <!--<Route path="/explore" component={Explore} />-->
        <Route path="/UserProfile" component={UserProfile} />
        <Route path="/Feed" component={Feed} />
        <Route path="/dash" component={Dashboard} />
        <Route path="/Feed/:id" let:params>
          <RepliesPage memeId={params.id} />
        </Route>
        <Route path="/relay" component={RelayButtons} />
      </div>
    </div>
  </Router>
</div>

<CreatePostModal
  isOpen={isCreatePostModalOpen}
  on:close={toggleCreatePostModal}
  on:submit={handlePostSubmit}
/>

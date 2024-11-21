<script lang="ts">
  import { onMount } from "svelte";
  import { push, location } from "svelte-spa-router";
  import "./app.css";
  import { user } from "./lib/stores/profile.store";
  // import { info, relay } from "$lib/ao/relay";
  import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
  import Spinner from "$lib/components/spinners/Spinner.svelte";
  import Middle from "$lib/components/views/main/MiddleView.svelte";
  import Left from "$lib/components/views/main/LeftView.svelte";
  import Right from "$lib/components/views/main/RightView.svelte";
  import SignUp from "./lib/components/views/signup/SignUp.svelte";
  import { fetchEvents, fetchProfiles } from "$lib/ao/relay";
  import { addressStore } from "$lib/stores/address.store";
  import { currentUser } from "$lib/stores/current-user.store";
  import { isConnected } from "$lib/stores/is-connectec.store";

  let isLoading = true;
  // $: _isConnected = $isConnected;
  $: isSignUpRoute = $location === "/signup";

  // async function checkWalletConnection() {
  //   console.log("Checking wallet connection");
  //   console.log("Is Coneected", window.arweaveWallet);
  //   if (window.arweaveWallet) {
  //     try {
  //       const address = await window.arweaveWallet.getActiveAddress();
  //       console.log("Address", address);
  //       if (address) {
  //         isConnected.set(true);
  //         // let _relay = await relay(address);
  //         let profile = await fetchProfiles(address);

  //         currentUser.set(profile);
  //         users.set(profile);

  //         console.log("Profiles are", profile);
  //       } else {
  //         isConnected.set(false);
  //       }
  //     } catch (error) {
  //       console.error("Failed to get active address:", error);
  //       isConnected.set(false);
  //     }
  //   }
  //   isLoading = false;
  // }

  onMount(async () => {
    // await checkWalletConnection();

    await addressStore.sync();
  });

  let waitForUserFetch = true;

  addressStore.subscribe(async ({ address }) => {
    console.log(address);

    if (address) {
      await currentUser.fetch();
      waitForUserFetch = false;
    }

    isLoading = false;
  });

  function handleConnect() {
    // checkWalletConnection();
  }
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-screen bg-background">
    <div class="space-y-4">
      <Spinner />
      <p class="text-muted-foreground text-center animate-pulse">
        Connecting to wallet...
      </p>
    </div>
  </div>
{:else if !$isConnected || waitForUserFetch}
  <LandingPage on:connect={handleConnect} />
{:else}
  <div class="bg-background">
    <div class="flex w-full bg-background justify-center">
      <Left />
      <Middle />
      {#if $currentUser}
        <Right />
      {/if}
    </div>
  </div>
{/if}

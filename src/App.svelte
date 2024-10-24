<script lang="ts">
  import { onMount } from "svelte";
  import { push, link } from "svelte-spa-router";
  import "./app.css";
  import { currentUser, isConnected, user } from "./lib/stores/profile.store";
  import { info, relay } from "$lib/ao/relay";
  import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
  import Spinner from "$lib/components/spinners/Spinner.svelte";
  import Middle from "$lib/components/views/main/MiddleView.svelte";
  import Left from "$lib/components/views/main/LeftView.svelte";
  import Right from "$lib/components/views/main/RightView.svelte";

  let isLoading = true;

  $: _isConnected = $isConnected;

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
            push("/feed");
          }
        }
      } catch (error) {
        console.error("Failed to get active address:", error);
        isConnected.set(false);
      }
    }
    isLoading = false;
  }

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
  <div class="bg-background">
    <div class="flex w-full bg-background justify-center">
      <Left />
      <Middle />
      <Right />
    </div>
  </div>
{/if}


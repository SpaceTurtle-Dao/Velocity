<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import backgroundImage from '../../../../assets/Logo.png';
  import ConnectWalletButton from "$lib/components/wallet/wallet.svelte";
  import { isConnected } from "$lib/stores/profile.store";
  import { onMount } from "svelte";

  let connectionError = false;

  onMount(() => {
    const unsubscribe = isConnected.subscribe(value => {
      if (!value) {
        connectionError = true;
      }
    });

    return unsubscribe;
  });
</script>

<div class="flex h-screen bg-background text-foreground">
  <!-- Left side - Image and Text -->
  <div class="hidden lg:flex lg:w-1/2 relative">
    <div 
      class="absolute inset-0 bg-cover bg-center" 
      style="background-image: url('{backgroundImage}')"
    ></div>
    <div class="relative z-10 flex flex-col justify-between p-12">
      <div class="mt-auto">
        <blockquote class="text-lg">
          "Connect, share, and thrive in the decentralized social space with Velocity."
        </blockquote>
        <footer class="mt-2 text-sm text-muted-foreground">- Velocity User</footer>
      </div>
    </div>
  </div>

  <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-primary">Welcome to Velocity</h1>
        <p class="mt-2 text-xl text-muted-foreground">Your decentralized social hub on AO</p>
      </div>

      <div class="mt-8 flex flex-col items-center justify-center">
        <ConnectWalletButton buttonClass="items-center text-black w-3/4" />
        {#if connectionError}
          <p class="mt-4 text-red-500">Failed to connect. Please ensure you have the necessary permissions and try again.</p>
        {/if}
      </div>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        By connecting, you agree to our 
        <a href="#" class="font-medium text-primary hover:underline">Terms of Service</a>
        and 
        <a href="#" class="font-medium text-primary hover:underline">Privacy Policy</a>
      </p>
    </div>
  </div>
</div>
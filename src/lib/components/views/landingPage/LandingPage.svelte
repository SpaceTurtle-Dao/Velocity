<script lang="ts">
  import backgroundImage from "../../../../assets/Logo.png";
  import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
  import { addressStore } from "$lib/stores/address.store";
  import { isConnected } from "$lib/stores/is-connectec.store";
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { Loader } from "lucide-svelte";

  let loader = false;
</script>

<div class="flex h-screen bg-background text-foreground">
  <div class="hidden lg:flex lg:w-1/2 relative">
    <div
      class="absolute inset-0 bg-cover bg-center"
      style="background-image: url('{backgroundImage}')"
    ></div>
    <div class="relative z-10 flex flex-col justify-between p-12">
      <div class="mt-auto">
        <blockquote class="text-lg">
          "Connect, share, and thrive in the decentralized social space with
          Velocity."
        </blockquote>
        <footer class="mt-2 text-sm text-muted-foreground">
          - Velocity User
        </footer>
      </div>
    </div>
  </div>

  <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
    <div class="w-full max-w-md space-y-4"> <!-- Changed space-y-8 to space-y-4 -->
      {#if $isMobile}
        <div class="flex justify-center mb-4"> <!-- Changed mb-8 to mb-4 -->
          <img 
            src={backgroundImage} 
            alt="Velocity Logo" 
            class="w-40 h-40 object-contain"
          />
        </div>
      {/if}
      
      <div class="text-center">
        <h1 class="text-4xl font-bold text-primary">Welcome to Velocity Testnet</h1>
        <p class="mt-2 text-xl text-muted-foreground">
          Your decentralized social hub on AO
        </p>
      </div>

      <div class="mt-8 flex flex-col items-center justify-center">
        {#if $isConnected}
          <Loader class="animate-spin w-12 h-12" />
        {:else}
          <ButtonWithLoader
            {loader}
            class="w-3/4"
            on:click={async () => {
              (loader = true), await addressStore.connectWallet();
              loader = false;
            }}>Connect Wallet</ButtonWithLoader
          >
        {/if}
      </div>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        By connecting, you agree to our
        <a href="#" class="font-medium text-primary hover:underline"
          >Terms of Service</a
        >
        and
        <a href="#" class="font-medium text-primary hover:underline"
          >Privacy Policy</a
        >
      </p>
    </div>
  </div>
</div>
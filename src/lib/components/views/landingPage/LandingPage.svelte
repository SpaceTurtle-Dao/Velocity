<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import backgroundImage from "../../../../assets/Logo.png";
  import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
  import { addressStore } from "$lib/stores/address.store";
  import { isConnected } from "$lib/stores/is-connectec.store";
  import { Loader } from "lucide-svelte";

  let loader = false;
</script>

<div
  class="flex min-h-screen flex-col lg:flex-row bg-background text-foreground"
>
  <!-- Logo section for large screens -->
  <div class="hidden lg:flex lg:w-1/2 relative">
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('{backgroundImage}')"
    ></div>
    <div class="relative z-10 flex flex-col justify-between p-4 sm:p-8 lg:p-12">
      <div class="mt-auto backdrop-blur-sm bg-background/30 rounded-lg p-4">
        <blockquote class="text-base sm:text-lg md:text-xl font-medium italic">
          "Connect, share, and thrive in the decentralized social space with
          Velocity."
        </blockquote>
        <footer class="mt-2 text-sm sm:text-base text-muted-foreground">
          - Velocity User
        </footer>
      </div>
    </div>
  </div>

  <!-- Mobile and tablet layout -->
  <div class="lg:hidden flex flex-col min-h-screen">
    <!-- Upper half with logo -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div
        class="w-72 h-72 sm:w-96 sm:h-96 bg-cover bg-center bg-no-repeat rounded-xl shadow-lg"
        style="background-image: url('{backgroundImage}')"
      ></div>
    </div>

    <!-- Lower half with content -->
    <div
      class="flex-1 flex flex-col justify-start items-center p-4 sm:p-6 bg-background/50 backdrop-blur-sm rounded-t-3xl shadow-lg"
    >
      <div class="w-full max-w-md space-y-6">
        <div class="text-center space-y-2 sm:space-y-3">
          <h1
            class="text-3xl sm:text-4xl font-bold text-primary tracking-tight"
          >
            Welcome to Velocity
          </h1>
          <p class="text-lg sm:text-xl text-muted-foreground">
            Your decentralized social hub on AO
          </p>
        </div>

        <div class="flex flex-col items-center justify-center w-full">
          {#if $isConnected}
            <Loader class="animate-spin w-8 h-8 sm:w-10 sm:h-10" />
          {:else}
            <ButtonWithLoader
              {loader}
              class="w-full sm:w-3/4 text-sm sm:text-base py-2.5 sm:py-3"
              on:click={async () => {
                (loader = true), await addressStore.connectWallet();
                loader = false;
              }}>Connect Wallet</ButtonWithLoader
            >
          {/if}
        </div>

        <p class="text-center text-xs sm:text-sm text-muted-foreground px-4">
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

  <!-- Desktop content section -->
  <div class="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-5xl font-bold text-primary tracking-tight">
          Welcome to Velocity
        </h1>
        <p class="text-2xl text-muted-foreground">
          Your decentralized social hub on AO
        </p>
      </div>

      <div class="flex flex-col items-center justify-center w-full">
        {#if $isConnected}
          <Loader class="animate-spin w-12 h-12" />
        {:else}
          <ButtonWithLoader
            {loader}
            class="w-2/3 text-base py-3"
            on:click={async () => {
              (loader = true), await addressStore.connectWallet();
              loader = false;
            }}>Connect Wallet</ButtonWithLoader
          >
        {/if}
      </div>

      <p class="text-center text-base text-muted-foreground px-4">
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

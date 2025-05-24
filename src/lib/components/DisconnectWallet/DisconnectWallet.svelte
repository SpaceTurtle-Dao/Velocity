<script lang="ts">
  import { currentUser } from "$lib/services/CurrentUser";
  import { push } from "svelte-spa-router";
  import { writable } from "svelte/store";
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
    import { walletService } from "$lib/services/WalletService";

  
  async function handleDisconnect() {
    try {
      // Disconnect the wallet
      await walletService.disconnectWallet();
      
      // Clear all relevant stores
      const { subscribe, set } = writable();
      set(undefined);
                  
      // Reset location and force a clean state
      window.location.href = '/';
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }
</script>

<div class="px-2 py-1 w-full">
<ButtonWithLoader
    class="mt-4 group text-sm font-medium w-full px-4 h-10 rounded-lg text-red-500 
           hover:text-white hover:bg-red-500 transition-all duration-200 
           border border-red-200 hover:border-red-500 
           flex items-center justify-start gap-2 
           bg-white/5 backdrop-blur-sm"
    loaderClass="size-5"
    on:click={handleDisconnect}
>
  <div class="flex items-center gap-2 w-full">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
      />
    </svg>
    <span>Disconnect Wallet</span>
  </div>
</ButtonWithLoader>
</div>
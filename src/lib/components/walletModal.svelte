<script>
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let walletAddress = '';
  export let balance = 20.38; // To be replaced with actual logic for fetching balance
  
  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function depositWithdraw() {
    console.log('Deposit/Withdraw clicked');
  }

  function depositCollateral() {
    console.log('Deposit Collateral clicked');
  }
</script>

<div class="fixed top-16 sm:top-20 right-2 sm:right-4 md:right-6 z-50 w-[calc(100%-1rem)] sm:w-80 md:w-96 max-w-md" transition:fade={{ duration: 200 }}>
  <div class="bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white rounded-xl shadow-2xl border border-indigo-700 overflow-hidden">
    <div class="p-4 sm:p-6">
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <span class="text-lg sm:text-xl font-bold text-pink-400">GM, {walletAddress}</span>
        <button on:click={close} class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="flex justify-between mb-4 sm:mb-6 bg-gray-800 bg-opacity-50 rounded-lg p-3 sm:p-4">
        <div>
          <p class="text-xs text-gray-400 mb-1">Subacct. Value</p>
          <p class="text-base sm:text-lg font-semibold">$0.00</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-400 mb-1">Wallet Balance</p>
          <p class="text-base sm:text-lg font-semibold">${balance.toFixed(2)}</p>
        </div>
      </div>
      
      <button 
        on:click={depositWithdraw}
        class="w-full py-2 sm:py-3 mb-4 sm:mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-bold hover:opacity-90 transition-opacity transform hover:scale-105 duration-200 text-sm sm:text-base"
      >
        Deposit/Withdraw
      </button>
      
    </div>
  </div>
</div>
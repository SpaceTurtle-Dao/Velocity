<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDistanceToNow } from 'date-fns';
  import { ArrowUpRight, ArrowDownRight } from 'lucide-svelte';

  export let memeId: string;

  interface Swap {
    Recipient: string;
    TokenA: number;
    TokenB: number;
    IsBuy: boolean;
    Timestamp: number;
  }

  let swaps: Swap[] = [];

  onMount(async () => {
    try {
      // Replace this with your actual API call to fetch swaps
      swaps = await fetchSwaps(memeId);
    } catch (error) {
      console.error('Error fetching swaps:', error);
    }
  });

  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatTimestamp(timestamp: number): string {
    return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
  }
</script>

<div class="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
  <h2 class="text-2xl font-bold mb-4">Swap Transactions</h2>
  {#if swaps.length === 0}
    <p class="text-gray-500">No swap transactions found for this meme.</p>
  {:else}
    <div class="space-y-4">
      {#each swaps as swap}
        <div class="bg-gray-50 p-4 rounded-md flex items-center justify-between">
          <div>
            <p class="font-semibold">
              {swap.IsBuy ? 'Buy' : 'Sell'}
              {#if swap.IsBuy}
                <ArrowUpRight class="inline-block text-green-500 ml-1" size={18} />
              {:else}
                <ArrowDownRight class="inline-block text-red-500 ml-1" size={18} />
              {/if}
            </p>
            <p class="text-sm text-gray-600">Recipient: {formatAddress(swap.Recipient)}</p>
          </div>
          <div class="text-right">
            <p class="font-medium">
              {swap.TokenA} TokenA → {swap.TokenB} TokenB
            </p>
            <p class="text-xs text-gray-500">{formatTimestamp(swap.Timestamp)}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
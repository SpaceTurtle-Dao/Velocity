<script lang="ts">
  import { onMount } from "svelte";
  import { formatDistanceToNow } from "date-fns";
  import { ArrowUpRight, ArrowDownRight } from "lucide-svelte";
  import { fetchSwaps } from "$lib/ao/mememaker";
  import { swapsStore } from "../../stores/pool.store";
  import type { Swap } from "$lib/models/Swap";
  import { DECIMALS } from "$lib/constants";

  export let memeId: string;

  let swaps: Swap[] = [];

  onMount(async () => {
    try {
      // Replace this with your actual API call to fetch swaps
      await fetchSwaps(memeId);
    } catch (error) {
      console.error("Error fetching swaps:", error);
    }
  });

  swapsStore.subscribe((value) => {
    console.log("got swaps");
    swaps = value;
    console.log(swaps);
  });

  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "Just now";
  }
</script>

<div class="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
  <h2 class="text-2xl font-bold mb-4">Swap Transactions</h2>
  <div class="space-y-4">
    {#each swaps as swap}
      <div class="bg-gray-50 p-4 rounded-md flex items-center justify-between">
        <div>
          <p class="font-semibold">
            {swap.IsBuy ? "Buy" : "Sell"}
            {#if swap.IsBuy}
              <ArrowUpRight
                class="inline-block text-green-500 ml-1"
                size={18}
              />
            {:else}
              <ArrowDownRight
                class="inline-block text-red-500 ml-1"
                size={18}
              />
            {/if}
          </p>
          {#if swap.Recipient}
            <p class="text-sm text-gray-600">
              Recipient: {formatAddress(swap.Recipient)}
            </p>
          {/if}
        </div>
        <div class="text-right">
          <p class="font-medium">
            {(swap.TokenA / DECIMALS).toFixed(5)} TokenA → {(
              swap.TokenB / DECIMALS
            ).toFixed(5)} TokenB
          </p>
          <p class="text-xs text-gray-500">{formatTime(swap.Timestamp)}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

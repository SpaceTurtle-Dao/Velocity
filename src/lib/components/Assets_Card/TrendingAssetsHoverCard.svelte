<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card";
  import { Button } from "$lib/components/ui/button";
  import { Coins } from "lucide-svelte";
  import type { CollectionType } from '@permaweb/libs';
  import { onMount } from "svelte";
  import { formatDistanceToNow } from 'date-fns';

  export let collection: CollectionType;

  let formattedDate = '';
  
  onMount(() => {
    try {
      if (collection.dateCreated) {
        const date = new Date(Number(collection.dateCreated));
        formattedDate = formatDistanceToNow(date, { addSuffix: true });
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      formattedDate = 'Unknown date';
    }
  });

  function handleBuy(collectionId: string) {
    const url = `https://bazar.arweave.net/#/collection/${collectionId}/assets/`;
    window.open(url, '_blank');
  }

  function truncateAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }
</script>

<HoverCard.Root>
  <HoverCard.Trigger>
    <slot />
  </HoverCard.Trigger>
  <HoverCard.Content class="w-80" align="start">
    <div class="space-y-3">
      <!-- Banner image -->
      {#if collection.banner}
        <div class="w-full h-24 overflow-hidden rounded-md">
          <img 
            src={`https://arweave.net/${collection.banner}`} 
            alt="Collection Banner" 
            class="w-full h-full object-cover"
          />
        </div>
      {/if}

      <!-- Thumbnail and title -->
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          {#if collection.thumbnail}
            <img
              src={`https://arweave.net/${collection.thumbnail}`}
              alt={collection.title}
              class="w-12 h-12 rounded-md object-cover border border-border"
            />
          {:else}
            <div class="w-12 h-12 bg-background-600 rounded-md flex items-center justify-center border border-border">
              <Coins class="w-6 h-6 text-primary opacity-70" />
            </div>
          {/if}
        </div>
        
        <div class="flex-1">
          <h3 class="text-primary font-bold text-base leading-tight">{collection.title}</h3>
          <p class="text-muted-foreground text-xs mt-1">
            Created by: <span class="text-primary">{truncateAddress(collection.creator)}</span>
          </p>
          {#if formattedDate}
            <p class="text-muted-foreground text-xs">Created {formattedDate}</p>
          {/if}
        </div>
      </div>

      <!-- Description -->
      {#if collection.description}
        <p class="text-sm text-primary">{collection.description}</p>
      {/if}

      <!-- Collection ID -->
      <div class="text-xs text-muted-foreground">
        Collection ID: <span class="font-mono">{truncateAddress(collection.id)}</span>
      </div>

      <!-- Action button -->
      <div class="flex justify-end mt-2">
        <Button
          variant="default"
          size="sm"
          class="text-xs bg-primary hover:bg-primary/90"
          on:click={() => handleBuy(collection.id)}
        >
          View Collection
        </Button>
      </div>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
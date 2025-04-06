<script lang="ts">
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
  import { onMount } from "svelte";
  import { addressStore } from "$lib/stores/address.store";
  import { hubService } from "$lib/services/HubService";
  import { registryService } from "$lib/services/RegistryService";
  import type { Hub } from "$lib/models/Hub";

  export let address: string;
  let hub: Hub;
  let isSubscribed: boolean;
  let loader = false;

  async function unsubscribe() {
    loader = true;
    let temp = hub;
    temp.Following = temp.Following.filter((value) => value != address)
    hub = temp;
    await hubService.updateFollowList(hub.spec.processId,hub.Following)
    loader = false;
  }

  async function subscribe() {
    if (hub.Following.includes(address)) return;
    loader = true;
    let temp = hub;
    temp.Following.push(address);
    hub = temp;
    await hubService.updateFollowList(hub.spec.processId,hub.Following)
    loader = false;
  }
  onMount(async () => {
    if (!$addressStore.address) return;
    let zone = await registryService.getZoneById($addressStore.address);
    hub = await hubService.info(zone.spec.processId);
    isSubscribed = hub.Following.includes(address)!;
  });
</script>

{#if hub}
  {#if isSubscribed}
    <ButtonWithLoader
      {loader}
      class="group text-sm font-bold h-8 w-[120px]  rounded-full text-primary  hover:border-red-800 border-input bg-background hover:bg-accent hover:text-accent-foreground border"
      loaderClass="size-5"
      on:click={unsubscribe}
      disabled={loader}
    >
      <span class="group-hover:hidden">Subscribed</span>
      <span class="hidden group-hover:block text-red-500">Unsubscribe </span>
    </ButtonWithLoader>
  {:else}
    <ButtonWithLoader
      {loader}
      class="group text-sm font-bold h-8 w-[102px] rounded-full"
      loaderClass="size-5"
      on:click={subscribe}
      disabled={loader}
      >Subscribe
    </ButtonWithLoader>
  {/if}
{/if}

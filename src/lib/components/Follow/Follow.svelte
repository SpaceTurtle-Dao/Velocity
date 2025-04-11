<script lang="ts">
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
  import { onMount } from "svelte";
  import { addressStore } from "$lib/stores/address.store";
  import { hubService } from "$lib/services/HubService";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import type { Zone } from "$lib/models/Zone";
  import type { Hub } from "$lib/models/Hub";
  import { HUB_REGISTRY_ID } from "$lib/constants";

  export let hubId: string;
  let hub: Hub;
  let zone: Zone;
  let isSubscribed: boolean;
  let loader = false;

  hubRegistryService.subscribe(async (zones) => {
    if ($addressStore.address && zones.has($addressStore.address)) {
      zone = zones.get($addressStore.address)!;
      hub = await hubService.info(zone?.spec.processId);
      isSubscribed = hub.Following.includes(hubId)!;
    }
  });

  async function unsubscribe() {
    loader = true;
    let temp = hub;
    temp.Following = temp.Following.filter((value) => value != hubId);
    hub = temp;
    await hubService.updateFollowList(zone.spec.processId, hub.Following);
    loader = false;
  }

  async function subscribe() {
    if (hub.Following.includes(hubId)) return;
    loader = true;
    let temp = hub;
    temp.Following.push(hubId);
    hub = temp;
    await hubService.updateFollowList(zone.spec.processId, hub.Following);
    loader = false;
  }
  onMount(async () => {
    if (!$addressStore.address) return;
    await hubRegistryService.getZoneById(HUB_REGISTRY_ID(),$addressStore.address,);
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
      <span class="group-hover:hidden">Following</span>
      <span class="hidden group-hover:block text-red-500">Unfollow </span>
    </ButtonWithLoader>
  {:else}
    <ButtonWithLoader
      {loader}
      class="group text-sm font-bold h-8 w-[102px] rounded-full"
      loaderClass="size-5"
      on:click={subscribe}
      disabled={loader}
      >Follow
    </ButtonWithLoader>
  {/if}
{/if}

<script lang="ts">
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
  import { onMount } from "svelte";
  import { currentUser } from "$lib/services/userService";
  import { hubService } from "$lib/services/HubService";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import type { Zone } from "$lib/models/Zone";
  import type { Hub } from "$lib/models/Hub";
  import { HUB_REGISTRY_ID } from "$lib/constants";

  export let hubId: string;
  let isSubscribed: boolean;
  let loader = false;

  /*hubRegistryService.subscribe(async (zones) => {
    if ($currentUser.address && zones.has($currentUser.address)) {
      zone = zones.get($currentUser.address)!;
      hub = await hubService.info(zone?.spec.processId);
      isSubscribed = hub.Following.includes(hubId)!;
    }
  });*/

  const unsubscribe = async () => {
    loader = true;
    await currentUser.unfollow(hubId);
    loader = false;
  };

  const subscribe = async () => {
    loader = true;
    await currentUser.follow(hubId);
    loader = false;
  };

  onMount(async () => {
    if (!$currentUser) return;
    hubRegistryService.getZoneById(HUB_REGISTRY_ID(), $currentUser.address);
    isSubscribed = $currentUser.hub?.Following.includes(hubId)!;
  });
</script>

{#if $currentUser}
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

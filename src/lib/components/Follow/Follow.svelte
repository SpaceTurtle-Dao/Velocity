<script lang="ts">
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
  import { onMount } from "svelte";
  import { currentUser } from "$lib/services/UserService";
  import { hubRegistryService } from "$lib/services/HubRegistryService";
  import { HUB_REGISTRY_ID } from "$lib/constants";
    import { hubService } from "$lib/services/HubService";

  export let hubId: string;
  let isSubscribed: boolean;
  let loader = false;

  hubService.subscribe((hubs) => {
    if (!$currentUser) return;
    let _hub = hubs.get($currentUser.address)
    console.log(_hub)
    isSubscribed = _hub?.Following.includes(hubId)!;
    console.log(isSubscribed)
  })

  const unfollow = async () => {
    if (!$currentUser) return;
    loader = true;
    hubService.info(hubId)
    await currentUser.unfollow(hubId);
    await currentUser.setup($currentUser.address)
    loader = false;
  };

  const follow = async () => {
    if (!$currentUser) return;
    loader = true;
    hubService.info(hubId)
    await currentUser.follow(hubId);
    await currentUser.setup($currentUser.address)
    loader = false;
  };

  onMount(async () => {
    if (!$currentUser) return;
    currentUser.setup($currentUser.address)
  });
</script>

{#if $currentUser}
  {#if isSubscribed}
    <ButtonWithLoader
      {loader}
      class="group text-sm font-bold h-8 w-[120px]  rounded-full text-primary  hover:border-red-800 border-input bg-background hover:bg-accent hover:text-accent-foreground border"
      loaderClass="size-5"
      on:click={unfollow}
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
      on:click={follow}
      disabled={loader}
      >Follow
    </ButtonWithLoader>
  {/if}
{/if}

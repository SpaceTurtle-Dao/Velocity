<script lang="ts">
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
  import { followListStore } from "$lib/stores/follow-list.store";

  export let address: string;

  let isFollowListLoading = $followListStore.size === 0;

  // let isSubscribed: boolean = $followListStore.has(address);
  let isSubscribed: boolean = false;

  followListStore.subscribe((set) => {
    isFollowListLoading = set.size === 0;
    isSubscribed = set.has(address);
  });

  let loader = false;

  async function unsubscribe() {
    loader = true;
    await followListStore.unfollow(address);
    loader = false;
  }

  async function subscribe() {
    loader = true;
    await followListStore.follow(address);
    loader = false;
  }
</script>

{#if isFollowListLoading}
  <div class="h-8 w-[120px] bg-muted rounded-full animate-pulse"></div>
{:else if isSubscribed}
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

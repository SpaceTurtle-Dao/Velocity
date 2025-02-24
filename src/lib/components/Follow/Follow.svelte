<script lang="ts">
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
  import { currentUser } from "$lib/stores/current-user.store";
    import { ucmService } from "$lib/services/UCMService";

  export let address: string;

  // let isSubscribed: boolean = $followListStore.has(address);
  let isSubscribed: boolean = false;

  currentUser.subscribe((_currentUser) => {
    isSubscribed = _currentUser.followList.includes(address);
  });

  let loader = false;

  async function unsubscribe() {
    loader = true;
    await currentUser.unfollow(address);
    loader = false;
  }

  async function subscribe() {
    ucmService.fetchCollection()
    /*loader = true;
    await currentUser.follow(address);
    loader = false;*/
  }
</script>

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

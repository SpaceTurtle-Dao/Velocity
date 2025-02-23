<script lang="ts">
  import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader.svelte";
  import { currentUser } from "$lib/stores/current-user.store";
    import { onMount } from "svelte";
    import { profileService } from "$lib/services/ProfileService";

  export let address: string;

  // let isSubscribed: boolean = $followListStore.has(address);
  let isSubscribed: boolean;
  let loader = false;

  async function unsubscribe() {
    loader = true;
    await currentUser.unfollow(address);
    loader = false;
  }

  async function subscribe() {
    loader = true;
    await currentUser.follow(address);
    loader = false;
  }
  onMount(async () => {
    let profile = await profileService.get(address)
    isSubscribed = profile.followList.includes(address);
  })
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

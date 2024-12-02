<script lang="ts">
  import "./app.css";
  import { onMount } from "svelte";
  import Router, { location } from "svelte-spa-router";
  import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
  import Spinner from "$lib/components/spinners/Spinner.svelte";
  import Middle from "$lib/components/views/main/MiddleView.svelte";
  import Left from "$lib/components/views/main/LeftView.svelte";
  import Right from "$lib/components/views/main/RightView.svelte";
  import SignUp from "./lib/components/views/signup/SignUp.svelte";
  import { addressStore } from "$lib/stores/address.store";
  import { currentUser } from "$lib/stores/current-user.store";
  import { isConnected } from "$lib/stores/is-connectec.store";
  import Feed from "$lib/components/views/feed/Feed.svelte";
  import Profile from "$lib/components/views/profile/Profile.svelte";
  import IndividualPost from "$lib/components/posts/IndividualPost.svelte";
  import MessagesPage from "$lib/components/Messages/MessagesPage.svelte";
  import { myPostStore } from "$lib/stores/my-post.store";
  import { usersProfile } from "$lib/stores/users-profile.store";

  let isLoading = true;

  const routes = {
    "/": LandingPage,
    "/feed": Feed,
    "/profile": Profile,
    "/messages": MessagesPage,
    "/profile/:address": Profile,
    "/post/:id/:user": IndividualPost,
    "/signup": SignUp,
  };

  onMount(async () => {
    const promises = [
      addressStore.sync(),
      myPostStore.fetch(),
      usersProfile.fetchProfiles(),
    ];
    let results = await Promise.allSettled(promises)
    results.forEach(result => {
      console.log(result.status)
    })
  });

  let waitForUserFetch = true;

  addressStore.subscribe(async ({ address }) => {
    console.log(address);

    if (address) {
      await currentUser.fetch();
      waitForUserFetch = false;
    }

    isLoading = false;
  });
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-screen bg-background">
    <div class="space-y-4">
      <Spinner />
      <p class="text-muted-foreground text-center animate-pulse">
        Connecting to wallet...
      </p>
    </div>
  </div>
{:else if !$isConnected || waitForUserFetch}
  <LandingPage />
{:else if $location === "/signup"}
  <Router {routes} />
{:else}
  <div class="bg-background">
    <div class="flex w-full bg-background justify-center">
      <Left />
      <Middle><Router {routes} /></Middle>
      {#if $currentUser}
        <Right />
      {/if}
    </div>
  </div>
{/if}

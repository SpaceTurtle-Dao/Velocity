<script lang="ts">
  import "./app.css";
  import { onMount, tick } from "svelte";
  import Router, { location, push, replace } from "svelte-spa-router";
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
  import { followListStore } from "$lib/stores/follow-list.store";
  import MobileTopView from "$lib/components/views/main/MobileTopView.svelte";
  import MobileBottomNavBar from "$lib/components/views/main/MobileBottomNavBar.svelte";

  let isLoading = true;
  let isFollowListAlreadyFetched = false;

  const routes = {
    "/": LandingPage,
    "/feed": Feed,
    "/profile": Profile,
    "/messages": MessagesPage,
    "/profile/:address": Profile,
    "/post/:id/:user": IndividualPost,
    "/signup": SignUp,
    "/test": MobileTopView,
  };

  function handleRouteReload() {
    const hash = window.location.hash;

    if (hash && hash !== "#/") {
      // Redirect to home if any non-home route is reloaded
      console.log("Reload detected on route", hash);

      window.location.replace("/");
    }
  }

  onMount(() => {
    handleRouteReload();
    //await myPostStore.fetch();
    // await usersProfile.fetchProfiles();
  });

  let waitForUserFetch = true;

  addressStore.subscribe(async ({ address }) => {
    if (address) {
      try {
        console.log("Fetching User");
        await currentUser.fetch();
        isLoading = false;
        waitForUserFetch = false;
        console.log("Got User");
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        isLoading = false;
      }
    } else {
      console.log("Syncing");
      await addressStore.sync();
      console.log("Done Syncing");
      isLoading = false;
    }
  });

  currentUser.subscribe((user) => {
    if (user && !isFollowListAlreadyFetched) {
      followListStore.sync();
      isFollowListAlreadyFetched = true;
    }
  });

  followListStore.subscribe((followlistset) => {
    console.log("follow list changed", Array.from(followlistset));
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
{:else if waitForUserFetch}
  <LandingPage />
{:else if $location === "/signup"}
  <Router {routes} />
{:else if $currentUser}
  <div class="bg-background">
    <MobileTopView />
    <div class="flex w-full bg-background justify-center">
      <Left />
      <Middle>
        <Router {routes} />
      </Middle>
      <Right />
    </div>
    <MobileBottomNavBar />
  </div>
{/if}

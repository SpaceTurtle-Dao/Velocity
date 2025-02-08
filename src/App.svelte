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
  import Feed from "$lib/components/views/feed/Feed.svelte";
  import Profile from "$lib/components/views/profile/Profile.svelte";
  import IndividualPost from "$lib/components/posts/IndividualPost.svelte";
  import MessagesPage from "$lib/components/Messages/MessagesPage.svelte";
  import { followListStore } from "$lib/stores/follow-list.store";
  import MobileTopView from "$lib/components/views/main/MobileTopView.svelte";
  import MobileBottomNavBar from "$lib/components/views/main/MobileBottomNavBar.svelte";
  import PublicProfile from "$lib/components/views/profile/PublicProfile.svelte";

  let isLoading = true;
  let isFollowListAlreadyFetched = false;
  let initialRoute = window.location.hash.slice(1) || "/";

  const routes = {
    "/": LandingPage,
    "/feed": Feed,
    "/profile": Profile,
    "/messages": MessagesPage,
    "/profile/:address": Profile,
    "/post/:id/:user": IndividualPost,
    "/p/:address": PublicProfile,
    "/signup": SignUp,
    "/test": MobileTopView,
  };

  // Store the current route in sessionStorage when it changes
  $: if ($location) {
    sessionStorage.setItem("lastRoute", $location);
  }

  onMount(async () => {
    // Check if there's a stored route
    const storedRoute = sessionStorage.getItem("lastRoute");
    if (storedRoute) {
      initialRoute = storedRoute;
    }

    try {
      await addressStore.sync();

      if ($addressStore.address) {
        await currentUser.fetch();
        if ($currentUser) {
          // Only restore the route if user is authenticated
          if (storedRoute && storedRoute !== "/") {
            push(storedRoute);
          }
        }
      }
    } catch (error) {
      console.error("Error during initialization:", error);
    } finally {
      isLoading = false;
    }
  });

  addressStore.subscribe(async ({ address }) => {
    if (address) {
      try {
        console.log("Fetching User");
        await currentUser.fetch();
        isLoading = false;
        console.log("Got User");
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        isLoading = false;
      }
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

  const isPublicProfileRoute = (location: string) => {
    return location.startsWith('/p/');
  };
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
{:else if isPublicProfileRoute($location)}
  <Router {routes} />
{:else if !$currentUser && $location !== "/signup"}
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
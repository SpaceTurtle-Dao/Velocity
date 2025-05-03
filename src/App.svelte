<script lang="ts">
  import "./app.css";
  import { onMount, tick } from "svelte";
  import Router, { location, push, replace } from "svelte-spa-router";
  //import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
  //import Spinner from "$lib/components/spinners/Spinner.svelte";
  import Middle from "$lib/components/views/main/MiddleView.svelte";
  import Left from "$lib/components/views/main/LeftView.svelte";
  import Right from "$lib/components/views/main/RightView.svelte";
  import SignUp from "./lib/components/views/signup/SignUp.svelte";
  import { currentUser } from "$lib/stores/currentUser.store";
  import Feed from "$lib/components/views/feed/Feed.svelte";
  import Profile from "$lib/components/views/profile/Profile.svelte";
  import IndividualPost from "$lib/components/posts/IndividualPost.svelte";
  import MessagesPage from "$lib/components/Messages/MessagesPage.svelte";
  import MobileTopView from "$lib/components/views/main/MobileTopView.svelte";
  import MobileBottomNavBar from "$lib/components/views/main/MobileBottomNavBar.svelte";
  import CollectionsPage from "$lib/components/Assets_Card/CollectionPage.svelte";
  // import { postService } from "$lib/services/PostService";
  import { profileService } from "$lib/services/ProfileService";
  import CreateProfile from "$lib/components/views/profile/CreateProfile.svelte";
  import { profileRegistryService } from "$lib/services/ProfileRegistryService";
  import { PROFILE_REGISTRY_ID } from "$lib/constants";

  let address: string;

  currentUser.subscribe((value) => {
    if (value.address) address = value.address;
  });

  //let isFollowListAlreadyFetched = false;
  //let initialRoute = window.location.hash.slice(1) || "/";

  const routes = {
    "/": Feed,
    "/search": CreateProfile,
    // "/createprofile": CreateProfile,
    "/messages": MessagesPage,
    "/profile/:address": Profile,
    "/post/:hubId/:id": IndividualPost,
    "/signup": SignUp,
    "/test": MobileTopView,
    "/collections": CollectionsPage,
  };

  onMount(async () => {
    console.log("getting connected status");
    let isConnected = await currentUser.isConnected();
    console.log("got status");
    if ($currentUser.address) {
      currentUser.sync();
      if (address) {
        profileRegistryService.getZoneById(PROFILE_REGISTRY_ID(), $currentUser.address);
      }
    } else {
      await currentUser.connectWallet();
    }
  });
</script>

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
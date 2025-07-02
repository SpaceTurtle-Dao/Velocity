<script lang="ts">
  import "./app.css";
  import { onMount, tick } from "svelte";
  import Router, { location, push, replace } from "svelte-spa-router";
  //import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
  //import Spinner from "$lib/components/spinners/Spinner.svelte";
  import Middle from "$lib/components/views/main/MiddleView.svelte";
  import Left from "$lib/components/views/main/LeftView.svelte";
  import Right from "$lib/components/views/main/RightView.svelte";
  import { wrap } from "svelte-spa-router/wrap";
  import MobileTopView from "$lib/components/views/main/MobileTopView.svelte";
  import MobileBottomNavBar from "$lib/components/views/main/MobileBottomNavBar.svelte";

  const routes = {
    "/": wrap({
      asyncComponent: () => import("$lib/components/views/feed/Feed.svelte"),
    }),
    "/search": wrap({
      asyncComponent: () =>
        import("$lib/components/Search/SearchPage.svelte"),
    }),
    "/messages": wrap({
      asyncComponent: () =>
        import("$lib/components/Messages/MessagesPage.svelte"),
    }),
    "/profile/:address": wrap({
      asyncComponent: () =>
        import("$lib/components/views/profile/Profile.svelte"),
    }),
    "/post/:hubId/:id": wrap({
      asyncComponent: () =>
        import("$lib/components/posts/IndividualPost.svelte"),
    }),
    "/signup": wrap({
      asyncComponent: () =>
        import("./lib/components/views/signup/SignUp.svelte"),
    }),
    "/collections": wrap({
      asyncComponent: () =>
        import("$lib/components/Assets_Card/CollectionPage.svelte"),
    }),
  };

  onMount(async () => {
    /*console.log("getting connected status");
    let isConnected = await currentUser.isConnected();
    console.log("got status");
    if (!isConnected) await currentUser.connectWallet();*/
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
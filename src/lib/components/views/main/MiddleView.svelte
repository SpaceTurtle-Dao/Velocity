<script lang="ts">
    import Router from "svelte-spa-router";
    import Feed from "$lib/components/views/feed/Feed.svelte";
    import LandingPage from "$lib/components/views/landingPage/LandingPage.svelte";
    import Profile from "$lib/components/views/profile/Profile.svelte";
    import IndividualProfile from "$lib/components/views/profile/IndividualProfile.svelte";
    import IndividualPost from "$lib/components/posts/IndividualPost.svelte";
    import SignUp from "../signup/SignUp.svelte";
    import MessagesPage from "$lib/components/Messages/MessagesPage.svelte";

    const routes = {
        "/": LandingPage,
        "/feed": Feed,
        "/profile": Profile,
        "/messages": MessagesPage,
        "/profile/:process": IndividualProfile,
        "/post/:id/:user": IndividualPost,
        "/signup": SignUp,
    };
</script>

<div class="h-screen w-1/3 overflow-auto scrollbar-hidden">
    <Router {routes} />
</div>

<style>
    .scrollbar-hidden {
        scrollbar-width: none;
    }
</style>

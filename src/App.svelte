<script>
  import ProfileView from "./lib/components/ProfileView.svelte";
  import "./app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import UserProfile from "./routes/userprofile/UserProfile.svelte";
  import Feed from "./lib/Feed.svelte";
</script>

<Navbar />

<main class="pt-16">
  <!-- <ProfileView />
  <UserProfile /> -->
  <Feed />
</main>

<style>
  :global(body) {
    background-color: #fff0f5;
  }
</style>

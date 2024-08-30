<script>
import ProfileView from "./lib/components/ProfileView.svelte";
import "./app.css";
import Navbar from "$lib/components/Navbar.svelte";
  import UserProfile from "./routes/userprofile/UserProfile.svelte";
</script>

<Navbar />
<main class="pt-16">
  <ProfileView />
  <UserProfile />
</main>

<style>
  :global(body) {
    background-color: #FFF0F5;
  }
</style>
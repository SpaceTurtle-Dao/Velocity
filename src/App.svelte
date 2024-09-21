<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import "./app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import UserProfile from "$lib/components/views/profile/UserProfile.svelte";
  import CreatePostModal from "$lib/components/CreatePost.svelte";
  import Feed from "$lib/components/Feed.svelte";
  import ProfileCreation from "$lib/components/views/profile/CreateProfile.svelte";
  import UpdateUserProfile from "$lib/components/views/profile/UpdateUserProfile.svelte";
  import {
    Home as HomeIcon,
    Search,
    Bell,
    User,
    MoreHorizontal,
    Plus,
    Zap, // New icon for Relay
    Edit,
  } from "lucide-svelte";
  import RepliesPage from "$lib/components/RepliesPage.svelte";
  import Profile from "$lib/components/views/profile/Profile.svelte";
  import { currentUser } from "./lib/stores/profile.store";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
  import RelayButtons from "$lib/components/Relay.svelte";

  export let url = "";

  let isCreatePostModalOpen = false;

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }
  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/feed" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Zap, label: "Relay", href: "/relay" },
    { icon: Edit, label: "Create Profile", href: "/create-profile" },
  ];

  function toggleCreatePostModal() {
    isCreatePostModalOpen = !isCreatePostModalOpen;
  }

  //@ts-ignore
  async function handlePostSubmit(event) {
    console.log("New post submitted:", event.detail.content);
  }
</script>

<div class="bg-background h-screen">
  <Router {url}>
    <div class="flex justify-center w-full bg-background">
      <div class="flex flex-col justify-between p-4">
        <div class="space-y-4 pt-16">
          <nav>
            <ul class="space-y-2">
              {#each menuItems as item}
                <li>
                  <a
                    href={item.href}
                    class="flex items-center p-2 px-2 rounded-full hover:bg-background-700 transition-colors duration-200"
                  >
                    <svelte:component
                      this={item.icon}
                      class="w-6 h-6 mr-4 text-primary"
                    />
                    <span class="text-lg font-medium text-primary">{item.label}</span>
                  </a>
                </li>
              {/each}
              <li>
                <button
                  on:click={toggleCreatePostModal}
                  class="flex items-center p-2 px-5 rounded-full hover:bg-background-700 transition-colors duration-200"
                >
                  <MoreHorizontal class="w-6 h-6 mr-4 text-primary" />
                  <span class="text-lg font-medium text-primary">More</span>
                </button>
              </li>
            </ul>
          </nav>
          <button
            on:click={toggleCreatePostModal}
            class="w-full bg-primary text-secondary rounded-full py-3 font-bold text-lg hover:bg-ring transition-colors duration-200 flex items-center justify-center"
          >
            <Plus class="w-5 h-5 mr-2" />
            Post
          </button>
        </div>
        <div class="mt-auto fixed bottom-4">
          <LowerProfile />
        </div>
      </div>

      <div class="w-1/3">
        <Route path="/feed" component={Feed} />
        <Route path="/profile" component={Profile} />
        <Route path="/" component={Feed} />
        <Route path="/UserProfile" component={UserProfile} />
        <Route path="/Feed" component={Feed} />
        <Route path="/Feed/:id" let:params>
          <RepliesPage memeId={params.id} />
        </Route>
        <Route path="/relay" component={RelayButtons} />
        <Route path="/create-profile" component={ProfileCreation} />
        <Route path="/update-profile" component={UpdateUserProfile} />
      </div>
    </div>
  </Router>
</div>

<CreatePostModal
  isOpen={isCreatePostModalOpen}
  on:close={toggleCreatePostModal}
  on:submit={handlePostSubmit}
/>

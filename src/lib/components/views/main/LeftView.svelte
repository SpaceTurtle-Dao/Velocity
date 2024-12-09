<script>
  import { isConnected, user } from "$lib/stores/profile.store";
  import { push, link } from "svelte-spa-router";
  import CreateProfile from "$lib/components/views/profile/CreateProfile.svelte";
  import CreatePostModal from "$lib/components/posts/CreatePost.svelte";
  import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
  import Logo from "../../../../assets/Logo2.png";
  import {
    Home as HomeIcon,
    User,
    MoreHorizontal,
    Plus,
    Mail,
  } from "lucide-svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import UserMenu from "$lib/components/Sidebar/UserMenu.svelte";

  //   let isCreatePostModalOpen = false;

  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/feed" },
    { icon: User, label: "Profile", href: `/profile/${$currentUser.address}` },
    { icon: Mail, label: "Messages", href: "/messages" },
  ];

  //   function toggleCreatePostModal() {
  //     isCreatePostModalOpen = !isCreatePostModalOpen;
  //   }
</script>

<div class="flex p-4 w-1/3 justify-end">
  <div class="space-y-8 p-4">
    <nav>
      <ul class="space-y-3 overflow-hidden flex flex-col">
        <li>
          <img class="w-10 h-10" src={Logo} alt="Logo" />
        </li>
        {#each menuItems as item}
          <li>
            <a
              href={item.href}
              use:link
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
          <!-- <button
            on:click={toggleCreatePostModal}
            class="flex items-center p-2 px-5 rounded-full hover:bg-background-700 transition-colors duration-200"
          > -->
          <div
            class="flex items-center p-2 px-5 rounded-full hover:bg-background-700 transition-colors duration-200"
          >
            <MoreHorizontal class="w-6 h-6 mr-4 text-primary" />
            <span class="text-lg font-medium text-primary">More</span>
          </div>
          <!-- </button> -->
        </li>
      </ul>
    </nav>

    <CreatePostModal />

    <div class="p-4">
      <LowerProfile />
    </div>
  </div>
</div>

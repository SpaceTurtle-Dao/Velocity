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
    Menu,
  } from "lucide-svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import UserMenu from "$lib/components/Sidebar/UserMenu.svelte";

  let isMobileMenuOpen = false;

  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/feed" },
    { icon: User, label: "Profile", href: `/profile/${$currentUser.address}` },
    { icon: Mail, label: "Messages", href: "/messages" },
  ];

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
</script>

<div class="flex p-2 lg:p-4 w-full lg:w-1/3 xl:w-1/4">
  <!-- Mobile Menu Button -->
  <button
    class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-background-800"
    on:click={toggleMobileMenu}
  >
    <Menu class="w-6 h-6 text-primary" />
  </button>

  <!-- Sidebar Content -->
  <div class="hidden lg:flex w-full justify-end">
    <div class="space-y-6 p-2 lg:p-4 fixed">
      <nav>
        <ul class="space-y-3 overflow-hidden flex flex-col">
          <li>
            <img class="w-8 lg:w-10 h-8 lg:h-10" src={Logo} alt="Logo" />
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
                  class="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-4 text-primary"
                />
                <span class="text-base lg:text-lg font-medium text-primary">{item.label}</span>
              </a>
            </li>
          {/each}
          <li>
            <div class="flex items-center p-2 px-5 rounded-full hover:bg-background-700 transition-colors duration-200">
              <MoreHorizontal class="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-4 text-primary" />
              <span class="text-base lg:text-lg font-medium text-primary">More</span>
            </div>
          </li>
        </ul>
      </nav>

      <CreatePostModal />

      <div class="p-2 lg:p-4">
        <LowerProfile />
      </div>
    </div>
  </div>

  <!-- Mobile Menu Overlay -->
  {#if isMobileMenuOpen}
    <div class="fixed inset-0 bg-background-900 bg-opacity-90 z-40 lg:hidden">
      <div class="flex flex-col p-16 space-y-4">
        <nav>
          <ul class="space-y-6">
            {#each menuItems as item}
              <li>
                <a
                  href={item.href}
                  use:link
                  class="flex items-center p-2 rounded-full hover:bg-background-700"
                  on:click={() => (isMobileMenuOpen = false)}
                >
                  <svelte:component
                    this={item.icon}
                    class="w-6 h-6 mr-4 text-primary"
                  />
                  <span class="text-lg font-medium text-primary">{item.label}</span>
                </a>
              </li>
            {/each}
          </ul>
        </nav>
        <LowerProfile />
      </div>
    </div>
  {/if}
</div>
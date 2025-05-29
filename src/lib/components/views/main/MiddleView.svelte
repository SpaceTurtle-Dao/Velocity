<script lang="ts">
  import { isMobile } from "$lib/stores/is-mobile.store";
  import { currentUser } from "$lib/services/CurrentUser";
  import { walletService } from "$lib/services/walletService";
  import { Loader, Wallet, User, Sparkles } from "lucide-svelte";
  import Connect from "$lib/components/wallet/connect.svelte";
  import CreateProfile from "$lib/components/views/profile/CreateProfile.svelte";
  import Logo from "../../../../assets/Logo2.png";
  import { onMount } from "svelte";
  import { postService } from "$lib/services/postService";
  import { fade, scale, fly } from "svelte/transition";

  // 49px MobileTopView 53px MobileBottomNavBar
  let loader = false;
  let isLoadingProfile = false;
  let showContent = false;
  let currentPath = "";

  onMount(() => {
    walletService.isConnected();
    currentPath = window.location.hash;
    setTimeout(() => showContent = true, 100);
    
    const handleHashChange = () => {
      currentPath = window.location.hash;
    };
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  });

  walletService.subscribe((address) => {
    if (!address) return;
    isLoadingProfile = true;
    currentUser.setup(address).then(() => {
      loader = false;
      isLoadingProfile = false;
    }).catch(() => {
      isLoadingProfile = false;
    });
  });

  // Handle wallet switch events
  addEventListener("walletSwitch", async (e) => {
    console.log(e);
    //@ts-ignore
    const { address } = e.detail;
    postService.delete();
    isLoadingProfile = true;
    try {
      await currentUser.setup(address);
    } finally {
      isLoadingProfile = false;
    }
  });

  $: isProfilePage = currentPath.includes('#/profile/');
</script>

<div
  class="max-w-[653px] w-full scrollbar-hidden overflow-y-auto md:pr-5 lg:pr-0 {$isMobile
    ? 'h-[calc(100vh-49px-53px)]'
    : 'h-screen'} relative"
>
  {#if !$isMobile && showContent && !isProfilePage && (!$currentUser && !$walletService || ($walletService && !$currentUser))}
    <div 
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm"
      in:fade={{ duration: 500 }}
    >
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 dark:bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div 
        class="relative z-10 bg-background/90 dark:bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4 text-center"
        in:scale={{ duration: 600, delay: 200, start: 0.9 }}
      >
        <div class="relative mb-6">
          <div class="absolute inset-0 bg-primary/30 dark:bg-primary/20 blur-xl rounded-full"></div>
          <img 
            src={Logo} 
            class="relative w-20 h-20 mx-auto drop-shadow-2xl" 
            alt="velocity logo"
            in:scale={{ duration: 800, delay: 400 }}
          />
        </div>

        {#if !$currentUser && !$walletService}
          <div in:fly={{ y: 20, duration: 600, delay: 600 }}>
            <div class="flex items-center justify-center mb-4">
              <div class="relative">
                <Wallet class="w-8 h-8 text-primary" />
                <Sparkles class="w-4 h-4 text-yellow-500 dark:text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            
            <h2 class="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent mb-3">
              Welcome to Velocity
            </h2>
            
            <p class="text-muted-foreground mb-8 leading-relaxed">
              Connect your wallet to start your journey in the decentralized social experience
            </p>
            
            {#if loader}
              <div class="flex items-center justify-center space-x-3">
                <Loader class="animate-spin w-6 h-6 text-primary" />
                <span class="text-foreground/80 animate-pulse">Connecting...</span>
              </div>
            {:else}
              <div class="transform hover:scale-105 transition-transform duration-200">
                <Connect {loader} />
              </div>
            {/if}
          </div>

        {:else if $walletService && !$currentUser}
          <div in:fly={{ y: 20, duration: 600, delay: 600 }}>
            {#if isLoadingProfile}
              <!-- Loading Profile -->
              <div class="flex items-center justify-center mb-4">
                <div class="relative">
                  <User class="w-8 h-8 text-primary" />
                  <div class="absolute -inset-2 border-2 border-primary/30 rounded-full animate-spin border-t-primary"></div>
                </div>
              </div>
              
              <h2 class="text-2xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent mb-3">
                Loading Profile
              </h2>
              
              <p class="text-muted-foreground mb-8 leading-relaxed">
                Searching for your profile in the network...
              </p>
              
              <div class="flex items-center justify-center space-x-3">
                <Loader class="animate-spin w-6 h-6 text-primary" />
                <span class="text-foreground/80 animate-pulse">Please wait...</span>
              </div>
              
              <!-- Progress dots -->
              <div class="flex justify-center space-x-2 mt-6">
                <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div class="w-2 h-2 bg-primary/70 rounded-full animate-pulse delay-150"></div>
                <div class="w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-300"></div>
              </div>
              
            {:else}
              <div class="flex items-center justify-center mb-4">
                <div class="relative">
                  <User class="w-8 h-8 text-green-500 dark:text-green-400" />
                  <Sparkles class="w-4 h-4 text-green-400 dark:text-green-300 absolute -top-1 -right-1 animate-bounce" />
                </div>
              </div>
              
              <h2 class="text-2xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-3">
                Create Your Profile
              </h2>
              
              <p class="text-muted-foreground mb-8 leading-relaxed">
                Complete your profile to join the Velocity community
              </p>
              
              <div class="transform hover:scale-105 transition-transform duration-200">
                <CreateProfile />
              </div>
            {/if}
          </div>
        {/if}

        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
      </div>

      <div class="absolute inset-0 pointer-events-none">
        {#each Array(6) as _, i}
          <div 
            class="absolute w-1 h-1 bg-primary/40 dark:bg-primary/30 rounded-full animate-float"
            style="
              left: {Math.random() * 100}%; 
              top: {Math.random() * 100}%; 
              animation-delay: {i * 0.5}s;
              animation-duration: {3 + Math.random() * 2}s;
            "
          ></div>
        {/each}
      </div>
    </div>
  {/if}

  <slot />
</div>

<style>
  .scrollbar-hidden {
    scrollbar-width: none;
  }
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.5;
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
      opacity: 1;
    }
  }

  .animate-float {
    animation: float linear infinite;
  }

  /* Custom gradient animations */
  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .bg-gradient-animated {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient-shift 3s ease infinite;
  }
</style>
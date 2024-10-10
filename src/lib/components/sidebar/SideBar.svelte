<script lang="ts">
    import type { UserInfo } from "$lib/models/Profile";
    import { currentUser, isConnected, user } from "$lib/stores/profile.store";
    import { users } from "$lib/stores/main.store";
    import Feed from "$lib/components/views/feed/Feed.svelte";
    import {
        Home as HomeIcon,
        User,
        MoreHorizontal,
        Plus,
        Mail,
    } from "lucide-svelte";
    import { link } from "svelte-routing";
    import Profile from "$lib/components/views/profile/Profile.svelte";
    import RelayButtons from "$lib/components/Relay.svelte";
    import CreatePostModal from "$lib/components/CreatePost.svelte";
    import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
    import CreateProfile from "$lib/components/views/profile/CreateProfile.svelte";
    import ConnectWalletButton from "$lib/components/wallet.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { onMount } from "svelte";
    import { fetchEvents, fetchFeed, info, relay, relays } from "$lib/ao/relay";

    let _isConnected = false;
    let _currentUser: UserInfo;

    isConnected.subscribe((value) => {
        _isConnected = value;
    });

    currentUser.subscribe((value) => {
        _currentUser = value;
    });

    const menuItems = [
        { icon: HomeIcon, label: "Home", href: "/feed" },
        { icon: User, label: "Profile", href: "/profile" },
        { icon: Mail, label: "Messages", href: "/message" },
    ];

    const routes = {
        "/feed": Feed,
        "/profile": Profile,
        "/messages": RelayButtons,
    };

    let isCreatePostModalOpen = false;

    function toggleCreatePostModal() {
        console.log("making post");
        isCreatePostModalOpen = !isCreatePostModalOpen;
    }

    // async function handlePostSubmit(event: CustomEvent) {
    //     console.log("New post submitted:", event.detail.content);
    // }

    async function checkWalletConnection() {
        // @ts-ignore
        if (window.arweaveWallet) {
            try {
                // @ts-ignore
                console.log("////////GETTING WALLET/////////////");
                const address = await window.arweaveWallet.getActiveAddress();
                if (address) {
                    _isConnected = true;
                    let _relay = await relay(address);
                    console.log("USER RELAY");
                    console.log(_relay);
                    if (_relay) {
                        let _currentUser = await info(_relay);
                        currentUser.set(_currentUser);
                        user.set(_currentUser);
                        // await fetchPost();
                    }
                }
            } catch (error) {
                console.log(_isConnected);
                console.error("Failed to get active address:", error);
            }
        }
    }

    onMount(async () => {
        await checkWalletConnection();
    });
</script>

<div>
    <div class="space-y-8 p-4">
        <nav>
            <ul class="space-y-3">
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
                            <span class="text-lg font-medium text-primary"
                                >{item.label}</span
                            >
                        </a>
                    </li>
                {/each}
                <li>
                    <button
                        on:click={toggleCreatePostModal}
                        class="flex items-center p-2 px-5 rounded-full hover:bg-background-700 transition-colors duration-200"
                    >
                        <MoreHorizontal class="w-6 h-6 mr-4 text-primary" />
                        <span class="text-lg font-medium text-primary"
                            >More</span
                        >
                    </button>
                </li>
            </ul>
        </nav>
        {#if !_isConnected}
            <ConnectWalletButton />
        {:else if $currentUser == null || $currentUser == undefined}
            <CreateProfile />
        {:else}
            <CreatePostModal />
        {/if}
        {#if _currentUser}
            <div class="p-4">
                <LowerProfile />
            </div>
        {/if}
    </div>
</div>

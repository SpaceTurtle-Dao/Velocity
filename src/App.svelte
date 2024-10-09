<script lang="ts">
    import { onMount } from "svelte";
    import Router from "svelte-spa-router";
    import { link } from "svelte-spa-router";
    import "./app.css";
    import CreatePostModal from "$lib/components/CreatePost.svelte";
    import {
        Home as HomeIcon,
        User,
        MoreHorizontal,
        Plus,
        Mail,
    } from "lucide-svelte";
    import Profile from "$lib/components/views/profile/Profile.svelte";
    import { currentUser, isConnected, user } from "./lib/stores/profile.store";
    import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
    import RelayButtons from "$lib/components/Relay.svelte";
    import CreateProfile from "$lib/components/views/profile/CreateProfile.svelte";
    import ConnectWalletButton from "$lib/components/wallet.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { fetchEvents, fetchFeed, info, relay, relays } from "$lib/ao/relay";
    import UserList from "$lib/components/UserList.svelte";
    import type { UserInfo } from "$lib/models/Profile";
    import { users } from "$lib/stores/main.store";
    import Feed from "$lib/components/views/feed/Feed.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton/index";

    let isCreatePostModalOpen = false;
    let _isConnected = false;
    let _currentUser: UserInfo;

    isConnected.subscribe((value) => {
        _isConnected = value;
    });

    currentUser.subscribe((value) => {
        _currentUser = value;
    });

    async function fetchPost() {
        let filters: Array<any> = [];
        console.log("Fetching Post");
        if ($currentUser) {
            let filter = {
                kinds: ["1"],
                since: 1663905355000,
                until: Date.now(),
                limit: 100,
            };
            filters.push(filter);
            let _filters = JSON.stringify(filters);
            if ($currentUser) {
                fetchFeed($currentUser.Process, _filters);
                fetchEvents($currentUser.Process, _filters);
            }
        }
    }

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
                        await fetchPost();
                    }
                }
            } catch (error) {
                console.log(_isConnected);
                console.error("Failed to get active address:", error);
            }
        }
    }

    const menuItems = [
        { icon: HomeIcon, label: "Home", href: "/feed" },
        { icon: User, label: "Profile", href: "/profile" },
        { icon: Mail, label: "Messages", href: "/message" },
    ];

    function toggleCreatePostModal() {
        console.log("making post");
        isCreatePostModalOpen = !isCreatePostModalOpen;
    }

    async function handlePostSubmit(event: CustomEvent) {
        console.log("New post submitted:", event.detail.content);
    }

    const routes = {
        "/feed": Feed,
        "/profile": Profile,
        "/messages": RelayButtons,
    };

    onMount(async () => {
        await checkWalletConnection();
    });
</script>

<div class="bg-background h-screen">
    <div class="flex w-full bg-background justify-center">
        <div class="flex p-4 w-1/3 justify-end">
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
                                    <span
                                        class="text-lg font-medium text-primary"
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
                                <MoreHorizontal
                                    class="w-6 h-6 mr-4 text-primary"
                                />
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
        <div class="overflow-y-scroll no-scrollbar h-screen w-1/3">
            <Router {routes} />
        </div>

        <div class="flex justify-start pt-10 pl-10 w-1/3">
            {#if _isConnected}
                <UserList />
            {/if}
            {#if !_isConnected}
                <div class="grid gap-0">
                    <Skeleton class="h-[50px] w-[150px] rounded-md" />
                    <Skeleton class="h-[50px] w-[150px] rounded-md" />
                    <Skeleton class="h-[50px] w-[150px] rounded-md" />
                    <Skeleton class="h-[50px] w-[150px] rounded-md" />
                </div>
            {/if}
        </div>
    </div>
</div>

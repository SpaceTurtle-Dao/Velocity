<script lang="ts">
    import { onMount } from "svelte";
    import Router from "svelte-spa-router";
    import { link } from "svelte-spa-router";
    import "./app.css";

    import { fetchEvents, fetchFeed, info, relay, relays } from "$lib/ao/relay";
    import UserList from "$lib/components/UserList.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton/index";
    import { isConnected } from "$lib/stores/profile.store";
    import Feed from "$lib/components/views/feed/Feed.svelte";
    import Profile from "$lib/components/views/profile/Profile.svelte";
    import RelayButtons from "$lib/components/Relay.svelte";

    // let _isConnected = false;
    // let _currentUser: UserInfo;

    // async function fetchPost() {
    //     let filters: Array<any> = [];
    //     console.log("Fetching Post");
    //     if ($currentUser) {
    //         let filter = {
    //             kinds: ["1"],
    //             since: 1663905355000,
    //             until: Date.now(),
    //             limit: 100,
    //         };
    //         filters.push(filter);
    //         let _filters = JSON.stringify(filters);
    //         if ($currentUser) {
    //             fetchFeed($currentUser.Process, _filters);
    //             fetchEvents($currentUser.Process, _filters);
    //         }
    //     }
    // }

    // async function checkWalletConnection() {
    //     // @ts-ignore
    //     if (window.arweaveWallet) {
    //         try {
    //             // @ts-ignore
    //             console.log("////////GETTING WALLET/////////////");
    //             const address = await window.arweaveWallet.getActiveAddress();
    //             if (address) {
    //                 _isConnected = true;
    //                 let _relay = await relay(address);
    //                 console.log("USER RELAY");
    //                 console.log(_relay);
    //                 if (_relay) {
    //                     let _currentUser = await info(_relay);
    //                     currentUser.set(_currentUser);
    //                     user.set(_currentUser);
    //                     await fetchPost();
    //                 }
    //             }
    //         } catch (error) {
    //             console.log(_isConnected);
    //             console.error("Failed to get active address:", error);
    //         }
    //     }
    // }

    // async function handlePostSubmit(event: CustomEvent) {
    //     console.log("New post submitted:", event.detail.content);
    // }

    // onMount(async () => {
    //     await checkWalletConnection();
    // });

    import {
        Home as HomeIcon,
        User,
        MoreHorizontal,
        Plus,
        Mail,
    } from "lucide-svelte";

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
</script>

<div class="bg-background h-screen">
    <div class="flex w-full bg-background justify-center">
        <div class="flex p-4 w-1/3 justify-end"></div>
        <div class="overflow-y-scroll no-scrollbar h-screen w-1/3">
            <Router {routes} />
        </div>

        <div class="flex justify-start pt-10 pl-10 w-1/3">
            {#if $isConnected}
                <UserList />
            {/if}
            <!-- {#if !_isConnected}
                <div class="grid gap-0">
                    <Skeleton class="h-[50px] w-[150px] rounded-md" />
                    <Skeleton class="h-[50px] w-[150px] rounded-md" />
                    <Skeleton class="h-[50px] w-[150px] rounded-md" />
                    <Skeleton class="h-[50px] w-[150px] rounded-md" />
                </div>
            {/if} -->
        </div>
    </div>
</div>

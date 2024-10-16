<script lang="ts">
    import Router from "svelte-spa-router";
    import { link } from "svelte-spa-router";
    import "./app.css";

    import UserList from "$lib/components/UserList/UserList.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton/index";
    import { isConnected } from "$lib/stores/profile.store";
    import Feed from "$lib/components/views/feed/Feed.svelte";
    import Profile from "$lib/components/views/profile/Profile.svelte";
    import RelayButtons from "$lib/components/relay/Relay.svelte";
    import {
        Home as HomeIcon,
        User,
        MoreHorizontal,
        Plus,
        Mail,
    } from "lucide-svelte";
    import SideBar from "$lib/components/sidebar/SideBar.svelte";

    // let _isConnected = false;
    // let _currentUser: UserInfo;

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
        <div class="flex p-4 w-1/3 justify-end">
            <SideBar />
        </div>
        <div class="overflow-y-scroll no-scrollbar h-screen w-1/3">
            <Router {routes} />
        </div>

        <div class="flex justify-start pt-10 pl-10 w-1/3">
            <UserList />
        </div>
    </div>
</div>

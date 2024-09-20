<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import "./app.css";
    import Navbar from "$lib/components/views/home/Navbar.svelte";
    import ProfileView from "$lib/components/views/profile/ProfileView.svelte";
    import UserProfile from "$lib/components/views/profile/UserProfile.svelte";
    import CreatePostModal from "$lib/components/views/feed/CreateMeme.svelte";
    import Feed from "$lib/components/views/feed/Feed.svelte";
    import Explore from "$lib/components/views/explore/Explore.svelte";
    import {
        Home as HomeIcon,
        Search,
        Bell,
        User,
        MoreHorizontal,
        Plus,
        Zap, // New icon for Relay
        LayoutDashboard,
    } from "lucide-svelte";
    import Feedpage from "$lib/components/views/feed/Feedpage.svelte";
    import RepliesPage from "$lib/components/views/feed/RepliesPage.svelte";
    import ProfileNip from "$lib/components/views/profile/ProfileNip.svelte";
    import { currentUser } from "./stores/profile.store";
    import {
        Avatar,
        AvatarFallback,
        AvatarImage,
    } from "$lib/components/ui/avatar";
    import LowerProfile from "$lib/components/views/profile/LowerProfile.svelte";
    import RelayButtons from "$lib/components/views/dashboard/Relay.svelte";
    import Dashboard from "$lib/components/views/dashboard/Dashboard.svelte";

    export let url = "";

    let isCreatePostModalOpen = false;
    let profile: any;

    function toUrl(tx: string) {
        return (
            "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
            tx
        );
    }

    currentUser.subscribe((value) => {
        profile = value;
    });

    const menuItems = [
        { icon: HomeIcon, label: "Home", href: "/feed" },
        { icon: Search, label: "Explore", href: "/explore" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    function toggleCreatePostModal() {
        isCreatePostModalOpen = !isCreatePostModalOpen;
    }

    //@ts-ignore
    async function handlePostSubmit(event) {
        console.log("New post submitted:", event.detail.content);
    }
</script>

<Router {url}>
    <div class="flex h-screen overflow-hidden">
        <aside
            class="w-64 bg-background-500 shadow-lg flex flex-col justify-between p-4"
        >
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
                                        class="w-6 h-6 mr-4 text-primary-50"
                                    />
                                    <span class="text-lg font-medium text-white"
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
                                    class="w-6 h-6 mr-4 text-white"
                                />
                                <span class="text-lg font-medium text-white"
                                    >More</span
                                >
                            </button>
                        </li>
                        <li>
                            <a
                                href={"/dash"}
                                class="flex items-center p-2 px-2 rounded-full hover:bg-background-700 transition-colors duration-200"
                            >
                                <svelte:component
                                    this={LayoutDashboard}
                                    class="w-6 h-6 mr-4 text-primary-50"
                                />
                                <span class="text-lg font-medium text-white"
                                    >{"Dash"}</span
                                >
                            </a>
                        </li>
                    </ul>
                </nav>
                <button
                    on:click={toggleCreatePostModal}
                    class="w-full bg-background-700 text-white rounded-full py-3 font-bold text-lg hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center"
                >
                    <Plus class="w-5 h-5 mr-2" />
                    Post
                </button>
            </div>
            <div class="p-4">
                <LowerProfile />
            </div>
        </aside>

        <main class="flex-1 overflow-y-auto bg-background-500">
            <Navbar />
            <div class="container mx-auto px-4 pt-16">
                <Route path="/feed" component={Feed} />
                <Route path="/profile" component={ProfileNip} />
                <Route path="/" component={Feed} />
                <Route path="/explore" component={Explore} />
                <Route path="/UserProfile" component={UserProfile} />
                <Route path="/Feed" component={Feedpage} />
                <Route path="/dash" component={Dashboard} />
                <Route path="/Feed/:id" let:params>
                    <RepliesPage memeId={params.id} />
                </Route>
                <Route path="/relay" component={RelayButtons} />
            </div>
        </main>
    </div>
</Router>

<CreatePostModal
    isOpen={isCreatePostModalOpen}
    on:close={toggleCreatePostModal}
    on:submit={handlePostSubmit}
/>

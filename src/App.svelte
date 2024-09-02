<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import "./app.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import ProfileView from "$lib/components/ProfileView.svelte";
    import UserProfile from "$lib/components/UserProfile.svelte";
    import CreatePostModal from "$lib/components/CreateMeme.svelte";
    import Feed from "$lib/components/Feed.svelte";
    import {
        Home as HomeIcon,
        Search,
        Bell,
        User,
        MoreHorizontal,
        Plus,
    } from "lucide-svelte";
    import { fetchMemes, fetchProfileMemes } from "$lib/ao/mememaker";
    import Feedpage from "$lib/components/Feedpage.svelte";

    export let url = "";

    let isCreatePostModalOpen = false;

    const menuItems = [
        { icon: HomeIcon, label: "Home", href: "/feed" },
        { icon: Search, label: "Explore", href: "/explore" },
        { icon: Bell, label: "Notifications", href: "/UserProfile" },
        { icon: User, label: "Profile", href: "/profile" },
        { icon: User, label: "Feed", href: "/Feed" },
    ];

    function toggleCreatePostModal() {
        isCreatePostModalOpen = !isCreatePostModalOpen;
    }

    //@ts-ignore
    async function handlePostSubmit(event) {
        console.log("New post submitted:", event.detail.content);
        // Handle post submission logic here
    }

</script>

<Router {url}>
    <div class="flex h-screen overflow-hidden">
        <aside
            class="w-64 bg-white shadow-lg flex flex-col justify-between p-4"
        >
            <div class="space-y-4">
                <div class="p-2">
                    <svg
                        class="w-8 h-8 text-secondary-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                        ></path>
                    </svg>
                </div>
                <nav>
                    <ul class="space-y-2">
                        {#each menuItems as item}
                            <li>
                                <a
                                    href={item.href}
                                    class="flex items-center p-2 rounded-full hover:bg-secondary-100 transition-colors duration-200"
                                >
                                    <svelte:component
                                        this={item.icon}
                                        class="w-6 h-6 mr-4 text-primary-500"
                                    />
                                    <span
                                        class="text-lg font-medium text-gray-700"
                                        >{item.label}</span
                                    >
                                </a>
                            </li>
                        {/each}
                        <li>
                            <button
                            on:click={toggleCreatePostModal}
                                class="flex items-center p-2 rounded-full hover:bg-secondary-100 transition-colors duration-200"
                            >
                                <MoreHorizontal
                                    class="w-6 h-6 mr-4 text-primary-500"
                                />
                                <span class="text-lg font-medium text-gray-700"
                                    >More</span
                                >
                            </button>
                        </li>
                    </ul>
                </nav>
                <button
                    on:click={toggleCreatePostModal}
                    class="w-full bg-black text-white rounded-full py-3 font-bold text-lg hover:bg-secondary-600 transition-colors duration-200 flex items-center justify-center"
                >
                    <Plus class="w-5 h-5 mr-2" />
                    Post
                </button>
            </div>
            <div class="p-4">
                <button class="flex items-center space-x-2">
                    <div
                        class="w-10 h-10 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-500 font-bold text-xl"
                    >
                        N
                    </div>
                    <div class="flex-grow text-left">
                        <p class="font-semibold text-gray-800">Nickzz</p>
                        <p class="text-sm text-gray-500">@Nickzz_AO</p>
                    </div>
                    <MoreHorizontal class="w-5 h-5 text-gray-500" />
                </button>
            </div>
        </aside>

        <main class="flex-1 overflow-y-auto bg-[#FFF0F5]">
            <Navbar />
            <div class="container mx-auto px-4 pt-16">
                <Route path="/feed" component={Feed} />
                <Route path="/profile" component={ProfileView} />
                <Route path="/UserProfile" component={UserProfile} />
                <Route path="/Feed" component={Feedpage} />
            </div>
        </main>
    </div>
</Router>

<CreatePostModal
    isOpen={isCreatePostModalOpen}
    on:close={toggleCreatePostModal}
    on:submit={handlePostSubmit}
/>

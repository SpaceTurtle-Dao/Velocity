<script lang="ts">
    import Activity from "lucide-svelte/icons/activity";
    import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";
    import CircleUser from "lucide-svelte/icons/circle-user";
    import CreditCard from "lucide-svelte/icons/credit-card";
    import DollarSign from "lucide-svelte/icons/dollar-sign";
    import Menu from "lucide-svelte/icons/menu";
    import Package2 from "lucide-svelte/icons/package-2";
    import Search from "lucide-svelte/icons/search";
    import Users from "lucide-svelte/icons/users";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { Profile } from "$lib/models/Profile";
    import { Sheet } from "lucide-svelte";

    // import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    // import * as Sheet from "$lib/components/ui/sheet/index.js";
    // import { Badge } from "$lib/components/ui/badge/index.js";

    let profiles: Profile[] = [];

    let selectedProfileId: number | null = null;

    function selectProfile(profileId: number): void {
        selectedProfileId = profileId;
    }
</script>

<div class="flex min-h-screen w-full flex-col">
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card.Root>
                <Card.Header
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm text-white font-medium"
                        >All Relays</Card.Title
                    >
                    <DollarSign class="text-muted-foreground h-4 w-4" />
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">$45,231.89</div>
                    <p class="text-white text-xs">+20.1% from last month</p>
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Header
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm font-medium"
                        >Total Revenue</Card.Title
                    >
                    <DollarSign class="text-muted-foreground h-4 w-4" />
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">$45,231.89</div>
                    <p class="text-muted-foreground text-xs">
                        +20.1% from last month
                    </p>
                </Card.Content>
            </Card.Root>
        </div>
    </main>
</div>

<!-- {#if selectedProfile}
        <div class="posts">
            <h2>Posts for {selectedProfile.name}</h2>
            {#if filteredPosts.length > 0}
                {#each filteredPosts as post (post.id)}
                    <div class="post">
                        <p>{post.content}</p>
                        <span>Likes: {post.likes}</span>
                    </div>
                {/each}
            {:else}
                <p>No posts found for this profile.</p>
            {/if}
        </div>
    {:else}
        <p>Select a profile to view posts.</p>
    {/if} -->

<style>
    main {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .profiles {
        margin-bottom: 20px;
    }

    .profile-list {
        display: flex;
        gap: 10px;
    }

    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .profile.selected {
        background-color: #e0e0e0;
    }

    .profile img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }

    .post {
        background-color: #f0f0f0;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
    }
</style>

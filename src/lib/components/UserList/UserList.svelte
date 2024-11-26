<!-- <script lang="ts">
    import type { Profile, UserInfo } from "$lib/models/Profile";
    import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
    import { onMount } from "svelte";
    import { users } from "$lib/stores/main.store";
    import * as Card from "$lib/components/ui/card/index.js";
    import { currentUser } from "$lib/stores/profile.store";
    import UserListSkeleton from "../Skeletons/UserListSkeleton.svelte";
    import { fetchProfiles } from "$lib/ao/relay";

    let userelays: Profile;
    let title = "You might like";

    let isFetchingUsers: boolean;


    // users.subscribe(
    //     (value) =>
    //         (userelays = value.filter(
    //             (relay) => relay.Process != $currentUser.Process,
    //         )),
    // );

    onMount(async () => {
        userelays = await fetchProfiles("GAWLwhI8OKS0gAQ1KJgp5-9zV_HBxZbcKjPhorWRw9U");
        isFetchingUsers = false;
    });
</script>

<div class="w-full h-full">
    <Card.Root
        data-x-chunk-name="UserList"
        data-x-chunk-description="A card showing a list of users."
        class="border-border rounded p-0 max-w-[380px] min-w-[280px]"
    >
        <Card.Header>
            <Card.Title>{title}</Card.Title>
        </Card.Header>
        <Card.Content class="w-full">
            <div
                class="grid gap-8 max-h-[80vh] overflow-y-auto scrollable-element pr-3 w-full max-w-full"
            >
                {#if isFetchingUsers}
                    <UserListSkeleton />
                {/if}
                {#each userelays as userelay}
                    <ProfileCard data={userelay} />
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
</div>

<style>
    .scrollable-element {
        scrollbar-color: hsl(0, 0%, 45%) hsl(0 0% 14.9%);
        scrollbar-width: thin;
    }
</style> -->

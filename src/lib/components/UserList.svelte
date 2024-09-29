<script lang="ts">
    import type { UserInfo } from "$lib/models/Profile";
    import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
    import { onMount } from "svelte";
    import { relays } from "$lib/ao/relay";
    import { users } from "$lib/stores/main.store";
    import * as Card from "$lib/components/ui/card/index.js";

    let userelays: Array<UserInfo> = [];
    export let title: string | null;

    users.subscribe((value) => (userelays = value));

    onMount(async () => {
        console.log("********Mounted*******");
        await relays("1", "100");
    });
</script>

<div>
    <Card.Root
        data-x-chunk-name="UserList"
        data-x-chunk-description="A card showing a list of users."
        class="border-border rounded"
    >
        <Card.Header>
            {#if title}
            <Card.Title>{title}</Card.Title>
            {/if}
        </Card.Header>
        <Card.Content class="grid gap-8">
            {#each userelays as userelay}
                <ProfileCard data={userelay} />
            {/each}
        </Card.Content>
    </Card.Root>
</div>
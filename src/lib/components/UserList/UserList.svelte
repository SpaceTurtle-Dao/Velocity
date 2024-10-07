<script lang="ts">
    import type { UserInfo } from "$lib/models/Profile";
    import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
    import { onMount } from "svelte";
    import { relays } from "$lib/ao/relay";
    import { users } from "$lib/stores/main.store";
    import * as Card from "$lib/components/ui/card/index.js";

    let userelays: Array<UserInfo> = [];
    let title = "You might like"

    users.subscribe((value) => (userelays = value));

    onMount(async () => {
        console.log("********Mounted*******");
        await relays("1", "100");
        console.log("userelays after 10 seconds:", userelays);
    });
</script>

<div>
    <Card.Root
        data-x-chunk-name="UserList"
        data-x-chunk-description="A card showing a list of users."
        class="border-border rounded"
    >
        <Card.Header>
            <Card.Title>{title}</Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-8">
            {#each userelays as userelay}
                <ProfileCard data={userelay} />
            {/each}
        </Card.Content>
    </Card.Root>
</div>
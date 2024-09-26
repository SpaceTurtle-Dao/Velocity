<script lang="ts">
    import type { UserInfo } from "$lib/models/Profile";
    import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
    import { onMount } from "svelte";
    import { relays } from "$lib/ao/relay";
    import { users } from "$lib/stores/main.store";

    let userelays: Array<UserInfo> = [];

    users.subscribe((value) => (userelays = value));

    onMount(async () => {
        console.log("********Mounted*******");
        await relays("1", "100");
    });
</script>

<div>
    <div class="flex flex-col space-y-2">
        {#each userelays as userelay}
            <ProfileCard data={userelay} />
        {/each}
    </div>
</div>

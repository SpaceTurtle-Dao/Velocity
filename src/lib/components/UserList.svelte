<script lang="ts">
    import type { UserInfo } from "$lib/models/Profile";
    import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
    import { onMount } from "svelte";
    import { relays } from "$lib/ao/relay";
    import { users } from "$lib/stores/main.store";

    let userelays: Array<UserInfo> = [];
    
    onMount(async () => {
        console.log("********Mounted*******");
        userelays = await relays("1", "100");
    });
    
</script>

<div>
    {#each userelays as userelay}
        <ProfileCard data={userelay} />
    {/each}
</div>

<script lang="ts">
    import type { UserInfo } from "$lib/models/Profile";
    import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
    import { onMount } from "svelte";
    import { relays } from "$lib/ao/relay";

    let _users: Array<UserInfo>;

    onMount(async () => {
        console.log("getting users");
        _users = await relays("1", "100");
        console.log(_users);
    });
</script>

{#if _users}
    {#each _users as _user}
        <ProfileCard {_user} />
    {/each}
{/if}

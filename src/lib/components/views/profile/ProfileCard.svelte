<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { currentUser } from "$lib/stores/profile.store";
    import { profileFromEvent, type UserInfo } from "$lib/models/Profile";
    import Follow from "./Follow.svelte";
    import { onMount } from "svelte";

    export let data: UserInfo;

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }

    onMount(async () => {
        console.log("got user")
        console.log(data)
        
    });
</script>

<div class="border border-border w-2/3 p-5">
    <div class="flex justify-between ">
        <div class="flex space-x-2">
            <Avatar.Root class="h-12 w-12">
                {#if profileFromEvent(data.Profile).picture}
                    <Avatar.Image
                        src={profileFromEvent(data.Profile).picture}
                        alt="Avatar"
                    />
                {/if}
                <Avatar.Fallback>OM</Avatar.Fallback>
            </Avatar.Root>
    
            <div>
                <p class="text-sm font-medium leading-none text-primary">
                    {profileFromEvent(data.Profile).name}
                </p>
                <p class="text-muted-foreground text-sm text-secondary">
                    {profileFromEvent(data.Profile).display_name}
                </p>
            </div>
        </div>
        <Follow
            relay={data.Profile.pubkey}
            userRelay={$currentUser.Profile.pubkey}
            token={data.Token}
            quantity={data.SubscriptionCost.toString()}
        />
    </div>
    <article class="pl-11 pb-6 pt-1 text-primary text-wrap ...">
        {#if profileFromEvent(data.Profile).about}
            <p>{profileFromEvent(data.Profile).about}</p>
        {/if}
    </article>
</div>

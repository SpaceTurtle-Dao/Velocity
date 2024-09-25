<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { currentUser } from "$lib/stores/profile.store";
    import { profileFromEvent, type UserInfo } from "$lib/models/Profile";
    import Follow from "./Follow.svelte";
    import { onMount } from "svelte";

    export let _user: UserInfo;

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }

    onMount(async () => {
        console.log("got user")
        console.log(_user)
        
    });
</script>

<div class="border border-border w-2/3 p-5">
    <div class="flex justify-between ">
        <div class="flex space-x-2">
            <Avatar.Root class="h-12 w-12">
                {#if profileFromEvent(_user.Profile).picture}
                    <Avatar.Image
                        src={profileFromEvent(_user.Profile).picture}
                        alt="Avatar"
                    />
                {/if}
                <Avatar.Fallback>OM</Avatar.Fallback>
            </Avatar.Root>
    
            <div>
                <p class="text-sm font-medium leading-none text-primary">
                    {profileFromEvent(_user.Profile).name}
                </p>
                <p class="text-muted-foreground text-sm text-secondary">
                    {profileFromEvent(_user.Profile).display_name}
                </p>
            </div>
        </div>
        <Follow
            relay={_user.Profile.pubkey}
            userRelay={$currentUser.Profile.pubkey}
            token={_user.Token}
            quantity={_user.SubscriptionCost.toString()}
        />
    </div>
    <article class="pl-11 pb-6 pt-1 text-primary text-wrap ...">
        {#if profileFromEvent(_user.Profile).about}
            <p>{profileFromEvent(_user.Profile).about}</p>
        {/if}
    </article>
</div>
